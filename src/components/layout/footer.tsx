import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { NewsletterForm } from "@/components/shared/newsletter-form";

const columns = [
  {
    title: "Platform",
    links: [
      { href: "/news", label: "News" },
      { href: "/projects", label: "Project Database" },
      { href: "/map", label: "Interactive Map" },
      { href: "/general-contractors", label: "General Contractors" },
      { href: "/subcontractors", label: "Subcontractors" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Tradeline" },
      { href: "/advertise", label: "Advertise" },
      { href: "/contact", label: "Contact" },
      { href: "/admin", label: "Admin" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/editorial-standards", label: "Editorial Standards" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:gap-6">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Original construction and commercial real estate news, a live project database, and
              general contractor + subcontractor directories for South Florida.
            </p>
            <div className="mt-6">
              <NewsletterForm compact />
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Tradeline. All rights reserved.</p>
          <p>Southeast Florida &middot; Miami-Dade &middot; Broward &middot; Palm Beach &middot; Monroe</p>
        </div>
      </div>
    </footer>
  );
}
