import Link from "next/link";
import { ui } from "@/config/site";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 pt-24 text-center">
      <h1 className="mb-4 text-6xl font-bold text-accent">{ui.notFoundTitle}</h1>
      <p className="mb-8 text-xl text-muted">{ui.notFoundMessage}</p>
      <Link
        href="/"
        className="rounded-xl accent-gradient px-6 py-3 font-semibold text-white"
      >
        {ui.backHome}
      </Link>
    </div>
  );
}
