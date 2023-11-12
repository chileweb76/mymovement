import Nav from "../components/Nav";
import UserInfo from "../components/Userinfo";
import logo from "../public/img/mymovement_png.png";
import Image from "next/image";

export default function Header() {
  return (
    <div className="bg-background grid md:grid-cols-3 content-between">
      <div className="max-w-md">
        <Image className="m-10" src={logo} alt="mymovement logo" />
      </div>
      <div className="justify-self-center md:justify-self-end md:place-self-end pb-4">
        <Nav />
      </div>
      <div>
        <UserInfo />
      </div>
    </div>
  );
}
