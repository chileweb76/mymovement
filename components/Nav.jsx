"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const linkClass = (href) => {
    const isActive = pathname === href;
    return `text-white font-semibold text-lg transition-colors duration-200 hover:text-[#077187] ${
      isActive ? 'text-[#077187] border-b-2 border-[#077187]' : ''
    }`;
  };

  return (
    <nav className="flex gap-8 items-center">
      <Link className={linkClass("/home")} href="/home">
        Home
      </Link>
      <Link className={linkClass("/daily_summary")} href="/daily_summary">
        Daily Summary
      </Link>
    </nav>
  );
}

