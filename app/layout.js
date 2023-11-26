import "./globals.css";
import { Montserrat } from "next/font/google";
import { NextAuthProvider } from "./Providers";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Mymovement",
  description: "",
  icons: {
    icon: "/img/favicon-16x16.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
