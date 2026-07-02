import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  // Defense in depth: proxy.ts already gates /admin/*, this is a second,
  // server-side check directly in the layout.
  if (session?.user?.role !== "ADMIN") {
    redirect("/sign-in?callbackUrl=/admin");
  }

  return <AdminShell>{children}</AdminShell>;
}
