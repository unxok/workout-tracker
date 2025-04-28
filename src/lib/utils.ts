import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Must<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export type PartialProps<
  T extends Record<string, unknown>,
  K extends keyof T,
> = Omit<T, K> & Partial<Pick<T, K>>;
