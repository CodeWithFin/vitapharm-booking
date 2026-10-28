"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  rect?: boolean;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", rect = false, loading, children, className = "", disabled, ...props }, ref) => {
    const base = variant === "primary" ? "btn-primary" : "btn-secondary";
    const rectClass = rect ? "btn-rect" : "";
    const sizeStyle = size === "sm" ? { padding: "8px 16px", fontSize: "12px" } : size === "lg" ? { padding: "14px 32px", fontSize: "16px" } : {};

    return (
      <button
        ref={ref}
        className={`${base} ${rectClass} ${className}`}
        style={sizeStyle}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
