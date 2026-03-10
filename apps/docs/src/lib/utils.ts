import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Migrated from packages/react/src/utils/dom.ts
export const ariaAttr = (condition: boolean | undefined) =>
  condition ? true : undefined

export const dataAttr = (condition: boolean | undefined) =>
  condition ? "" : undefined
