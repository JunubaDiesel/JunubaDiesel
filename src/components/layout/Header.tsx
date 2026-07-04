"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GlobalSearchOverlay, MobileSearchButton } from "@/components/layout/GlobalSearchOverlay";
import { Logo } from "@/components/layout/Logo";
import { NavLink } from "@/components/layout/NavLink";
import { navLinks, ui } from "@/config/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo size={40} priority className="shrink-0" />

        <div className="flex items-center gap-3">
          <GlobalSearchOverlay />
          <MobileSearchButton />
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                external={"external" in link ? link.external : false}
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              />
            ))}
            <Link
              href="/buscar"
              className="rounded-lg accent-gradient px-4 py-2 text-sm font-semibold text-white"
            >
              {ui.buscarRepuesto}
            </Link>
          </nav>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-background lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  external={"external" in link ? link.external : false}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-base font-medium text-muted transition-colors hover:bg-surface-light hover:text-foreground"
                  )}
                />
              ))}
              <Link
                href="/buscar"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg accent-gradient px-4 py-3 text-center text-base font-semibold text-white"
              >
                {ui.buscarRepuesto}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
