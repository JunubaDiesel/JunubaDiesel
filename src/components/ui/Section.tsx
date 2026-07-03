"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function Section({ id, title, subtitle, children, className, dark }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 md:py-28",
        dark && "bg-surface",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 md:mb-16"
          >
            {subtitle && (
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {title}
              </h2>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}

export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
