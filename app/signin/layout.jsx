import "@/app/styles/globals.css";
import { NextAuthProvider } from "@/app/Providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Sign-in layout — does NOT render Header/Footer.
 */
export default async function SignInLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <NextAuthProvider session={session}>
      <main>{children}</main>
    </NextAuthProvider>
  );
}