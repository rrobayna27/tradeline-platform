import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { Badge } from "@/components/ui/badge";
import { searchSubcontractors } from "@/lib/repositories";

export default async function AdminSubsPage() {
  const { items, total } = await searchSubcontractors({ pageSize: 1000 });

  return (
    <div>
      <AdminPageHeader title="Subcontractors" description={`${total} on file`} />
      <AdminTable
        rows={items}
        columns={[
          { header: "Name", cell: (s) => <span className="font-medium text-foreground">{s.name}</span> },
          { header: "License", cell: (s) => s.licenseNumber ?? "—" },
          { header: "Insurance", cell: (s) => (s.insuranceVerified ? <Badge>Verified</Badge> : "—") },
          { header: "Years", cell: (s) => s.yearsInBusiness ?? "—" },
        ]}
      />
    </div>
  );
}
