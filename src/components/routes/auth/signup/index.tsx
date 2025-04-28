import { FormValue, FormField } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { db } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Eye, EyeOff, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "@/components/common/routing";
import { toast } from "sonner";
import { GET_USERNAME_QUERY_KEY } from "@/hooks/database/auth";

export const Signup = () => {
  const [username, setUsername] = useState<FormValue>({ value: "" });
  const [email, setEmail] = useState<FormValue>({
    value: "",
    isValid: true,
  });
  const [password, setPassword] = useState<FormValue>({
    value: "",
    isValid: true,
  });
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const qc = useQueryClient();

  const signupMutation = useMutation({
    mutationFn: async ({
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    }) => {
      await db.auth.signOut();
      const signupResponse = await db.auth.signUp({
        email,
        password,
      });
      if (signupResponse.error || !signupResponse.data.user) {
        console.log(signupResponse.error);
        toast.error(
          <div className="flex flex-col gap-2">
            <span>
              <b>Failed to create account!</b>
            </span>
            <span>
              {signupResponse.error?.message ??
                "No user data returned from server"}
            </span>
          </div>,
        );
        return;
      }

      qc.refetchQueries({ queryKey: [GET_USERNAME_QUERY_KEY] });

      const createProfileResponse = await db.from("profiles").insert([
        {
          user_id: signupResponse.data.user.id,
          username,
        },
      ]);
      if (!createProfileResponse.error) return;
      console.log(createProfileResponse.error);
      toast.error(
        <div className="flex flex-col gap-2">
          <span>
            <b>Failed to create account!</b>
          </span>
          <span>
            {createProfileResponse.error?.message ??
              "No user data returned from server"}
          </span>
        </div>,
      );
    },
  });

  return (
    <div className="flex h-full w-full items-start justify-center">
      <div className="min-w-[45ch] pt-[10%]">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-wide">Sign up</h2>
          <div>omg someone wants to use this thing??</div>
        </div>
        <form
          className="flex flex-col gap-3 py-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <FormField
            label="Username"
            formValue={username}
            setFormValue={setUsername}
            type="text"
            placeholder="johndoe"
            validators={[]}
          >
            <UsernameUniqueness
              username={username.value}
              setIsUnique={(isValid) =>
                setUsername((prev) => ({ ...prev, isValid }))
              }
            />
          </FormField>
          <FormField
            label="Email"
            formValue={email}
            setFormValue={setEmail}
            type="email"
            placeholder="johndoe@example.com"
            validators={[
              {
                validate: (v) => v.includes("@"),
                message: (
                  <>
                    Enter a <b>valid</b> email address!
                  </>
                ),
              },
            ]}
          />
          <FormField
            label="Password"
            formValue={password}
            setFormValue={setPassword}
            type={isPasswordShown ? "text" : "password"}
            validators={[
              {
                validate: (v) => v.length >= 6,
                message: (
                  <div>
                    Must be at least <b>6 characters</b> long!
                  </div>
                ),
              },
            ]}
          >
            <div
              aria-label="Toggle password visibility"
              className="text-muted-foreground absolute top-1/2 right-0 translate-x-[125%] -translate-y-1/2 scale-90 cursor-pointer"
              onClick={() => setIsPasswordShown((prev) => !prev)}
            >
              {isPasswordShown ? <Eye /> : <EyeOff />}
            </div>
          </FormField>
          <Button
            type="submit"
            disabled={
              !username.isValid ||
              !email.isValid ||
              !password.isValid ||
              signupMutation.isPending
            }
            onClick={async (e) => {
              e.preventDefault();
              if (!username.value || !email.value || !password.value) return;
              signupMutation.mutate({
                username: username.value,
                email: email.value,
                password: password.value,
              });
            }}
          >
            {signupMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "create account"
            )}
          </Button>
        </form>
        <div className="text-muted-foreground">
          <Link
            to={"/auth/login"}
            className="hover:text-secondary-foreground hover:underline"
          >
            Already have an account? Log in →
          </Link>
        </div>
      </div>
    </div>
  );
};

const UsernameUniqueness = ({
  username,
  setIsUnique,
}: {
  username: string;
  setIsUnique: (b: boolean) => void;
}) => {
  const debouncedUsername = useDebounce(username, 500);

  const { isPending, data } = useQuery({
    queryKey: ["username", debouncedUsername],
    queryFn: async (): Promise<"success" | "failure" | "error"> => {
      if (!debouncedUsername) {
        setIsUnique(true);
        return "failure";
      }
      const { data, error } = await db.from("profiles").select("username");
      if (error) {
        setIsUnique(false);
        console.error(error);
        return "error";
      }
      const isDuplicate = data.some((d) => d.username === debouncedUsername);
      if (isDuplicate) {
        setIsUnique(false);
        return "failure";
      }
      setIsUnique(true);
      return "success";
    },
  });

  return (
    <div className="absolute top-1/2 right-0 translate-x-[125%] -translate-y-1/2">
      {username && isPending && <Loader2 className="animate-spin" />}
      {username && !isPending && data === "success" && (
        <CheckCircle2 color={"var(--success)"} />
      )}
      {username && !isPending && data !== "success" && (
        <XCircle color={"var(--destructive)"} />
      )}
    </div>
  );
};
