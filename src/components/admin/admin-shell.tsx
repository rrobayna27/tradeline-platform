import Link from "next/link";
import {
  LayoutDashboard,
  Newspaper,
  Building2,
  HardHat,
  Users,
  Tag,
  Map,
  Mail,
  Settings,
  Wrench,
  Download,
} from "lucide-react";

const navGroups = [
  {
    title: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [{ href: "/admin/articles", label: "Articles", icon: Newspaper }],
  },
  {
    title: "Project database",
    items: [
      { href: "/admin/projects", label: "Projects", icon: Wrench },
      { href: "/admin/developers", label: "Developers", icon: Building2 },
      { href: "/admin/ingestion", label: "Data Ingestion", icon: Download },
    ],
  },
  {
    title: "Directories",
    items: [
      { href: "/admin/general-contractors", label: "General Contractors", icon: HardHat },
      { href: "/admin/subcontractors", label: "Subcontractors", icon: Users },
    ],
  },
  {
    title: "Taxonomy",
    items: [
      { href: "/admin/trades", label: "Trade Categories", icon: Tag },
      { href: "/admin/geography", label: "Cities & Counties", icon: Map },
    ],
  },
  {
    title: "Growth",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
      { href: "/admin/settings", label: "Site Settings", icon: Settings },
    ],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="border-b border-border bg-surface p-4 md:border-b-0 md:border-r">
        <p className="mb-4 px-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">Admin</p>
        <nav className="space-y-5">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-foreground hover:bg-surface-raised"
                  >
                    <item.icon size={15} className="text-muted-foreground" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <div className="p-6 md:p-8">{children}</div>
    </div>
  );
}
