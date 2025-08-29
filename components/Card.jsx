import {
  foodLatest,
  moodLatest,
  medsLatest,
  bowelLatest,
} from "@/lib/queries/latestEntries";
<<<<<<< HEAD
import { TimeZone } from "./timezone/timeZone";
import Button from "./buttons/Button";
import Link from "next/link";
import DeleteButton from "./buttons/Delete";

export default async function Card(topic) {
  switch (topic.topic) {
    case "food":
      const entry = await foodLatest();

      if (entry.length !== 0) {
        return (
          <div className="bg-food h-max pb-4 mb-8">
            <div className="pt-4 px-4 flex flex-row justify-between">
              <TimeZone entry={entry[0].createdAt} />
            </div>
            <h2 className="text-2xl p-4">{entry[0].title}</h2>
            <p className="pl-4">Notes:</p>
            <p className="text-center px-4">{entry[0].notes}</p>
            {entry[0].ingredients !== "" ? (
              <p className="pl-4">Ingredients:</p>
            ) : null}

            <p className="text-center px-4">{entry[0].ingredients}</p>
            <div className="flex justify-between ">
              <DeleteButton id={entry[0].id} />
              <Link
                className="flex justify-end "
                href={`/${entry[0].topic}/${entry[0].id}`}
              >
                <Button button="Update" />
              </Link>
            </div>
          </div>
        );
      } else {
        return <div className="bg-food h-80"></div>;
      }
    case "mood":
      const entry2 = await moodLatest();

      if (entry2.length !== 0) {
        return (
          <div className="bg-mood h-max pb-4 mb-8 ">
            <div className="pt-4 px-4 flex flex-row justify-between">
              <TimeZone entry={entry2[0].createdAt} />
            </div>

            <h2 className="text-2xl p-4">{entry2[0].title}</h2>
            <p className="pl-4">Notes:</p>
            <p className="text-center px-4">{entry2[0].notes}</p>
            <div className="flex justify-between ">
              <DeleteButton id={entry2[0].id} />
              <Link
                className="flex justify-end "
                href={`/${entry2[0].topic}/${entry2[0].id}`}
              >
                <Button button="Update" />
              </Link>
            </div>
          </div>
        );
      } else {
        return <div className="bg-mood h-80"></div>;
      }
    case "meds":
      const entry3 = await medsLatest();

      if (entry3.length !== 0) {
        return (
          <div className="bg-meds h-max pb-4 mb-8 ">
            <div className="pt-4 px-4 flex flex-row justify-between">
              <TimeZone entry={entry3[0].createdAt} />
            </div>
            <h2 className="text-2xl p-4">{entry3[0].title}</h2>
            <p className="pl-4">Notes:</p>
            <p className="text-center px-4">{entry3[0].notes}</p>
            <div className="flex justify-between ">
              <DeleteButton id={entry3[0].id} />
              <Link
                className="flex justify-end "
                href={`/${entry3[0].topic}/${entry3[0].id}`}
              >
                <Button button="Update" />
              </Link>
            </div>
          </div>
        );
      } else {
        return <div className="bg-meds h-80"></div>;
      }
    case "bowel":
      const entry4 = await bowelLatest();

      if (entry4.length !== 0) {
        return (
          <div className="bg-bowel h-max pb-4 mb-8 ">
            <div className="pt-4 px-4 flex flex-row justify-between">
              <TimeZone entry={entry4[0].createdAt} />
            </div>
            <h2 className="text-2xl p-4">{entry4[0].title}</h2>
            <p className="pl-4">Notes:</p>
            <p className="text-center px-4">{entry4[0].notes}</p>
            <div className="flex justify-between ">
              <DeleteButton id={entry4[0].id} />
              <Link
                className="flex justify-end "
                href={`/${entry4[0].topic}/${entry4[0].id}`}
              >
                <Button button="Update" />
              </Link>
            </div>
          </div>
        );
      } else {
        return <div className="bg-bowel h-80"></div>;
      }
    default:
      break;
  }
}
=======
import { TimeZone } from "@/components/timezone/timeZone";
import Button from "@/components/button/button";
import Link from "next/link";
import DeleteButton from "@/components/button/delete";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Server component that fetches latest entry for each topic and renders Tailwind cards.
 */
export default async function Card() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  
  if (!userEmail) {
    return <div>Please log in to view your entries.</div>;
  }

  const [foodRes, moodRes, medsRes, bowelRes] = await Promise.all([
    foodLatest(userEmail),
    moodLatest(userEmail),
    medsLatest(userEmail),
    bowelLatest(userEmail),
  ]);

  const collections = [
    { key: "food", entry: foodRes?.[0] ?? null, color: "#DC965A" },
    { key: "mood", entry: moodRes?.[0] ?? null, color: "#00CFC1" },
    { key: "meds", entry: medsRes?.[0] ?? null, color: "#773344" },
    { key: "bowel", entry: bowelRes?.[0] ?? null, color: "#3C493F" },
  ];

  return (
    <div className="mt-8 w-5/6 mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-center py-4 text-black">Latest Entry</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6 lg:gap-8 px-4 md:px-6 lg:px-8">
        {collections.map(({ key, entry, color }) => (
          <div key={key} className="h-48 md:h-52 lg:h-56 xl:h-60 w-full">
            {entry ? (
              <div className="bg-white rounded-lg shadow-lg h-full w-full overflow-hidden">
                <div
                  className="p-4 md:p-6 lg:p-8 flex flex-col h-full text-white"
                  style={{ backgroundColor: color }}
                >
                  <div className="flex justify-between items-start">
                    <div className="text-xs md:text-sm">
                      <TimeZone entry={entry.createdAt} />
                    </div>
                  </div>

                  <h5 className="text-xl md:text-2xl lg:text-3xl font-bold mt-2 md:mt-3">{entry.title}</h5>

                  <p className="text-xs md:text-sm mt-2">Notes:</p>
                  <p className="mt-1 flex-1 text-xs md:text-sm">{entry.notes}</p>

                  {entry.ingredients && entry.ingredients.length ? (
                    <>
                      <p className="text-xs md:text-sm mt-3">Ingredients:</p>
                      <p className="mt-1 text-xs md:text-sm">
                        {Array.isArray(entry.ingredients)
                          ? entry.ingredients.join(", ")
                          : entry.ingredients}
                      </p>
                    </>
                  ) : null}

                  <div className="flex items-center justify-between mt-3 md:mt-4">
                    <DeleteButton id={entry.id} />
                    <Link href={`/${entry.topic}/${entry.id}`} className="ml-auto">
                      <Button button="Update" variant="secondary" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="rounded-lg shadow-lg h-full w-full"
                style={{ backgroundColor: color }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
>>>>>>> d651c79f538e6ffa78124dcb4e5bbc469c6e3b4b
