import { cn } from "@/lib/utils";

type BadgeVariant = "new" | "used" | "default" | "vehicle";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  new: "bg-trust/20 text-blue-300 border-trust/30",
  used: "bg-accent/20 text-orange-300 border-accent/30",
  default: "bg-surface-light text-muted border-border",
  vehicle: "bg-surface-light text-foreground border-border",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
