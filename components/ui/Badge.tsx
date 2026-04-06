import { ReactNode } from "react";

type BadgeColor = "blue" | "green" | "amber" | "coral" | "purple" | "teal" | "gray" | "lindy";

interface BadgeProps {
  color?: BadgeColor;
  children: ReactNode;
  dot?: boolean;
}

export function Badge({ color = "gray", children, dot }: BadgeProps) {
  const colors: Record<BadgeColor, string> = {
    blue:   "bg-blue-50   text-blue-700   border-blue-200",
    green:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber:  "bg-amber-50  text-amber-700  border-amber-200",
    coral:  "bg-red-50    text-red-700    border-red-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    teal:   "bg-teal-50   text-teal-700   border-teal-200",
    gray:   "bg-gray-50   text-gray-600   border-gray-200",
    lindy:  "bg-orange-50 text-orange-700 border-orange-200",
  };

  const dotColors: Record<BadgeColor, string> = {
    blue:   "bg-blue-500",
    green:  "bg-emerald-500",
    amber:  "bg-amber-500",
    coral:  "bg-red-500",
    purple: "bg-purple-500",
    teal:   "bg-teal-500",
    gray:   "bg-gray-400",
    lindy:  "bg-orange-500",
  };

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${colors[color]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[color]}`} />}
      {children}
    </span>
  );
}
