import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth.js";
import NewEntry from "@/components/NewEntry";
import TopicForm from "@/components/TopicForm";

export default async function MoodEntry() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  return (
    <main className="flex flex-col min-h-screen">
      <NewEntry />

      <div className="w-full px-4 py-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="p-6 rounded-lg" style={{ backgroundColor: "#00CFC1" }}>
            <TopicForm email={session.user.email} topic="mood" />
          </div>
        </div>
      </div>
    </main>
  );
}
