"use client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function UserInfo() {
  const { data: session } = useSession();
  const [localUser, setLocalUser] = useState(session?.user || null);

  useEffect(() => {
    // update localUser when session changes
    setLocalUser(session?.user || null);
  }, [session?.user]);

  useEffect(() => {
    function onProfileUpdated(e) {
      if (e?.detail) setLocalUser(e.detail);
    }
    window.addEventListener("profileUpdated", onProfileUpdated);
    return () => window.removeEventListener("profileUpdated", onProfileUpdated);
  }, []);
  const today = new Date();
  const monthName = today.toLocaleString("en-US", { month: "long" });
  const date = today.getDate();
  const year = today.getFullYear();

  return (
    <div className="text-white text-center">
      <div className="mb-2">
        <p className="text-sm">
          {monthName} {date}, {year}
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Link href="/settings" aria-label="Open settings" className="inline-block">
          <Image
            className="rounded-full border-2 border-white"
            src={localUser?.image || session?.user?.image || "/img/user.png"}
            width={40}
            height={40}
            alt={
              localUser?.name || session?.user?.name
                ? `${(localUser?.name || session?.user?.name)} avatar`
                : "user image"
            }
          />
        </Link>
        
        <div className="text-center">
          <Link href="/settings" className="text-white no-underline block text-center">
            <span className="text-xs block">Name: {localUser?.name || session?.user?.name}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}