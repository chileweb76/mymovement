import Nav from "../components/Nav";
import UserInfo from "../components/Userinfo";
import logo from "../public/img/mymovement_png.png";
import Image from "next/image";

export default function Header() {
  return (
    <div className="bg-background grid md:grid-cols-3 justify-around">
      <div className="justify-self_center">
        <Image
          className="sm:scale-75 scale-75 sm:m-10"
          src={logo}
          alt="mymovement logo"
        />
      </div>
      <div className="justify-self-center md:place-self-end pb-4">
        <Nav />
      </div>
      <div>
        <UserInfo />
      </div>
    </div>
  );
}
