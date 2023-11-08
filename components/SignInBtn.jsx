"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInBtn() {
  const { status } = useSession();
  return (
    <>
      {status === "authenticated" ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <button onClick={() => signIn("google")}>Sign in Button</button>
      )}
    </>
  );
}
