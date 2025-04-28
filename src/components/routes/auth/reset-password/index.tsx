import { FormField, FormValue } from "@/components/common/FormField";
import { AuthProtected, useNavigate } from "@/components/common/routing";
import { Button } from "@/components/ui/button";
import { GET_USER_QUERY_KEY } from "@/hooks/database/auth";
import { db } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

type CurrentForm = "email" | "otp" | "password";

export const ResetPassword = () => {
  const [email, setEmail] = useState<FormValue>({ value: "", isValid: true });
  const [currentForm, setCurrentForm] = useState<CurrentForm>("email");

  const {} = useMutation({
    mutationFn: async () => {
      if (email.value === "" || !email.isValid) return;

      const { error } = await db.auth.signInWithOtp({
        email: email.value,
      });

      if (error) {
        toast.error(
          <div>
            <span>Failed to send reset link!</span>
            <br />
            <span>{error.message}</span>
          </div>,
        );
        return;
      }
    },
  });

  return (
    <>
      {currentForm === "email" && (
        <EmailForm
          email={email}
          setEmail={setEmail}
          setCurrentForm={setCurrentForm}
        />
      )}
      {currentForm === "otp" && (
        <OtpForm email={email.value} setCurrentForm={setCurrentForm} />
      )}
      {currentForm === "password" && <PasswordForm />}
    </>
  );
};

const EmailForm = ({
  email,
  setEmail,
  setCurrentForm,
}: {
  email: FormValue;
  setEmail: Dispatch<SetStateAction<FormValue>>;
  setCurrentForm: Dispatch<SetStateAction<CurrentForm>>;
}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (email.value === "" || !email.isValid) return;

      const { error } = await db.auth.signInWithOtp({
        email: email.value,
      });

      if (error) {
        toast.error(
          <div>
            <span>Failed to send reset link!</span>
            <br />
            <span>{error.message}</span>
          </div>,
        );
        return;
      }

      setCurrentForm("otp");
    },
  });

  return (
    <form
      className="flex flex-col gap-3 py-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <FormField
        formValue={email}
        setFormValue={setEmail}
        label="Email"
        type="email"
        inputProps={{ autoFocus: true }}
        validators={[
          {
            message: "Enter a valid email!",
            validate: (v) => v.includes("@"),
          },
        ]}
      />
      <Button
        disabled={isPending}
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          mutate();
        }}
      >
        {isPending ? <Loader2 className="animate-spin" /> : "send reset link"}
      </Button>
    </form>
  );
};

const OtpForm = ({
  email,
  setCurrentForm,
}: {
  email: string;
  setCurrentForm: Dispatch<SetStateAction<CurrentForm>>;
}) => {
  const [otp, setOtp] = useState<FormValue>({ value: "", isValid: true });

  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (otp.value === "" || !otp.isValid) return;

      const { error } = await db.auth.verifyOtp({
        email,
        token: otp.value,
        type: "email",
      });

      if (error) {
        toast.error(
          <div>
            <span>Failed to verify!</span>
            <br />
            <span>{error.message}</span>
          </div>,
        );
        return;
      }

      qc.refetchQueries({ queryKey: [GET_USER_QUERY_KEY] });
      setCurrentForm("password");
    },
  });

  return (
    <form
      className="flex flex-col gap-3 py-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <FormField
        formValue={otp}
        setFormValue={setOtp}
        label="Code"
        type="text"
        inputProps={{
          inputMode: "numeric",
          autoFocus: true,
        }}
        validators={[
          {
            message: "Must contain numbers only!",
            validate: (v) => {
              const n = Number(v);
              return !Number.isNaN(n);
            },
          },
          {
            message: "Must be six digits!",
            validate: (v) => v.length === 6,
          },
        ]}
      >
        <div className="text-muted-foreground text-sm">
          Codes will expire 10 minutes after being sent
        </div>
      </FormField>
      <Button
        disabled={isPending}
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          mutate();
        }}
      >
        {isPending ? <Loader2 className="animate-spin" /> : "verify"}
      </Button>
    </form>
  );
};

export const PasswordForm = () => {
  const [password, setPassword] = useState<FormValue>({
    value: "",
    isValid: true,
  });
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const nav = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (password.value === "" || !password.isValid) return;
      const { error } = await db.auth.updateUser({
        password: password.value,
      });

      if (error) {
        toast.error(
          <div>
            <span>Failed to update password!</span>
            <br />
            <span>{error.message}</span>
          </div>,
        );
        return;
      }

      toast.success("Password updated!");
      nav("/dashboard");
    },
  });

  return (
    <AuthProtected
      redirectTo="/auth/reset-password"
      element={
        <form
          className="flex flex-col gap-3 py-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <FormField
            formValue={password}
            setFormValue={setPassword}
            label="New Password"
            type={isPasswordShown ? "text" : "password"}
            inputProps={{ autoFocus: true }}
            validators={[
              {
                message: "Must have at least 6 characters!",
                validate: (v) => v.length >= 6,
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
            disabled={isPending}
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              mutate();
            }}
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "update password"
            )}
          </Button>
        </form>
      }
    ></AuthProtected>
  );
};
