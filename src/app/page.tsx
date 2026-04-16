import { AboutPreview } from "@/components/sections/about-preview";
import { FeaturedDishes } from "@/components/sections/featured-dishes";
import { HeroSection } from "@/components/sections/hero";
import { getMenuData } from "@/lib/data";

export default async function Home() {
  const { items } = await getMenuData();

  return (
    <div className="space-y-10">
      <HeroSection />
      <FeaturedDishes items={items} />
      <AboutPreview />
    </div>
  );
}
