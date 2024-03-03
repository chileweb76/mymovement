import { foodById } from "@/lib/queries/topicById";
import FoodForm from "@/components/entries/FoodForm";
import TopicForm from "@/components/TopicForm";

export default async function TopicPage({ params }) {
  const { topic, topicId } = params;

  const entry = await foodById(topicId);

  return (
    <main className="flex flex-col min-h-screen">
      <h2 className="text-3xl font-bold text-center py-6">Update</h2>
      <div
        className={`sm:mx-8 md:mx-20 my-6 p-9 bg-${
          topic === "food"
            ? "food"
            : topic === "mood"
            ? "mood"
            : topic === "meds"
            ? "meds"
            : "bowel"
        }`}
      >
        <div className="text-white">
          {topic === "food" ? (
            <FoodForm
              id={topicId}
              form="update"
              topic={entry.topic}
              title={entry.title}
              notes={entry.notes}
              ingredients={entry.ingredients}
            />
          ) : (
            <TopicForm
              id={topicId}
              form="update"
              topic={entry.topic}
              title={entry.title}
              notes={entry.notes}
            />
          )}
        </div>
      </div>
    </main>
  );
}
