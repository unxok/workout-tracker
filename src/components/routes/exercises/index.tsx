import { UpsertExerciseDialog } from "@/components/common/UpsertExerciseDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExerciseData, useGetExercises } from "@/hooks/database/exercises";
import { CopyPlus, Edit2, Ellipsis, Trash2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

type DialogState = { open: boolean; data: ExerciseData | null };

type Sort =
  | "created-asc"
  | "created-desc"
  | "updated-asc"
  | "updated-desc"
  | "title-asc"
  | "title-desc";

export const Exercises = () => {
  const [search, setSearch] = useState("");
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    data: null,
  });
  const [sort, setSort] = useState<Sort>("created-asc");

  const { data: exercies, isPending } = useGetExercises();

  const filteredExercises = useMemo(() => {
    if (!exercies) return [] as typeof filtered;
    const lower = search.toLowerCase();

    const filtered =
      search === ""
        ? [...exercies]
        : exercies.filter((p) => p.title.toLowerCase().includes(lower));

    return filtered;
  }, [exercies, search, sort]);
  return (
    <div className="flex h-full w-full items-start justify-center">
      <div className="w-full max-w-[60ch] pt-28 sm:max-w-[110ch] sm:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-wide sm:text-4xl">
            Exercises
          </h2>
          <div className="text-balance">
            Activity requiring physical effort, carried out to sustain or
            improve health and fitness
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
                  // value={search}
                  // onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  className="hover:text-muted-foreground absolute right-2 hover:bg-transparent hover:dark:bg-transparent"
                  style={
                    {
                      // display: !search ? "none" : undefined,
                    }
                  }
                  variant={"ghost"}
                  // onClick={() => setSearch("")}
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
              <UpsertExerciseDialog
                open={dialogState.open}
                setOpen={(open) =>
                  setDialogState((prev) => ({ ...prev, open }))
                }
                data={dialogState.data}
              />
            </div>
            <div className="mx-auto flex w-full items-center justify-start gap-4 py-2">
              <div>results</div>
            </div>
          </div>
          <div className="mx-auto flex w-full flex-wrap justify-center gap-4 pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Muscle</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>&nbsp;</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exercies?.map(
                  ({
                    id,
                    title,
                    link,
                    notes,
                    created_at,
                    primary_muscle,
                    target_type,
                    updated_at,
                  }) => (
                    <TableRow key={"exercise-table-row" + id}>
                      <TableCell>{title}</TableCell>
                      <TableCell>
                        {!!link && <a href={link}>{link}</a>}
                        {!link && "-"}
                      </TableCell>
                      <TableCell>{target_type}</TableCell>
                      <TableCell>{primary_muscle}</TableCell>
                      <TableCell>
                        {new Date(created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{notes}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"} className="h-full p-1!">
                              <Ellipsis />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() =>
                                setDialogState({
                                  open: true,
                                  data: {
                                    id,
                                    title,
                                    link,
                                    notes,
                                    created_at,
                                    primary_muscle,
                                    target_type,
                                    updated_at,
                                  },
                                })
                              }
                            >
                              Edit
                              <Edit2 className="ml-auto" />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                            // onClick={() => {
                            //   duplicate.mutate({
                            //     ...props,
                            //     id: undefined,
                            //     title: props.title + "- Copy",
                            //   });
                            // }}
                            >
                              Duplicate
                              <CopyPlus className="ml-auto" />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              // onClick={() => setIsDialogShown(true)}
                            >
                              Delete
                              <Trash2 className="ml-auto text-inherit" />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExerciseRow = () => {
  //
  return <div>TO DO</div>;
};
