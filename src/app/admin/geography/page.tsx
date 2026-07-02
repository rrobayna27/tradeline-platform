import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { Badge } from "@/components/ui/badge";
import { METRO_LABELS } from "@/lib/constants";
import { getCities, getCounties } from "@/lib/repositories";

export default async function AdminGeographyPage() {
  const [counties, cities] = await Promise.all([getCounties(), getCities()]);

  return (
    <div className="space-y-10">
      <div>
        <AdminPageHeader title="Counties" description={`${counties.length} tracked, ${counties.filter((c) => c.isLive).length} live`} />
        <AdminTable
          rows={counties}
          columns={[
            { header: "Name", cell: (c) => <span className="font-medium text-foreground">{c.name}</span> },
            { header: "Metro", cell: (c) => METRO_LABELS[c.metro] },
            { header: "Status", cell: (c) => (c.isLive ? <Badge className="border-accent/30 bg-accent/10 text-accent">Live</Badge> : <Badge>Preview</Badge>) },
          ]}
        />
      </div>
      <div>
        <AdminPageHeader title="Cities" description={`${cities.length} tracked`} />
        <AdminTable
          rows={cities}
          columns={[{ header: "Name", cell: (c) => <span className="font-medium text-foreground">{c.name}</span> }]}
        />
      </div>
    </div>
  );
}
