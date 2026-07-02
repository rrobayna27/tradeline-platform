import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { StatusBadge } from "@/components/ui/badge";
import { PROJECT_TYPE_LABELS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { lookupCity, lookupCounty, searchProjects } from "@/lib/repositories";

export default async function AdminProjectsPage() {
  const { items, total } = await searchProjects({ pageSize: 1000 });

  return (
    <div>
      <AdminPageHeader title="Projects" description={`${total} tracked`} />
      <AdminTable
        rows={items}
        columns={[
          {
            header: "Name",
            cell: (p) => (
              <Link href={`/projects/${p.slug}`} className="font-medium text-foreground hover:text-accent">
                {p.name}
              </Link>
            ),
          },
          {
            header: "Location",
            cell: (p) => `${lookupCity(p.cityId)?.name ?? ""}, ${lookupCounty(p.countyId)?.name.replace(" County", "")}`,
          },
          { header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
          { header: "Type", cell: (p) => PROJECT_TYPE_LABELS[p.projectType] },
          { header: "Value", cell: (p) => formatCurrency(p.estimatedValueUsd) },
        ]}
      />
    </div>
  );
}
