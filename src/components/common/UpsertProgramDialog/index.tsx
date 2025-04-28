import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProgramData, useUpsertProgram } from "@/hooks/database/programs";
import { useEvilMemo } from "@/hooks/useEvilMemo";
import { Must } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z, ZodTypeAny } from "zod";

export const UpsertProgramDialog = ({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: (b: boolean) => void;
  data: ProgramData | null;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={() => {}}>
      <AlertDialogContent className="flex flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {data ? "Edit" : "Create"} Program
          </AlertDialogTitle>
          <AlertDialogDescription>
            Setup the base details of your program.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <UpsertForm data={data} setOpen={setOpen} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

type EditableProgramData = Must<
  Omit<ProgramData, "id" | "created_at" | "updated_at">
>;

const schema = z.object({
  title: z.string().min(1, "A title is required!"),
  link: z
    .string()
    .refine(
      (str) => (str ? /^https?:\/\//gm.test(str) : true),
      "Invalid link!",
    ),
  notes: z.string(),
} satisfies Record<keyof EditableProgramData, ZodTypeAny>);
type Schema = z.infer<typeof schema>;

const UpsertForm = ({
  data,
  setOpen,
}: {
  setOpen: (b: boolean) => void;
  data: ProgramData | null;
}) => {
  const { mutate, isPending } = useUpsertProgram();

  const form = useEvilMemo(
    () =>
      useForm<Schema>({
        resolver: zodResolver(schema),
        mode: "onBlur",
        defaultValues: data
          ? {
              title: data.title,
              link: data.link ?? "",
              notes: data.notes ?? "",
            }
          : {
              title: "",
              link: "",
              notes: "",
            },
      }),
    [data],
  );

  const closeWithoutSaving = () => {
    form?.reset();
    setOpen(false);
  };

  return (
    form && (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            mutate(
              {
                ...data,
                ...values,
                id: data?.id,
              },
              { onSuccess: () => setOpen(false) },
            );
          })}
          className="space-y-8 p-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Beginner PPL" {...field} />
                </FormControl>
                <FormDescription>The title of the program</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormDescription>
                  Link to the source of the program or otherwise helpful
                  information
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  Any additional info to jot down
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeWithoutSaving}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : "save"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </Form>
    )
  );
};
