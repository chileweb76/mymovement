import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NextAuthProvider } from "@/app/Providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function SiteLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen flex flex-col">
      <NextAuthProvider session={session}>
        <Header session={session} />
  <main className="flex-1 pb-8">{children}</main>
        <Footer />
      </NextAuthProvider>
    </div>
  );
}