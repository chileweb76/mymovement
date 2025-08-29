"use client";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import UserInfo from "@/components/Userinfo";
import logo from "@/public/img/mymovement_png.png";

export default function Header({ session }) {
  return (
    <header className="bg-[var(--brand-panel)] text-white">
      <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-center md:h-[160px] gap-4">
        {/* left: logo */}
        <div className="w-full md:w-1/3 flex items-center md:items-center justify-start">
          <div className="pl-3">
            <Image
              src={logo}
              alt="mymovement logo"
              width={320}
              height={120}
              className="w-auto h-20 md:h-24 object-contain"
              priority
            />
          </div>
        </div>

        {/* center: nav */}
        <div className="w-full md:w-1/3 flex justify-center items-center">
          <nav className="header-nav flex space-x-8 text-lg font-semibold">
            <Nav />
          </nav>
        </div>

        {/* right: user info */}
        <div className="w-full md:w-1/3 flex justify-end items-center pr-3">
          <UserInfo session={session} />
        </div>
      </div>
    </header>
  );
}
