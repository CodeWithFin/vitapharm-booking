import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}

export default function Card({ hover = false, padding = "md", className = "", children, ...props }: CardProps) {
  const padMap = { none: "p-0", sm: "p-4", md: "p-6", lg: "p-8" };
  const hoverStyle = hover ? { transition: "box-shadow 0.2s ease" } : {};
  return (
    <div
      className={`card ${padMap[padding]} ${className}`}
      style={{
        ...hoverStyle,
        ...(props.style || {}),
      }}
      onMouseEnter={hover ? (e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card-hover)"; } : undefined}
      onMouseLeave={hover ? (e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card)"; } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
