import {
  foodLatest,
  moodLatest,
  medsLatest,
  bowelLatest,
} from "@/lib/queries/latestEntries";
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
