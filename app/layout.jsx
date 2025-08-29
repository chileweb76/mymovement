import "@/app/styles/globals.css";
import { getServerSession } from "next-auth";
import { NextAuthProvider } from "@/app/Providers";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Mymovement",
  description: "",
  icons: {
    icon: "/img/favicon.ico",
  },
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextAuthProvider session={session}>{children}</NextAuthProvider>
      </body>
    </html>
  );
}