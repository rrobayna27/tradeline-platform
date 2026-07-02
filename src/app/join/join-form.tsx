"use client";

import { useState, type FormEvent } from "react";
import { Input, FieldLabel } from "@/components/ui/form-controls";
import { Button } from "@/components/ui/button";

export function JoinForm({ role }: { role: "SUB" | "GC" }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, companyName, email, phone }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="rounded-lg border border-accent/30 bg-accent/10 p-4 text-sm text-accent">
        Thanks — we&apos;ll follow up to finish setting up your {role === "SUB" ? "subcontractor" : "GC"} profile.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <FieldLabel>Company name</FieldLabel>
        <Input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
      </div>
      <div>
        <FieldLabel>Work email</FieldLabel>
        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <FieldLabel>Phone (optional)</FieldLabel>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? "Submitting…" : `Join as a ${role === "SUB" ? "subcontractor" : "general contractor"}`}
      </Button>
      {status === "error" && <p className="text-xs text-status-cancelled">Something went wrong — try again.</p>}
    </form>
  );
}
