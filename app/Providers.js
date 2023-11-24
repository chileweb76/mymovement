"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const NextAuthProvider = ({ children }) => {
  const pathname = usePathname();

  if (pathname === "/") {
    return <SessionProvider>{children}</SessionProvider>;
  } else {
    return (
      <SessionProvider>
        <Header />
        {children}
        <Footer />
      </SessionProvider>
    );
  }
};
