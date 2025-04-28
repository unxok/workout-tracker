import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  InputHTMLAttributes,
  ReactNode,
  ComponentProps,
} from "react";

export type Validator = {
  validate: (value: string) => boolean;
  message: ReactNode;
};

export type FormValue<T = string> = {
  value: T;
  isValid?: boolean;
};

export const generateFormData = <T extends Record<string, unknown>>(
  data: T,
) => {
  type Form = Record<keyof T, FormValue<T[keyof T]>>;
  const form: Form = Object.entries(data).reduce((acc, [key, value]) => {
    // @ts-ignore TODO how can I type this correctly...
    acc[key] = {
      value,
    };
    return acc;
  }, {} as Form);
  return form;
};

export type FormFieldProps = {
  formValue: FormValue;
  setFormValue: Dispatch<SetStateAction<FormValue>>;
  label: string;
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  validators: Validator[];
  placeholder?: string;
  children?: ReactNode;
  inputProps?: Omit<ComponentProps<"input">, "type" | "placeholder">;
};
export const FormField = ({
  formValue: { value, isValid },
  setFormValue,
  label,
  type,
  validators,
  placeholder,
  children,
  inputProps,
}: FormFieldProps) => {
  //
  return (
    <div className="flex flex-col items-start justify-center gap-2">
      <Label htmlFor={label} className="text-lg font-semibold">
        {label}
      </Label>
      <div className="relative w-full">
        <Input
          {...inputProps}
          id={label}
          name={label}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            setFormValue(() => ({
              value: e.target.value,
              isValid: validators.every(({ validate }) =>
                validate(e.target.value),
              ),
            }));
          }}
          className={`${!isValid && "ring-destructive ring-1"}`}
        />
        {children}
      </div>
      {value !== "" && (
        <ul>
          {validators.map(
            ({ validate, message }, index) =>
              !validate(value) && (
                <li
                  key={"form-field-validator" + label + index}
                  className="flex items-center gap-2 text-sm"
                >
                  <AlertCircle color="var(--destructive)" size={"1rem"} />
                  <span>{message}</span>
                </li>
              ),
          )}
        </ul>
      )}
    </div>
  );
};
