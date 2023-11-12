import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Newentry from "../../components/NewEntry";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <Newentry />
      <Footer />
    </main>
  );
}
