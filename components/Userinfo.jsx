"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function UserInfo() {
  const { data: session } = useSession();
  const today = new Date();
  const monthName = today.toLocaleString("en-US", { month: "long" });
  const day = today.getDay();
  const year = today.getFullYear();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="py-4 px-4">
      <div className="text-center">
        <p className="text-white">
          {monthName} {day}, {year}
        </p>
      </div>
      <Image
        className="rounded-full mx-auto"
        src={session?.user?.image}
        width={40}
        height={40}
        alt="user image"
      />
      <div className="text-center text-white">
        <p className="text-xs">Name: {session?.user?.name}</p>
        <p className="text-xs">Email: {session?.user?.email}</p>
        <button className="pt-4" onClick={() => signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
