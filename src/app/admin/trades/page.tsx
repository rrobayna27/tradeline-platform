import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { getTrades } from "@/lib/repositories";

export default async function AdminTradesPage() {
  const trades = await getTrades();

  return (
    <div>
      <AdminPageHeader title="Trade Categories" description={`${trades.length} categories`} />
      <AdminTable
        rows={trades}
        columns={[
          { header: "Name", cell: (t) => <span className="font-medium text-foreground">{t.name}</span> },
          { header: "Slug", cell: (t) => <span className="font-mono text-xs text-muted-foreground">{t.slug}</span> },
        ]}
      />
    </div>
  );
}
