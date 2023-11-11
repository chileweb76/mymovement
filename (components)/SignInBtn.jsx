"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import logo from "@/public/img/google-logo.png";

export default function SignInBtn() {
  return (
    <div className="flex self-center" onClick={() => signIn()}>
      <button className="flex items-center gap-4 shadow-xl rounded-lg pl-3">
        <Image src={logo} alt="google logo" height={25} width={25} />
        <span className="bg-blue-500 text-white py-3 px-4">
          Sign in with Google
        </span>
      </button>
    </div>
  );
}
