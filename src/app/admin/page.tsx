import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const admin = await requireAdmin();

  if (!admin) {
    redirect("/login");
  }

  return <AdminDashboard userEmail={admin.email || ""} />;
}
