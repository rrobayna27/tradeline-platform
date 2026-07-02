import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { Badge } from "@/components/ui/badge";
import { demoUsers } from "@/lib/demo-users";

export default function AdminUsersPage() {
  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="Demo accounts wired to the Credentials auth provider (see src/lib/demo-users.ts)."
      />
      <AdminTable
        rows={demoUsers}
        columns={[
          { header: "Name", cell: (u) => <span className="font-medium text-foreground">{u.name}</span> },
          { header: "Email", cell: (u) => u.email },
          { header: "Role", cell: (u) => <Badge>{u.role}</Badge> },
        ]}
      />
    </div>
  );
}
