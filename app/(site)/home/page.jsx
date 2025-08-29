import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth.js";
import NewEntry from "@/components/NewEntry";
import Card from "@/components/Card"; // replace with your card component path

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  return (
    <div className="min-h-screen">
      {/* NewEntry Container */}
      <div className="w-full px-4 py-8">
        <NewEntry />
      </div>
      <Card />
    </div>
  );
}
