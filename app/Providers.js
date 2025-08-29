"use client";
<<<<<<< HEAD

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
=======
import { SessionProvider } from "next-auth/react";

export const NextAuthProvider = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
};
