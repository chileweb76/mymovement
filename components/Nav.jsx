import Link from "next/link";

export default function Nav() {
  return (
    <nav className="mx-4 text-white font-bold lg:text-xl">
      <Link className="mx-2" href="/home">
        Home
      </Link>
      <Link className="mx-2" href="/daily">
        Daily Summary
      </Link>
    </nav>
  );
}
