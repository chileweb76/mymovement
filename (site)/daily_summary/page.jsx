import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth.js";
import DailySummaryChart from "@/components/DailySummaryChart";

export default async function DailySummaryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-black">
          Daily Summary
        </h1>
        <DailySummaryChart userEmail={session.user.email} />
      </div>
    </div>
  );
}
