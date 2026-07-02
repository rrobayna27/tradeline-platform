import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { Badge } from "@/components/ui/badge";
import { getGeneralContractors } from "@/lib/repositories";

export default async function AdminGCsPage() {
  const gcs = await getGeneralContractors();

  return (
    <div>
      <AdminPageHeader title="General Contractors" description={`${gcs.length} on file`} />
      <AdminTable
        rows={gcs}
        columns={[
          { header: "Name", cell: (g) => <span className="font-medium text-foreground">{g.name}</span> },
          { header: "Plan", cell: (g) => <Badge>{g.planTier}</Badge> },
          { header: "Verified", cell: (g) => (g.isClaimed ? "Yes" : "No") },
          { header: "Featured", cell: (g) => (g.isFeatured ? "Yes" : "No") },
        ]}
      />
    </div>
  );
}
