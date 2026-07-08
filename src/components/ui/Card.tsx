import { ReactNode } from "react";

type CardVariant = "default" | "glass" | "elevated" | "checklist";
type CardPadding = "sm" | "md" | "lg";

interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
  children: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-surface-container-low rounded-3xl editorial-shadow",
  glass: "glass-card rounded-xl",
  elevated:
    "bg-white rounded-[2.5rem] editorial-shadow border-l-4 border-primary",
  checklist:
    "bg-white rounded-[2.5rem] editorial-shadow",
};

const paddingStyles: Record<CardPadding, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8 md:p-10",
};

export default function Card({
  variant = "default",
  padding = "md",
  className = "",
  children,
}: CardProps) {
  return (
    <div
      className={[
        "relative overflow-hidden",
        variantStyles[variant],
        paddingStyles[padding],
        className,
      ].join(" ")}
    >
      <div className="grain-texture absolute inset-0" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
