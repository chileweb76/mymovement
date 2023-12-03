import Newentry from "@/components/NewEntry";
import Card from "@/components/Card";

export default async function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Newentry />
      <h1 className="text-3xl font-bold m-4">Latest Entry</h1>
      <div className="mx-8 md:grid md:grid-cols-4 md:gap-4 text-white">
        <Card topic="food" />
        <Card topic="mood" />
        <Card topic="meds" />
        <Card topic="bowel" />
      </div>
    </main>
  );
}
