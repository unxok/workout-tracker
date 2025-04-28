import { Database } from "@/lib/database.types";
import { db } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export type MuscleCols = Database["public"]["Tables"]["muscles"]["Row"];

export const GET_MUSCLES_QUERY_KEY = "get-muscles";
export const useGetMuscles = () => {
  return useQuery({
    queryKey: [GET_MUSCLES_QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await db.from("muscles").select("id, title");

      if (error) {
        toast.error(
          <>
            <div>Failed to get muscles!</div>
            <div>{error.message}</div>
          </>,
        );
        return [] as NonNullable<typeof data>;
      }

      return data;
    },
  });
};
