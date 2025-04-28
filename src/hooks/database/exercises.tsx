import { db } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Database } from "@/lib/database.types";
import { useGetUser } from "./auth";
import { PartialProps } from "@/lib/utils";

const GET_EXERCISES_QUERY_KEY = "get-exercises";

type ExerciseCols = Database["public"]["Tables"]["exercises"]["Row"];
type ExerciseData = Omit<ExerciseCols, "created_by">;

const useGetExercises = () => {
  const { data: user } = useGetUser();

  return useQuery({
    queryKey: [GET_EXERCISES_QUERY_KEY, GET_EXERCISE_QUERY_KEY, user],
    queryFn: async () => {
      if (!user) return [] satisfies ExerciseData[];

      const { data, error } = await db
        .from("exercises")
        .select(
          "id, created_at, link, notes, title, updated_at, primary_muscle, target_type",
        )
        .eq("created_by", user.id);

      if (error) {
        toast.error(
          <>
            <div>Failed to get programs!</div>
            <div>{error.message}</div>
          </>,
        );
        return [] satisfies ExerciseData[];
      }

      return data;
    },
  });
};

type MutationProps = PartialProps<
  ExerciseData,
  "id" | "created_at" | "updated_at"
>;

const useUpsertExercise = () => {
  const { data: user } = useGetUser();
  const qc = useQueryClient();

  return useMutation({
    mutationKey: [user],
    mutationFn: async (params: MutationProps) => {
      if (!user) return;

      const { error } = await db.from("exercises").upsert(
        {
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          created_by: user.id,
          ...params,
        },
        { onConflict: "id", ignoreDuplicates: false },
      );

      if (error) {
        toast.error(
          <>
            <div>Failed to create/update exercise!</div>
            <div>{error.message}</div>
          </>,
        );
        return;
      }
    },
    onSuccess: (_, params) => {
      toast.success(`Exercise ${params.id ? "updated" : "created"}!`);
      return qc.refetchQueries({
        predicate: (query) =>
          query.queryKey.includes(GET_EXERCISE_QUERY_KEY) ||
          query.queryKey.includes(GET_EXERCISES_QUERY_KEY),
      });
    },
  });
};

const useDeleteExercise = () => {
  const qc = useQueryClient();
  const { data: user } = useGetUser();

  return useMutation({
    mutationKey: [user],
    mutationFn: async ({ id }: { id: number }) => {
      if (!user) return;
      const { error } = await db.from("exercises").delete().eq("id", id);
      if (error) {
        toast.error(
          <>
            <div>Failed to delete exercise!</div>
            <div>{error.message}</div>
          </>,
        );
        return;
      }
    },
    onSuccess: () => {
      return qc.refetchQueries({
        predicate: (query) =>
          query.queryKey.includes(GET_EXERCISE_QUERY_KEY) ||
          query.queryKey.includes(GET_EXERCISES_QUERY_KEY),
      });
    },
  });
};

const GET_EXERCISE_QUERY_KEY = "get-exercise";

const useGetExercise = ({ id }: { id: number }) => {
  const { data: user } = useGetUser();

  return useQuery({
    queryKey: [GET_EXERCISE_QUERY_KEY, user],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await db
        .from("exercises")
        .select("id, created_at, link, notes, title, updated_at")
        .eq("id", id);

      if (error) {
        toast.error(
          <>
            <div>Failed to get exercise!</div>
            <div>{error.message}</div>
          </>,
        );
        return null;
      }

      return data[0];
    },
  });
};

export {
  GET_EXERCISES_QUERY_KEY,
  type ExerciseData,
  useGetExercises,
  type ExerciseCols,
  type MutationProps,
  useUpsertExercise,
  useDeleteExercise,
  GET_EXERCISE_QUERY_KEY,
  useGetExercise,
};
