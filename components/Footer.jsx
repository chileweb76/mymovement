import Image from "next/image";
import logo from "../public/img/mymovement_favicon.png";

export default function Footer() {
  return (
    <div className="bg-background grid grid-cols-2 place-content-between p-6 mt-auto">
      <p className="text-white self-center">© Christopher Hile</p>
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
