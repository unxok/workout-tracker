import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { ProgramData, useGetPrograms } from "@/hooks/database/programs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgramCard } from "@/components/common/ProgramCard";
import { ProgramCardSkeleton } from "@/components/common/ProgramCardSkeleton";
import { UpsertProgramDialog } from "@/components/common/UpsertProgramDialog";

type DialogState = { open: boolean; data: ProgramData | null };

type Sort =
  | "created-asc"
  | "created-desc"
  | "updated-asc"
  | "updated-desc"
  | "title-asc"
  | "title-desc";

export const Programs = () => {
  const [search, setSearch] = useState("");
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    data: null,
  });
  const [sort, setSort] = useState<Sort>("created-asc");

  const { data: programs, isPending: programsIsPending } = useGetPrograms();

  const filteredPrograms = useMemo(() => {
    if (!programs) return [] as typeof filtered;
    const lower = search.toLowerCase();

    const filtered =
      search === ""
        ? [...programs]
        : programs.filter((p) => p.title.toLowerCase().includes(lower));

    return filtered.sort((a, b) => {
      if (sort === "created-asc")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      if (sort === "created-desc")
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      if (sort === "updated-asc")
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      if (sort === "updated-desc")
        return (
          new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
        );
      if (sort === "title-asc")
        return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
      if (sort === "title-desc")
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      return 0;
    });
  }, [programs, search, sort]);

  return (
    <div className="flex h-full w-full items-start justify-center">
      <div className="w-full max-w-[60ch] pt-28 sm:max-w-[110ch] sm:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-wide sm:text-4xl">
            Programs
          </h2>
          <div className="text-balance">
            A defined set of exercises split among blocks
          </div>
        </div>
        <div className="mx-auto max-w-[110ch] px-2 py-3">
          <div className="mx-auto max-w-[80ch]">
            <div className="flex w-full flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="relative flex w-full">
                <Input
                  className="w-full"
                  type="search"
                  placeholder="Program name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  className="hover:text-muted-foreground absolute right-2 hover:bg-transparent hover:dark:bg-transparent"
                  style={{
                    display: !search ? "none" : undefined,
                  }}
                  variant={"ghost"}
                  onClick={() => setSearch("")}
                >
                  <XCircle className="text-inherit" />
                </Button>
              </div>
              <Button
                className="w-full sm:w-fit"
                onClick={() => {
                  setDialogState({ open: true, data: null });
                }}
              >
                new program
              </Button>
              <UpsertProgramDialog
                open={dialogState.open}
                setOpen={(open) =>
                  setDialogState((prev) => ({ ...prev, open }))
                }
                data={dialogState.data}
              />
            </div>
            <div className="mx-auto flex w-full items-center justify-start gap-4 py-2">
              <div>
                showing {filteredPrograms.length} of {programs?.length ?? 0}{" "}
                results
              </div>
              <Select
                defaultValue="created-asc"
                onValueChange={(v) => {
                  setSort(v as Sort);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"created-asc" satisfies Sort}>
                    created (latest - oldest)
                  </SelectItem>
                  <SelectItem value={"created-desc" satisfies Sort}>
                    created (oldest - latest)
                  </SelectItem>
                  <SelectItem value={"updated-asc" satisfies Sort}>
                    updated (latest - oldest)
                  </SelectItem>
                  <SelectItem value={"updated-desc" satisfies Sort}>
                    updated (oldest - latest)
                  </SelectItem>
                  <SelectItem value={"title-asc" satisfies Sort}>
                    title (latest - oldest)
                  </SelectItem>
                  <SelectItem value={"title-desc" satisfies Sort}>
                    title (oldest - latest)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mx-auto flex w-full flex-wrap justify-center gap-4 pt-4">
            {programsIsPending && (
              <>
                <ProgramCardSkeleton />
                <ProgramCardSkeleton />
                <ProgramCardSkeleton />
                <ProgramCardSkeleton />
              </>
            )}
            {!programsIsPending && !filteredPrograms.length && (
              <div className="text-muted-foreground w-full text-center">
                No programs yet. Click the <strong>create program</strong>{" "}
                button to make your first one!
              </div>
            )}
            {filteredPrograms.map((props) => (
              <ProgramCard
                key={"program" + props.id}
                {...props}
                setDialogData={(data) => setDialogState({ data, open: true })}
              />
            ))}
            {filteredPrograms.length && (
              // TODO to fix the spacing and still justify-center the flex items
              <>
                <ProgramCardSkeleton
                  cardProps={{
                    "aria-hidden": true,
                    className:
                      "text-transparent bg-transparent border-transparent shadow-none **:bg-transparent",
                  }}
                />
                <ProgramCardSkeleton
                  cardProps={{
                    "aria-hidden": true,
                    className:
                      "text-transparent bg-transparent border-transparent shadow-none **:bg-transparent",
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
