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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ExerciseData, useUpsertExercise } from "@/hooks/database/exercises";
import { useEvilMemo } from "@/hooks/useEvilMemo";
import { Must } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z, ZodTypeAny } from "zod";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useGetMuscles } from "@/hooks/database/muscles";

export const UpsertExerciseDialog = ({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: (b: boolean) => void;
  data: ExerciseData | null;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={() => {}}>
      <AlertDialogContent className="flex flex-col">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {data ? "Edit" : "Create"} Exercise
          </AlertDialogTitle>
          <AlertDialogDescription>
            Setup an exercise to be able to use in your programs.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <UpsertForm data={data} setOpen={setOpen} />
      </AlertDialogContent>
    </AlertDialog>
  );
};

type EditableExerciseData = Must<
  Omit<ExerciseData, "id" | "created_at" | "updated_at">
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
  primary_muscle: z.number(),
  target_type: z.union([
    z.literal("isolation" satisfies ExerciseData["target_type"]),
    z.literal("compound" satisfies ExerciseData["target_type"]),
  ]),
} satisfies Record<keyof EditableExerciseData, ZodTypeAny>);

type Schema = z.infer<typeof schema>;

const UpsertForm = ({
  data,
  setOpen,
}: {
  setOpen: (b: boolean) => void;
  data: ExerciseData | null;
}) => {
  const { mutate, isPending } = useUpsertExercise();
  const muscles = useGetMuscles();

  const musclesRecord = useMemo(() => {
    return (
      muscles.data?.reduce(
        (acc, { id, title }) => {
          acc[id] = title;
          return acc;
        },
        {} as Record<number, string>,
      ) ?? ({} as Record<number, string>)
    );
  }, [muscles]);

  useEffect(() => {
    console.log("data: ", data);
  }, [data]);

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
              primary_muscle: data.primary_muscle ?? undefined,
              target_type: data.target_type,
            }
          : {
              title: "",
              link: "",
              notes: "",
              primary_muscle: undefined,
              target_type: "isolation",
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
                <FormDescription>The title of the exercise</FormDescription>
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
                  Link to a tutorial of the exercise or otherwise helpful
                  information
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="target_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    onValueChange={(v) =>
                      form.setValue(
                        field.name,
                        v as ExerciseData["target_type"],
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value={
                          "isolation" satisfies ExerciseData["target_type"]
                        }
                      >
                        Isolation
                      </SelectItem>
                      <SelectItem
                        value={"compound" satisfies ExerciseData["target_type"]}
                      >
                        Compound
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>The type of exercise this is</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="primary_muscle"
            render={({ field: { value, onChange, ...restField } }) => (
              <FormItem>
                <FormLabel>Primary primary_muscle</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        {...restField}
                        // aria-expanded={open} TODO
                        className="w-[200px] justify-between"
                      >
                        {!muscles.isPending && value !== undefined
                          ? musclesRecord[value]
                          : "Select a muscle..."}
                        {muscles.isPending && (
                          <Loader2 className="animate-spin" />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command
                        filter={(v, s) =>
                          musclesRecord[Number(v)]
                            .toLowerCase()
                            .includes(s.toLowerCase())
                            ? 1
                            : 0
                        }
                      >
                        <CommandInput placeholder="Search muscles" />
                        <CommandList>
                          <CommandEmpty>No muscle found</CommandEmpty>
                          <CommandGroup>
                            {muscles.data?.map(({ id, title }) => (
                              <CommandItem
                                key={"muscle-option" + id}
                                value={id.toString()}
                                onSelect={(v) => {
                                  const num = Number(v);
                                  form.setValue("primary_muscle", num);
                                }}
                              >
                                {title}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormDescription>The type of exercise this is</FormDescription>
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
