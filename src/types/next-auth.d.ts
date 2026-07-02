import type { Role } from "@/lib/types";

declare module "next-auth" {
  interface User {
    role?: Role;
  }
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSessionUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}

type DefaultSessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};
