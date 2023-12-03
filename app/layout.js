import "./globals.css";
import { Montserrat } from "next/font/google";
import { NextAuthProvider } from "./Providers";
import { getServerSession } from "next-auth";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Mymovement",
  description: "",
  icons: {
    icon: "/img/favicon-16x16.png",
  },
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <NextAuthProvider session={session}>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
