import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges tailwind classes intelligently.
 * @param {...(string | undefined | null | false)} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
