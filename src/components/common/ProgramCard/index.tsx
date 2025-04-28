import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  ProgramData,
  useDeleteProgram,
  useUpsertProgram,
} from "@/hooks/database/programs";
import { Edit2, CopyPlus, Trash2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { ProgramCardPresentational } from "../ProgramCardPresentational";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const ProgramCard = ({
  setDialogData,
  ...props
}: ProgramData & {
  setDialogData: (data: ProgramData | null) => void;
}) => {
  const { id, created_at, updated_at, title, link, notes } = props;
  const { mutate } = useDeleteProgram();
  const duplicate = useUpsertProgram();
  const [isDeleteDialogShwon, setIsDialogShown] = useState(false);

  return (
    <>
      <ProgramCardPresentational
        elipsesDropdownMenuContent={
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setDialogData(props)}>
              Edit
              <Edit2 className="ml-auto" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                duplicate.mutate({
                  ...props,
                  id: undefined,
                  title: props.title + "- Copy",
                });
              }}
            >
              Duplicate
              <CopyPlus className="ml-auto" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setIsDialogShown(true)}
            >
              Delete
              <Trash2 className="ml-auto text-inherit" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        }
        createdAt={
          <div>created {new Date(created_at).toLocaleDateString()}</div>
        }
        updatedAt={
          <div>updated {new Date(updated_at).toLocaleDateString()}</div>
        }
        cardTitle={
          <CardTitle className="hover:text-muted-foreground line-clamp-1 cursor-pointer leading-6 underline underline-offset-3">
            <Link to={`/programs/${id}`}>{title}</Link>
          </CardTitle>
        }
        notes={
          <div
            className="tiptap ProseMirror line-clamp-2 w-full p-0!"
            role="textbox"
            dangerouslySetInnerHTML={{ __html: notes ?? "" }}
          />
        }
        link={
          <a
            href={link ?? ""}
            // this is to make sure the cards are the same height without explicitly setting one for the whole card
            aria-hidden={!link}
            className={`hover:text-muted-foreground ml-auto flex cursor-pointer items-center gap-1 ${!link ? "text-transparent" : ""}`}
          >
            link <ExternalLink size={"1rem"} />
          </a>
        }
      />
      <AlertDialog
        open={isDeleteDialogShwon}
        onOpenChange={(b) => setIsDialogShown(b)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will <strong>permanently</strong> delete this program!
            </AlertDialogDescription>
            Program title: {title}
            <AlertDialogFooter>
              <AlertDialogCancel>cancel</AlertDialogCancel>
              <AlertDialogAction
                className={buttonVariants({ variant: "destructive" })}
                onClick={() => mutate({ id })}
              >
                delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
