"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function UserInfo() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <Image
          src={session?.user?.image}
          width={60}
          height={60}
          alt="user image"
        />
        <p>
          Name: <p>{session?.user?.name}</p>
        </p>
        <p>
          Email: <p>{session?.user?.email}</p>
        </p>
        <button onClick={() => signOut()}>Sign Out</button>
      </>
    );
  } else {
    return redirect("/");
  }
}
