import type { Metadata } from "next";
import { AdminResourcesClient } from "@/components/admin/AdminResourcesClient";

export const metadata: Metadata = {
  title: "Administrar recursos",
  robots: { index: false, follow: false },
};

export default function AdminResourcesPage() {
  return <AdminResourcesClient />;
}
