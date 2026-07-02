import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number | string | null | undefined) {
  if (value === null || value === undefined) return "Undisclosed";
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return "Undisclosed";
  return currencyFormatter.format(num);
}

export function formatCurrencyCompact(value: number | string | null | undefined) {
  if (value === null || value === undefined) return "Undisclosed";
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return "Undisclosed";
  return compactCurrencyFormatter.format(num);
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "TBD";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateShort(value: Date | string | null | undefined) {
  if (!value) return "TBD";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
