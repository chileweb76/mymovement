import {
  foodLatest,
  moodLatest,
  medsLatest,
  bowelLatest,
} from "@/lib/queries/queries";
import { TimeZone } from "./timezone/timeZone";
import SaveButton from "./buttons/Save";

export default async function Card(topic) {
  switch (topic.topic) {
    case "food":
      const entry = await foodLatest();

      if (entry.length !== 0) {
        return (
          <div className="bg-food h-80 ">
            <TimeZone entry={entry[0].createdAt} />

            <h2 className="text-2xl p-4">{entry[0].title}</h2>
            <p className="text-center px-4">{entry[0].notes}</p>
            <div className="flex justify-end ">
              <SaveButton button="Update" />
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
          <div className="bg-mood h-80 ">
            <TimeZone entry={entry2[0].createdAt} />

            <h2 className="text-2xl p-4">{entry2[0].title}</h2>
            <p className="text-center px-4">{entry2[0].notes}</p>
            <div className="flex justify-end">
              <SaveButton button="Update" />
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
          <div className="bg-meds h-80 ">
            <TimeZone entry={entry3[0].createdAt} />

            <h2 className="text-2xl p-4">{entry3[0].title}</h2>
            <p className="text-center px-4">{entry3[0].notes}</p>
            <div className="flex justify-end">
              <SaveButton button="Update" />
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
          <div className="bg-bowel h-80 ">
            <TimeZone entry={entry4[0].createdAt} />

            <h2 className="text-2xl p-4">{entry4[0].title}</h2>
            <p className="text-center px-4">{entry4[0].notes}</p>
            <div className="flex justify-end">
              <SaveButton button="Update" />
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
