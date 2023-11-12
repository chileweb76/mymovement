"use client";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";

import google from "@/public/img/google-logo.png";
import logo from "@/public/img/mymovement_png.png";
import { redirect } from "next/navigation";

export default function Login() {
  const { data: session } = useSession();

  if (session) {
    redirect("/home");
  }
  return (
    <main>
      <div className="bg-neutral-100 container w-2/3 h-screen flex flex-col">
        <Image
          className="w-1/2 self-center mt-24 mb-60"
          src={logo}
          alt="logo"
        />
        <div className="flex self-center" onClick={() => signIn()}>
          <button className="flex items-center gap-4 shadow-xl rounded-lg pl-3">
            <Image src={google} alt="google logo" height={25} width={25} />
            <span className="bg-blue-500 text-white py-3 px-4">
              Sign in with Google
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}
