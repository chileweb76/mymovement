import Link from "next/link";

export default function Nav() {
  return (
    <nav className="mx-4 text-white font-bold lg:text-xl">
      <Link className="lg:mx-4 mx-2 hover:text-button_hover" href="/home">
        Home
      </Link>
      <Link className="lg:mx-4 mx-2 hover:text-button_hover" href="/daily">
        Daily Summary
      </Link>
    </nav>
  );
}
