import type { Metadata } from "next";
import { AdminOemGuidesClient } from "@/components/admin/AdminOemGuidesClient";

export const metadata: Metadata = {
  title: "Guías OEM",
  robots: { index: false, follow: false },
};

export default function AdminOemGuidesPage() {
  return <AdminOemGuidesClient />;
}
