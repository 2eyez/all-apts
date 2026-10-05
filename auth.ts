import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
        accountType: {
          label: "Account Type",
          type: "text",
        },
      },

      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password ||
          !credentials?.accountType
        ) {
          return null;
        }

        await connectDB();

        const role =
          String(credentials.accountType) === "company" ? "owner" : "guest";

        const user = await User.findOne({
          email: String(credentials.email).trim().toLowerCase(),
          role,
        });

        if (!user) {
          return null;
        }

        if (user.status !== "active") {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          String(credentials.password),
          user.password,
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          companyName: user.companyName,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.companyName = user.companyName;
      }

      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.companyName = token.companyName;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
