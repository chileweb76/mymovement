import {
  foodRecent,
  moodRecent,
  medsRecent,
  bowelRecent,
} from "@/lib/queries/latestEntries";
import { TimeZone } from "@/components/timezone/timeZone";
import Button from "@/components/button/button";
import Link from "next/link";
import DeleteButton from "@/components/button/delete";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const TOPIC_COLORS = {
  food: "#DC965A",
  mood: "#00CFC1", 
  meds: "#773344",
  bowel: "#3C493F"
};

const TOPIC_LABELS = {
  food: "Food",
  mood: "Mood", 
  meds: "Medications",
  bowel: "Bowel"
};

/**
 * Server component that fetches recent entries for all topics and renders them in a scrollable view.
 */
export default async function RecentEntries({ limit = 10 }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    return (
      <div className="mt-8 w-5/6 mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center py-4 text-black">Please sign in to view your entries</h2>
      </div>
    );
  }

  // Fetch recent entries for all topics (with error handling)
  let foodEntries = [], moodEntries = [], medsEntries = [], bowelEntries = [];
  
  try {
    [foodEntries, moodEntries, medsEntries, bowelEntries] = await Promise.all([
      foodRecent(session.user.email, limit).catch(() => []),
      moodRecent(session.user.email, limit).catch(() => []),
      medsRecent(session.user.email, limit).catch(() => []),
      bowelRecent(session.user.email, limit).catch(() => []),
    ]);
  } catch (error) {
    console.error('Error fetching recent entries:', error);
    // Return empty arrays if there's an error
    foodEntries = moodEntries = medsEntries = bowelEntries = [];
  }

  // Combine all entries and sort by creation date
  const allEntries = [
    ...foodEntries.map(entry => ({ ...entry, topic: 'food' })),
    ...moodEntries.map(entry => ({ ...entry, topic: 'mood' })),
    ...medsEntries.map(entry => ({ ...entry, topic: 'meds' })),
    ...bowelEntries.map(entry => ({ ...entry, topic: 'bowel' })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
   .slice(0, limit);

  return (
    <div className="mt-8 w-5/6 mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-center py-4 text-black">Recent Entries</h2>
      
      {allEntries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No entries found. Start by adding your first entry!
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {allEntries.map((entry, index) => (
            <div
              key={entry.id || index}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div
                className="p-4 md:p-6 flex flex-col text-white"
                style={{ backgroundColor: TOPIC_COLORS[entry.topic] }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide opacity-90">
                      {TOPIC_LABELS[entry.topic]}
                    </span>
                  </div>
                  <div className="text-xs md:text-sm text-right flex-shrink-0">
                    <TimeZone entry={entry.createdAt} />
                  </div>
                </div>

                <h5 className="text-lg md:text-xl font-bold mb-2">{entry.title}</h5>

                <div className="flex-1">
                  {entry.notes && (
                    <>
                      <p className="text-xs md:text-sm opacity-90 mb-1">Notes:</p>
                      <p className="text-xs md:text-sm mb-3">{entry.notes}</p>
                    </>
                  )}

                  {entry.ingredients && entry.ingredients.length ? (
                    <>
                      <p className="text-xs md:text-sm opacity-90 mb-1">Ingredients:</p>
                      <p className="text-xs md:text-sm mb-3">
                        {Array.isArray(entry.ingredients)
                          ? entry.ingredients.join(", ")
                          : entry.ingredients}
                      </p>
                    </>
                  ) : null}
                </div>

                <div className="flex items-center justify-between">
                  <DeleteButton id={entry.id} />
                  <Link href={`/${entry.topic}/${entry.id}`} className="ml-auto">
                    <Button button="Update" variant="secondary" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
