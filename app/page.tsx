import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import TrendingSection from "@/components/home/TrendingSection";
import CustomOrderBanner from "@/components/home/CustomOrderBanner";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <NewArrivalsSection />
      <TrendingSection />
      <CustomOrderBanner />
      <TestimonialsSection />
    </>
  );
}
