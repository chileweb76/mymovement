<<<<<<< HEAD
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";

import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { name, email } = user;

        try {
          await connectMongoDB();

          const userExists = await User.findOne({ email });

          if (!userExists) {
            const res = await fetch(process.env.WEB_URL_USER, {
              method: "Post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name,
                email,
              }),
            });

            if (res.ok) {
              return user;
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
      return user;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
=======
import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/auth.js";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
