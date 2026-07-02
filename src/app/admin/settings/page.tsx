import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Input, FieldLabel } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-xl">
      <AdminPageHeader title="Site Settings" />
      <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
        <div>
          <FieldLabel>Site name</FieldLabel>
          <Input defaultValue={SITE_NAME} disabled />
        </div>
        <div>
          <FieldLabel>Site URL</FieldLabel>
          <Input defaultValue={SITE_URL} disabled />
        </div>
        <p className="text-xs text-muted-foreground">
          These map to the <code className="rounded bg-surface-raised px-1">SiteSetting</code> table
          in the Prisma schema. Once a database is connected, this form can read/write real values
          instead of the constants in <code className="rounded bg-surface-raised px-1">src/lib/constants.ts</code>.
        </p>
        <Button disabled className="opacity-60">
          Save (requires database)
        </Button>
      </div>
    </div>
  );
}
