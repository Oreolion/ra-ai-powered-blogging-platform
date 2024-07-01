import About from "@/components/About";
import Footer from "@/components/Footer";
import ForthSection from "@/components/ForthSection";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ThirdSection from "@/components/ThirdSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section className="">
        <Navbar></Navbar>
        <Hero></Hero>
        <About></About>
        <ThirdSection></ThirdSection>
        <ForthSection></ForthSection>
        <Footer></Footer>
      </section>
    </main>
  );
}
