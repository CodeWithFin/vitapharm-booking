interface BadgeProps {
  children: React.ReactNode;
  color?: "default" | "green" | "red" | "blue" | "orange";
}

const colorMap = {
  default: { bg: "var(--color-paper)", color: "var(--color-slate)" },
  green: { bg: "#f0fdf4", color: "#16a34a" },
  red: { bg: "#fef2f2", color: "#dc2626" },
  blue: { bg: "var(--color-info-banner-bg)", color: "var(--color-action-blue)" },
  orange: { bg: "#fff7ed", color: "#ea580c" },
};

export default function Badge({ children, color = "default" }: BadgeProps) {
  const { bg, color: textColor } = colorMap[color];
  return (
    <span
      className="tag"
      style={{ background: bg, color: textColor }}
    >
      {children}
    </span>
  );
}
