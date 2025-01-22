import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Explicitly name and export the function
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Utility function to validate UUIDs
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Error message formatter
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
