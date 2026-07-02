// DEMO-ONLY user store. Once Prisma is wired to a live Postgres instance
// (see src/lib/types.ts), replace `findDemoUser` in src/auth.ts with a real
// lookup: `prisma.user.findUnique({ where: { email } })`, comparing
// `passwordHash` with bcrypt exactly as done here. The shape is identical on
// purpose so that swap is a one-line change.
import bcrypt from "bcryptjs";
import type { Role } from "@/lib/types";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
}

// Password for every demo account below is: "tradeline-demo"
const DEMO_PASSWORD_HASH = bcrypt.hashSync("tradeline-demo", 10);

export const demoUsers: DemoUser[] = [
  { id: "user-admin", name: "Tradeline Admin", email: "admin@tradelinefl.com", passwordHash: DEMO_PASSWORD_HASH, role: "ADMIN" },
  { id: "user-gc", name: "Ironbridge Demo GC", email: "gc@tradelinefl.com", passwordHash: DEMO_PASSWORD_HASH, role: "GC" },
  { id: "user-sub", name: "Atlas Demo Sub", email: "sub@tradelinefl.com", passwordHash: DEMO_PASSWORD_HASH, role: "SUB" },
];

export function findDemoUser(email: string) {
  return demoUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
