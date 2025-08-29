import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { findUserByEmail } from "@/models/user";
import { getTopicCollection } from "@/models/topic";
import { ObjectId } from "mongodb";
import TopicForm from "@/components/TopicForm";

export default async function EditBowelPage({ params }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/signin");
  }

  const user = await findUserByEmail(session.user.email);
  if (!user) {
    redirect("/signin");
  }

  // Get the topic entry
  const col = await getTopicCollection();
  let entry;
  
  try {
    const objectId = new ObjectId(params.id);
    entry = await col.findOne({ _id: objectId, userId: user._id, topic: "bowel" });
  } catch (error) {
    console.error("Error finding entry:", error);
  }

  if (!entry) {
    redirect("/home");
  }

  return (
    <div className="h-full flex flex-col flex-1 bg-gradient-to-br from-green-100 to-green-300">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Edit Bowel Entry
            </h2>
          </div>
          <TopicForm 
            email={session.user.email}
            topic="bowel" 
            form="update"
            id={entry._id.toString()}
            title={entry.title}
            notes={entry.notes}
            ingredients={Array.isArray(entry.ingredients) ? entry.ingredients.join('\n') : entry.ingredients}
          />
        </div>
      </div>
    </div>
  );
}
