import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
// import Pricing from "@/components/Pricing";
import WaitlistForm from "@/components/WaitlistForm";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      {/* <Pricing /> */}
      <WaitlistForm />
      <CTA />
      <Footer />
    </>
  );
}
