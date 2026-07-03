import type { PlanTier, Role } from "@/lib/types";

declare module "next-auth" {
  interface User {
    role?: Role;
    planTier?: PlanTier;
  }
  interface Session {
    user: {
      id: string;
      role: Role;
      planTier: PlanTier;
    } & DefaultSessionUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    planTier?: PlanTier;
  }
}

type DefaultSessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};
