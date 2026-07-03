import Link from "next/link";

interface NavLinkItem {
  href: string;
  label: string;
  external?: boolean;
}

interface NavLinkProps extends NavLinkItem {
  className?: string;
  onClick?: () => void;
}

export function NavLink({ href, label, external, className, onClick }: NavLinkProps) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {label}
    </Link>
  );
}

export type { NavLinkItem };
