interface PageRoleBannerProps {
  children: React.ReactNode;
}

export function PageRoleBanner({ children }: PageRoleBannerProps) {
  return (
    <div className="mb-8 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-muted">
      {children}
    </div>
  );
}
