import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/supabase";

export const GET_USERNAME_QUERY_KEY = "get-username";
export const GET_USER_QUERY_KEY = "get-user";

export const useGetUsername = () => {
  const userQuery = useGetUser();

  const usernameQuery = useQuery({
    queryKey: [GET_USERNAME_QUERY_KEY, userQuery.data],
    queryFn: async () => {
      if (!userQuery.data) return null;
      const { data: data2 } = await db
        .from("profiles")
        .select("username")
        .eq("user_id", userQuery.data.id);
      return data2?.[0]?.username ?? null;
    },
  });

  return { userQuery, usernameQuery };
};

export const useGetUser = () => {
  const query = useQuery({
    queryKey: [GET_USER_QUERY_KEY],
    queryFn: async () => {
      const {
        data: { user },
      } = await db.auth.getUser();
      return user;
    },
  });

  return query;
};
