import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
