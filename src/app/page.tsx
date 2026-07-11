import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ServicesShowcase } from "@/components/ServicesShowcase";
import { BenefitsSection } from "@/components/BenefitsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { StudioMapSection } from "@/components/StudioMapSection";
import { BookingWizard } from "@/components/BookingWizard";
import { Footer } from "@/components/Footer";
import { WhatsAppFloatingBtn } from "@/components/WhatsAppFloatingBtn";
import { getServices, getPublicSettings } from "@/app/actions/booking";



export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialServices = await getServices();
  const settings = await getPublicSettings();

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0B] text-slate-100 font-sans selection:bg-[#006BFF] selection:text-white">
      {/* Premium Sticky Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* About Crislan Section */}
      <AboutSection />

      {/* Interactive Services Showcase */}
      <ServicesShowcase />

      {/* Core Benefits */}
      <BenefitsSection />

      {/* 60-Second Scheduling System Anchor Section */}
      <div className="py-24 bg-gradient-to-b from-[#0B0B0B] via-[#070707] to-[#0B0B0B]">
        <BookingWizard initialServices={initialServices} settings={settings} />
      </div>

      {/* Testimonials and Gallery */}
      <TestimonialsSection />

      {/* Studio Location & FAQ */}
      <StudioMapSection />

      {/* High Performance Footer */}
      <Footer />

      {/* Persistent WhatsApp Contact Button */}
      <WhatsAppFloatingBtn />
    </div>
  );
}
