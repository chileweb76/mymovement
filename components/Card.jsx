import { foodLatest } from "@/lib/queries/queries";

export default async function Card(topic) {
  switch (topic.topic) {
    case "food":
      const entry = await foodLatest();

      if (entry.length !== 0) {
        const date = entry[0].createdAt.toLocaleString("en-us", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const time = entry[0].createdAt.toLocaleString("en-us", {
          hour: "numeric",
          minute: "numeric",
        });
        return (
          <div className="bg-food h-80 ">
            <p className="pl-4 pt-4">{date}</p>
            <p className="pl-4">{time}</p>
            <h2 className="text-2xl p-4">{entry[0].title}</h2>
            <p className="text-center px-4">{entry[0].notes}</p>
          </div>
        );
      } else {
        return <div className="bg-food h-80"></div>;
      }
    case "mood":
      return <div className="bg-mood h-80"></div>;
    case "meds":
      return <div className="bg-meds h-80"></div>;
    case "bowel":
      return <div className="bg-bowel h-80"></div>;
    default:
      break;
  }
}
