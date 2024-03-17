import DateSelection from "@/components/DateSelection";
import DropDown from "@/components/DropDown";
import Newentry from "@/components/NewEntry";
import DailyTable from "../../components/DailyTable";

export default async function DailySummary({ searchParams }) {
  return (
    <main className="flex flex-col min-h-screen">
      <Newentry />
      <h1 className="text-3xl font-bold text-center m-4">Daily Summary</h1>
      <div className="flex flex-col-reverse sm:grid sm:grid-cols-4 ">
        <div className="sm:col-span-3">
          <DailyTable date={searchParams.date} />
        </div>
        <div className="mx-8">
          <DateSelection />
          <DropDown />
        </div>
      </div>
    </main>
  );
}
