import Link from "next/link";
import { Section } from "@/components/shared/section";
import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">404</p>
      <h1 className="mt-3 text-3xl font-semibold text-foreground">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        That page doesn&apos;t exist — it may have moved, or the project/article may no longer be
        tracked.
      </p>
      <div className="mt-6 flex gap-3">
        <LinkButton href="/">Back to home</LinkButton>
        <Link
          href="/projects"
          className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
        >
          Browse projects
        </Link>
      </div>
    </Section>
  );
}
