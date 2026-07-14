"use client";

import { InputHTMLAttributes, forwardRef, useId, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: string;
  onIconClick?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, onIconClick, className = "", value, ...rest }, ref) => {
    const id = useId();
    const { name } = rest;
    const errorId = name ? `${name}-error` : undefined;
    const [focused, setFocused] = useState(false);
    const hasValue = value !== undefined && value !== "";
    const isFloating = focused || hasValue;

    return (
      <div className="relative flex flex-col gap-1">
        <div className="relative">
          <input
            ref={ref}
            id={id}
            value={value}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            onFocus={(e) => {
              setFocused(true);
              rest.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              rest.onBlur?.(e);
            }}
            className={[
              "peer w-full h-14 px-4 pt-5 pb-1 bg-transparent border-b-2 outline-none text-aether-text-primary text-base transition-colors",
              error
                ? "border-error"
                : focused
                  ? "border-aether-gold"
                  : "border-aether-gold/20",
              icon ? "pr-12" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            placeholder=""
            {...rest}
          />
          <label
            htmlFor={id}
            className={[
              "absolute left-4 top-1/2 -translate-y-1/2 origin-left transition-all duration-200 pointer-events-none font-label-bold",
              isFloating
                ? "translate-y-[-6px] scale-[0.85]"
                : "",
              error
                ? "text-error"
                : focused
                  ? "text-aether-gold"
                  : "text-aether-text-muted",
            ].join(" ")}
          >
            {label}
          </label>
          <div
            className={[
              "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-aether-gold transition-all duration-300",
              focused ? "w-full" : "w-0",
            ].join(" ")}
          />
          {icon && (
            <button
              type="button"
              onClick={onIconClick}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-aether-text-muted hover:text-aether-text-primary transition-colors cursor-pointer"
              tabIndex={-1}
            >
              <span className="material-symbols-outlined text-2xl leading-none">{icon}</span>
            </button>
          )}
        </div>
        {error && (
          <p id={errorId} role="alert" className="text-error text-sm font-label-bold animate-pulse">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
