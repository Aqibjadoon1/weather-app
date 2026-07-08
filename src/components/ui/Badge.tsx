import { ReactNode } from "react";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "error";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-surface-variant text-on-surface",
  primary: "bg-primary text-on-primary",
  success: "bg-primary text-on-primary",
  warning: "bg-tertiary-container text-on-tertiary-container",
  error: "bg-error text-on-error",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export default function Badge({
  variant = "default",
  size = "md",
  className = "",
  children,
}: BadgeProps) {
  return (
    <span
      className={[
        "rounded-full font-label-bold inline-flex items-center",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
