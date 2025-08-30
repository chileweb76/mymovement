"use client";
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
        <p className="text-lg">
          {monthName} {date}, {year}
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">        
        <div className="text-center">
          <Link href="/settings" className="text-white no-underline block text-center">
            <span className="text-base block">Name: {localUser?.name || session?.user?.name}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}