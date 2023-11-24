import Newentry from "@/components/NewEntry";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Newentry />
      <h1 className="text-3xl font-bold m-4">Latest Entry</h1>
    </main>
  );
}
