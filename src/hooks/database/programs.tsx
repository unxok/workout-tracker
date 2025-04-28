import { db } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Database } from "@/lib/database.types";
import { useGetUser } from "./auth";
import { PartialProps } from "@/lib/utils";

const GET_PROGRAMS_QUERY_KEY = "get-programs";

type ProgramCols = Database["public"]["Tables"]["programs"]["Row"];
type ProgramData = Omit<ProgramCols, "created_by">;
const useGetPrograms = () => {
  const { data: user } = useGetUser();

  return useQuery({
    queryKey: [GET_PROGRAMS_QUERY_KEY, GET_PROGRAM_QUERY_KEY, user],
    queryFn: async () => {
      if (!user) return [] satisfies ProgramData[];

      const { data, error } = await db
        .from("programs")
        .select("id, created_at, link, notes, title, updated_at")
        .eq("created_by", user.id);

      if (error) {
        toast.error(
          <>
            <div>Failed to get programs!</div>
            <div>{error.message}</div>
          </>,
        );
        return [] satisfies ProgramData[];
      }

      return data;
    },
  });
};

type MutationProps = PartialProps<
  ProgramData,
  "id" | "created_at" | "updated_at"
>;

const useUpsertProgram = () => {
  const { data: user } = useGetUser();
  const qc = useQueryClient();

  return useMutation({
    mutationKey: [user],
    mutationFn: async (params: MutationProps) => {
      if (!user) return;

      const { error } = await db.from("programs").upsert(
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
            <div>Failed to create/update program!</div>
            <div>{error.message}</div>
          </>,
        );
        return;
      }
    },
    onSuccess: (_, params) => {
      toast.success(`Program ${params.id ? "updated" : "created"}!`);
      return qc.refetchQueries({
        predicate: (query) =>
          query.queryKey.includes(GET_PROGRAM_QUERY_KEY) ||
          query.queryKey.includes(GET_PROGRAMS_QUERY_KEY),
      });
    },
  });
};

const useDeleteProgram = () => {
  const qc = useQueryClient();
  const { data: user } = useGetUser();

  return useMutation({
    mutationKey: [user],
    mutationFn: async ({ id }: { id: number }) => {
      if (!user) return;
      const { error } = await db.from("programs").delete().eq("id", id);
      if (error) {
        toast.error(
          <>
            <div>Failed to delete program!</div>
            <div>{error.message}</div>
          </>,
        );
        return;
      }
    },
    onSuccess: () => {
      return qc.refetchQueries({
        predicate: (query) =>
          query.queryKey.includes(GET_PROGRAM_QUERY_KEY) ||
          query.queryKey.includes(GET_PROGRAMS_QUERY_KEY),
      });
    },
  });
};

const GET_PROGRAM_QUERY_KEY = "get-program";

const useGetProgram = ({ id }: { id: number }) => {
  const { data: user } = useGetUser();

  return useQuery({
    queryKey: [GET_PROGRAM_QUERY_KEY, user],
    queryFn: async () => {
      if (!user) throw new Error("You must be logged in!");

      const { data, error } = await db
        .from("programs")
        .select("id, created_at, link, notes, title, updated_at")
        .eq("id", id);

      if (error) {
        toast.error(
          <>
            <div>Failed to get program!</div>
            <div>{error.message}</div>
          </>,
        );
        throw new Error(error.message);
      }

      if (!data[0]) throw new Error("No program found by id " + id);
      return data[0];
    },
  });
};

export {
  GET_PROGRAMS_QUERY_KEY,
  type ProgramData,
  useGetPrograms,
  type ProgramData as ProgramCols,
  type MutationProps,
  useUpsertProgram,
  useDeleteProgram,
  GET_PROGRAM_QUERY_KEY,
  useGetProgram,
};
