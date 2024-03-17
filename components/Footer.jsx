import Image from "next/image";
import logo from "../public/img/mymovement_favicon.png";
import edamam from "@/public/img/Edamam_Badge_White.svg";
import Link from "next/link";

export default function Footer() {
  return (
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
  );
}
