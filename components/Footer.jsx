<<<<<<< HEAD
=======
"use client";
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
import Image from "next/image";
import logo from "../public/img/mymovement_favicon.png";
import edamam from "@/public/img/Edamam_Badge_White.svg";
import Link from "next/link";

export default function Footer() {
  return (
<<<<<<< HEAD
    <div className="bg-background grid grid-cols-3 place-content-around p-6 mt-auto">
      <p className="text-xs sm:text-base text-white self-center">
        © Christopher Hile
      </p>
      <Link
        href="https://www.edamam.com/"
        className="justify-self-center self-center "
      >
        <Image src={edamam} alt="edamam.com logo" height={200} width={200} />
      </Link>
      <Image
        className="justify-self-end"
        src={logo}
        alt="mymovement mini logo"
        height={60}
        width={60}
      />
    </div>
=======
    <footer className="bg-[var(--brand-panel)] text-white py-4">
      <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between">
        {/* Left: Copyright */}
        <div className="flex items-center">
          <div className="text-sm">© Christopher Hile</div>
        </div>

        {/* Center: Edamam Badge */}
        <div className="flex items-center justify-center">
          <Link
            href="https://www.edamam.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Image
              src={edamam}
              alt="edamam.com logo"
              height={32}
              width={160}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Right: Logo */}
        <div className="flex items-center">
          <Image
            src={logo}
            alt="mymovement mini logo"
            height={40}
            width={40}
            className="block h-10 w-10 object-contain rounded-full"
          />
        </div>
      </div>
    </footer>
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
  );
}
