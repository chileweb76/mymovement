"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

import Link from "next/link";

export default function UserInfo() {
  const { data: session } = useSession();
  const today = new Date();
  const monthName = today.toLocaleString("en-US", { month: "long" });
  const date = today.getDate();
  const year = today.getFullYear();

  return (
    <div className="pt-9 px-4 text-center text-white">
      <div>
        <p>
          {monthName} {date}, {year}
        </p>
      </div>
      <Image
        className="rounded-full mx-auto my-2"
        src={session?.user?.image}
        width={40}
        height={40}
        alt="user image"
      />
      <div>
        <p className="text-xs">Name: {session?.user?.name}</p>
      </div>
      <div className="my-4">
        <Link
          href="/"
          className="hover:text-button_hover"
          onClick={() => signOut({ callbackUrl: `${window.location.origin}` })}
        >
          Sign Out
        </Link>
      </div>
    </div>
  );
}
