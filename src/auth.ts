import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findDemoUser } from "@/lib/demo-users";
import type { Role } from "@/lib/types";

// Production note: swap `findDemoUser` for a real Prisma lookup once the
// database is live (see src/lib/types.ts for why Prisma isn't wired in this
// sandbox). Everything else here — JWT sessions, role on the token, role
// gating in middleware.ts — carries over unchanged. OAuth providers (Google
// Workspace SSO for GCs, etc.) can be added alongside Credentials later.
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  providers: [
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = findDemoUser(email);
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role as Role | undefined;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as Role | undefined) ?? "MEMBER";
      }
      return session;
    },
  },
});
