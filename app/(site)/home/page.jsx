import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth.js";
import NewEntry from "@/components/NewEntry";
import Card from "@/components/Card"; // latest entries card grid
import RecentEntries from "@/components/RecentEntries"; // scrollable recent entries

export default async function HomePage({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  // Await searchParams before using its properties (Next.js 15 requirement)
  const params = await searchParams;
  const showRecent = params?.view === 'recent';

  return (
    <div className="min-h-screen">
      {/* NewEntry Container */}
      <div className="w-full px-4 py-8">
        <NewEntry />
      </div>
      
      {/* View Toggle */}
      <div className="w-5/6 mx-auto mb-4">
        <div className="flex gap-2 justify-center">
          <a 
            href="/home"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !showRecent 
                ? 'bg-[#077187] text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Latest Entries
          </a>
          <a 
            href="/home?view=recent"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showRecent 
                ? 'bg-[#077187] text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Recent Entries
          </a>
        </div>
      </div>

      {/* Content */}
      {showRecent ? <RecentEntries limit={15} /> : <Card />}
    </div>
  );
}
