import { FormField, FormValue } from "@/components/common/FormField";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "@/components/common/routing";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GET_USER_QUERY_KEY } from "@/hooks/database/auth";

export const Login = () => {
  const [email, setEmail] = useState<FormValue>({ value: "", isValid: true });
  const [password, setPassword] = useState<FormValue>({
    value: "",
    isValid: true,
  });
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const checkValid = () =>
    email.value !== "" &&
    email.isValid &&
    password.value !== "" &&
    password.isValid;

  const qc = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async () => {
      if (!checkValid()) return;
      const { error } = await db.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });
      if (error) {
        console.error("Failed to log in!\n\n" + error);
        toast.error("Failed to log in!");
        return;
      }
      toast.success("Successfully logged in!");
      qc.refetchQueries({ queryKey: [GET_USER_QUERY_KEY] });
    },
  });

  return (
    <div className="flex h-full w-full items-start justify-center">
      <div className="min-w-[45ch] pt-28">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-wide">Login</h2>
          <div>
            oh great, <i>you're</i> back... just kidding ;&#41;
          </div>
        </div>
        <form
          className="flex flex-col gap-3 py-4"
          onSubmit={(e) => {
            console.log("hi");
            e.preventDefault();
            loginMutation.mutate();
          }}
        >
          <FormField
            formValue={email}
            setFormValue={setEmail}
            label="Email"
            type="email"
            validators={[
              {
                validate: (v) => v.includes("@"),
                message: "Please enter a valid email!",
              },
            ]}
          />
          <FormField
            formValue={password}
            setFormValue={setPassword}
            label="Password"
            type={isPasswordShown ? "text" : "password"}
            validators={[
              {
                validate: (v) => v !== "",
                message: "Password is required!",
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
            disabled={!checkValid || loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "sign in"
            )}
          </Button>
        </form>
        <div className="text-muted-foreground">
          <Link
            to={"/auth/reset-password"}
            className="hover:text-secondary-foreground hover:underline"
          >
            Forgot password? Reset it →
          </Link>
        </div>
        <div className="text-muted-foreground">
          <Link
            to={"/auth/login"}
            className="hover:text-secondary-foreground hover:underline"
          >
            Don't have an account? Sign up →
          </Link>
        </div>
      </div>
    </div>
  );
};
