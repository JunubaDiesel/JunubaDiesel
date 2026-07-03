import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  showText?: boolean;
  href?: string;
  className?: string;
  priority?: boolean;
}

export function Logo({
  size = 40,
  showText = true,
  href = "/",
  className,
  priority = false,
}: LogoProps) {
  const content = (
    <>
      <Image
        src={siteConfig.logoSrc}
        alt={siteConfig.logoAlt}
        width={size}
        height={size}
        className="shrink-0 rounded-full object-contain"
        priority={priority}
      />
      {showText && (
        <span className="min-w-0 leading-tight">
          <span className="block text-base font-bold tracking-tight sm:text-lg">
            JUNUBA
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-widest text-muted sm:text-xs">
            Corea Diesel
          </span>
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn("flex items-center gap-2.5", className)}>
        {content}
      </Link>
    );
  }

  return <div className={cn("flex items-center gap-2.5", className)}>{content}</div>;
}
