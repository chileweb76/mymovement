import NewEntry from "@/components/NewEntry";
import FoodForm from "@/components/entries/FoodEntry";

export default function FoodEntry() {
  return (
    <main className="flex flex-col min-h-screen">
      <NewEntry />
      <FoodForm />
    </main>
  );
}
