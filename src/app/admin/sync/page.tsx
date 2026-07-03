import type { Metadata } from "next";
import { AdminSyncClient } from "@/components/admin/AdminSyncClient";

export const metadata: Metadata = {
  title: "Sincronización ERP",
  robots: { index: false, follow: false },
};

export default function AdminSyncPage() {
  return <AdminSyncClient />;
}
