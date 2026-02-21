import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number | string | undefined) => {
  if (price === undefined || price === null || price === '') return "Free";
  const numPrice = Number(price);
  if (isNaN(numPrice)) return "Free";
  return numPrice === 0 ? "Free" : `₹${numPrice.toFixed(2)}`;
};
