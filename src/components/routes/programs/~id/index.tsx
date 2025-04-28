import { SimpleTooltip } from "@/components/common/SimpleTooltip";
import { Button, buttonVariants } from "@/components/ui/button";
import { useGetProgram, useUpsertProgram } from "@/hooks/database/programs";
import { ChevronLeft, ExternalLink, Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/components/common/routing";
import { cn } from "@/lib/utils";
import { UpsertProgramDialog } from "@/components/common/UpsertProgramDialog";

export const ProgramsId = () => {
  const [isDialogShown, setIsDialogShown] = useState(false);

  const { id } = useParams();
  const { data, isPending, error } = useGetProgram({ id: Number(id) });
  const update = useUpsertProgram();
  const [updatedNotes, setUpdatedNotes] = useState(data?.notes ?? "");

  useEffect(() => {
    setUpdatedNotes(data?.notes ?? "");
    console.log("refetched: ", data);
  }, [data]);

  return (
    <>
      {isPending && !error && (
        <div className="flex size-full items-center justify-center">
          <Loader2 className="animate-spin" size={50} />
        </div>
      )}
      {data && (
        <div className="flex h-full w-full items-start justify-center">
          <div className="min-w-[150ch] pt-28">
            <div className="relative text-center">
              <Link
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "absolute top-2 left-2 translate-x-full",
                )}
                to={"/programs"}
              >
                <ChevronLeft size="1rem" />
                All programs
              </Link>
              <h2 className="flex items-center justify-center text-4xl font-bold tracking-wide">
                <div className="relative">
                  {data.title}
                  <SimpleTooltip msg={"Edit"}>
                    <Button
                      className="absolute top-1/2 right-0 translate-x-full -translate-y-1/2"
                      variant={"ghost"}
                      onClick={() => setIsDialogShown(true)}
                    >
                      <Pencil />
                    </Button>
                  </SimpleTooltip>
                </div>
              </h2>
              <div className="flex w-full items-center justify-center">
                <div>
                  created {new Date(data.created_at).toLocaleDateString()}
                </div>
                {data.link && (
                  <>
                    <span className="px-2">&bull;</span>
                    <a
                      href={data.link}
                      className="hover:text-muted-foreground flex items-center underline-offset-4 hover:underline"
                    >
                      link&nbsp;
                      <ExternalLink size={"1rem"} />
                    </a>
                  </>
                )}
              </div>
            </div>
            <div className="mx-auto flex w-full max-w-[90ch] justify-center py-4">
              <div className="flex w-full flex-col items-center justify-center">
                <Textarea
                  value={updatedNotes}
                  onChange={(e) => setUpdatedNotes(e.target.value)}
                />
                <div className="ml-auto flex items-center gap-2 pt-2">
                  <Button
                    variant={"ghost"}
                    disabled={data.notes === updatedNotes}
                  >
                    cancel
                  </Button>
                  <Button
                    variant={"outline"}
                    disabled={data.notes === updatedNotes}
                    onClick={() =>
                      update.mutate({
                        ...data,
                        notes: updatedNotes,
                      })
                    }
                  >
                    {update.isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "save"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <UpsertProgramDialog
            data={data}
            open={isDialogShown}
            setOpen={setIsDialogShown}
          />
        </div>
      )}
      {!isPending && !data && <PageNotFound message={error?.message} />}
    </>
  );
};

const PageNotFound = ({ message }: { message?: string }) => (
  <div className="flex size-full items-start justify-center">
    <div className="w-full max-w-[60ch] pt-28 sm:max-w-[110ch] sm:px-8">
      <div className="text-center">
        <div className="font-mono text-8xl font-bold tracking-wide">404</div>
        <h2 className="text-3xl font-bold tracking-wide sm:text-4xl">
          Page not found
        </h2>
        <div className="text-balance">
          You've stumbled across a page that doesn't seem to exist!
        </div>
        <br />
        {message && (
          <div className="bg-card text-card-foreground rounded-md border p-4">
            {message}
          </div>
        )}
      </div>
    </div>
  </div>
);
