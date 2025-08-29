<<<<<<< HEAD
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="mx-4 text-white font-bold lg:text-xl">
      <Link className="lg:mx-4 mx-2 hover:text-button_hover" href="/home">
        Home
      </Link>
      <Link
        className="lg:mx-4 mx-2 hover:text-button_hover"
        href="/daily_summary"
      >
=======
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
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
        Daily Summary
      </Link>
    </nav>
  );
}
<<<<<<< HEAD
=======

>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
