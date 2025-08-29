import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth.js";
import NewEntry from "@/components/NewEntry";

// FoodForm is a client component, import directly
import FoodForm from "@/components/entries/FoodForm";

export default async function FoodEntry() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const email = session?.user?.email;

  return (
    <main className="min-h-screen flex flex-col">
      <NewEntry />

      <div className="w-full px-4 py-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="p-6 rounded-lg shadow" style={{ backgroundColor: "#DC965A" }}>
            <div className="text-white">
              {/* FoodForm is a client component, it will hydrate on the client */}
              <FoodForm email={email} topic="food" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
