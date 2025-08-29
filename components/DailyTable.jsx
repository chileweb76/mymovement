import Link from "next/link";
import { tableByDay } from "../lib/queries/dailyQuery";
import { TimeZone } from "./timezone/timeZone";

export default async function DailyTable(props) {
  if (props.date === undefined) {
    const date = new Date().toLocaleDateString();

    const entry = await tableByDay(date, props.topic);

    const getElements = (entry) => {
      let content = [];
      for (let i = 0; i < entry.length; i++) {
        switch (entry[i].topic) {
          case "food":
            content.push(
              <ul
                className="bg-food text-white p-6 m-4 rounded-full text-center flex-wrap"
                key={entry[i].topic}
              >
                <Link href={`/${entry[i].topic}/${entry[i].id}`}>
                  <div className="flex flex-row justify-center">
                    <TimeZone entry={entry[i].createdAt} />
                  </div>

                  <li key={entry[i].title}>{entry[i].title}</li>
                  <li key={entry[i].notes}>{entry[i].notes}</li>
                </Link>
              </ul>
            );
            break;
          case "mood":
            content.push(
              <ul
                className="bg-mood text-white p-6 m-4 rounded-full text-center flex-wrap"
                key={entry[i].topic}
              >
                <Link href={`/${entry[i].topic}/${entry[i].id}`}>
                  <div className="flex flex-row justify-center">
                    <TimeZone entry={entry[i].createdAt} />
                  </div>
                  <li key={entry[i].title}>{entry[i].title}</li>
                  <li key={entry[i].notes}>{entry[i].notes}</li>
                </Link>
              </ul>
            );
            break;
          case "meds":
            content.push(
              <ul
                className="bg-meds text-white p-6 m-4 rounded-full text-center flex-wrap"
                key={entry[i].topic}
              >
                <Link href={`/${entry[i].topic}/${entry[i].id}`}>
                  <div className="flex flex-row justify-center">
                    <TimeZone entry={entry[i].createdAt} />
                  </div>
                  <li key={entry[i].title}>{entry[i].title}</li>
                  <li key={entry[i].notes}>{entry[i].notes}</li>
                </Link>
              </ul>
            );
            break;
          case "bowel":
            content.push(
              <ul
                className="bg-bowel text-white p-6 m-4 rounded-full text-center flex-wrap"
                key={entry[i].topic}
              >
                <Link href={`/${entry[i].topic}/${entry[i].id}`}>
                  <div className="flex flex-row justify-center">
                    <TimeZone entry={entry[i].createdAt} />
                  </div>
                  <li key={entry[i].title}>{entry[i].title}</li>
                  <li key={entry[i].notes}>{entry[i].notes}</li>
                </Link>
              </ul>
            );
            break;

          default:
            break;
        }
      }
      return content;
    };

    return <>{getElements(entry)}</>;
  } else {
    const date = props.date;
    const entry = await tableByDay(date, props.topic);
    const getElements = (entry) => {
      let content = [];
      for (let i = 0; i < entry.length; i++) {
        switch (entry[i].topic) {
          case "food":
            content.push(
              <ul
                className="bg-food text-white p-6 m-4 rounded-full text-center flex-wrap"
                key={entry[i].topic}
              >
                <Link href={`/${entry[i].topic}/${entry[i].id}`}>
                  <div className="flex flex-row justify-center">
                    <TimeZone entry={entry[i].createdAt} />
                  </div>

                  <li key={entry[i].title}>{entry[i].title}</li>
                  <li key={entry[i].notes}>{entry[i].notes}</li>
                </Link>
              </ul>
            );
            break;
          case "mood":
            content.push(
              <ul
                className="bg-mood text-white p-6 m-4 rounded-full text-center flex-wrap"
                key={entry[i].topic}
              >
                <Link href={`/${entry[i].topic}/${entry[i].id}`}>
                  <div className="flex flex-row justify-center">
                    <TimeZone entry={entry[i].createdAt} />
                  </div>
                  <li key={entry[i].title}>{entry[i].title}</li>
                  <li key={entry[i].notes}>{entry[i].notes}</li>
                </Link>
              </ul>
            );
            break;
          case "meds":
            content.push(
              <ul
                className="bg-meds text-white p-6 m-4 rounded-full text-center flex-wrap"
                key={entry[i].topic}
              >
                <Link href={`/${entry[i].topic}/${entry[i].id}`}>
                  <div className="flex flex-row justify-center">
                    <TimeZone entry={entry[i].createdAt} />
                  </div>
                  <li key={entry[i].title}>{entry[i].title}</li>
                  <li key={entry[i].notes}>{entry[i].notes}</li>
                </Link>
              </ul>
            );
            break;
          case "bowel":
            content.push(
              <ul
                className="bg-bowel text-white p-6 m-4 rounded-full text-center flex-wrap"
                key={entry[i].topic}
              >
                <Link href={`/${entry[i].topic}/${entry[i].id}`}>
                  <div className="flex flex-row justify-center">
                    <TimeZone entry={entry[i].createdAt} />
                  </div>
                  <li key={entry[i].title}>{entry[i].title}</li>
                  <li key={entry[i].notes}>{entry[i].notes}</li>
                </Link>
              </ul>
            );
            break;

          default:
            break;
        }
      }
      return content;
    };

    return <>{getElements(entry)}</>;
  }
}
