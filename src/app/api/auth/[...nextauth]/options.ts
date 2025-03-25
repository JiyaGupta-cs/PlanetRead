
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

import { supabase } from "@/utils/supabaseClient";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const { data: users, error } = await supabase
          .from("Users")
          .select("*")
          .eq("email", credentials.email)
          .limit(1);

        if (error || !users || users.length === 0) {
          return null;
        }

        const user = users[0];
        const isValidPassword = 
        // user.password === credentials.password
        await bcrypt.compare(credentials.password, user.password)
        ;

        if (isValidPassword) {
          return { id: user.id, name: user.name, email: user.email };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      return session;
    }
  }
};

export default authOptions;