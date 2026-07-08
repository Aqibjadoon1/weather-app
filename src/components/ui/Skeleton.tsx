import { CSSProperties } from "react";

type SkeletonVariant = "text" | "circular" | "rectangular";

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
  width?: string | number;
  height?: string | number;
}

const variantStyles: Record<SkeletonVariant, string> = {
  text: "h-4 w-full rounded",
  circular: "rounded-full",
  rectangular: "rounded-2xl",
};

export default function Skeleton({
  variant = "text",
  className = "",
  width,
  height,
}: SkeletonProps) {
  const style: CSSProperties = {};
  if (width !== undefined) style.width = typeof width === "number" ? `${width}px` : width;
  if (height !== undefined) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={[
        "animate-pulse bg-surface-container-high",
        variantStyles[variant],
        className,
      ].join(" ")}
      style={style}
    />
  );
}
