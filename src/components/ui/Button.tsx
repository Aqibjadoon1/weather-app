"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-aether-gold text-aether-bg shadow-lg hover:bg-aether-gold-soft",
  ghost:
    "bg-transparent text-aether-text-primary hover:bg-aether-gold/10",
  outline:
    "bg-transparent border border-aether-gold/30 text-aether-gold hover:bg-aether-gold/10",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-7 text-base",
  lg: "h-14 px-9 text-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      icon,
      children,
      className = "",
      disabled,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          "spring-button rounded-full font-label-bold uppercase tracking-widest inline-flex items-center justify-center gap-2",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aether-gold focus-visible:rounded-sm",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? "w-full" : "",
          disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        {loading ? (
          <span className="material-symbols-outlined animate-spin text-current">
            progress_activity
          </span>
        ) : icon ? (
          <span className="material-symbols-outlined text-current text-xl leading-none">
            {icon}
          </span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
