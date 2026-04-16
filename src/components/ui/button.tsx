import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kulabo-500 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-kulabo-500 text-cream-50 shadow-sm hover:bg-kulabo-600",
        variant === "secondary" &&
          "bg-cream-100 text-kape-800 hover:bg-cream-200",
        variant === "ghost" && "bg-transparent text-kape-800 hover:bg-cream-100",
        className,
      )}
      {...props}
    />
  );
}
