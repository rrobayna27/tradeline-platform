import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { getDevelopers, getProjectsByDeveloper } from "@/lib/repositories";

export default async function AdminDevelopersPage() {
  const developers = await getDevelopers();
  const rows = await Promise.all(
    developers.map(async (d) => ({ ...d, projectCount: (await getProjectsByDeveloper(d.id)).length }))
  );

  return (
    <div>
      <AdminPageHeader title="Developers" description={`${developers.length} on file`} />
      <AdminTable
        rows={rows}
        columns={[
          { header: "Name", cell: (d) => <span className="font-medium text-foreground">{d.name}</span> },
          { header: "Website", cell: (d) => d.website ?? "—" },
          { header: "Projects", cell: (d) => d.projectCount },
        ]}
      />
    </div>
  );
}
