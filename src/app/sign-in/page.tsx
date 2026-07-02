import type { Metadata } from "next";
import { Suspense } from "react";
import { Section } from "@/components/shared/section";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <Section className="flex min-h-[70vh] max-w-md items-center pt-16">
      <div className="w-full rounded-xl border border-border bg-surface p-8">
        <h1 className="mb-1 text-2xl font-semibold text-foreground">Sign in to Tradeline</h1>
        <p className="mb-6 text-sm text-muted-foreground">Access your subcontractor or GC dashboard.</p>
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
      </div>
    </Section>
  );
}
