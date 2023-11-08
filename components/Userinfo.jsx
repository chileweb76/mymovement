"use client";

import Image from "next/image";
import SignInBtn from "./SignInBtn";
import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { status, data: session } = useSession();

  if (status === "authenticated") {
    return (
      <>
        <SignInBtn />
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
      </>
    );
  } else {
    return <SignInBtn />;
  }
}
