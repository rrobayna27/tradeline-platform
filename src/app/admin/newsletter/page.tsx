import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminNewsletterPage() {
  return (
    <div>
      <AdminPageHeader title="Newsletter" description="Weekly digest subscriber management." />
      <div className="rounded-xl border border-border bg-surface p-6 text-sm text-muted-foreground">
        <p>
          The subscribe form on the homepage and footer is live and posts to{" "}
          <code className="rounded bg-surface-raised px-1">/api/newsletter</code>. Subscriber counts
          will show here once that route is wired to the{" "}
          <code className="rounded bg-surface-raised px-1">NewsletterSubscriber</code> table in a
          connected Postgres database.
        </p>
      </div>
    </div>
  );
}
