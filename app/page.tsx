import { AboutSection } from "@/components/about-section";
import { EventGallerySection } from "@/components/event-gallery-section";
import { HeroSection } from "@/components/hero-section";
import { KeyAchievements } from "@/components/key-achievements";
import { MissionVisionSection } from "@/components/mission-vision-section";
import { TestimonialSection } from "@/components/testimonial-section";

export default function Home() {
  return (
    <div className='min-h-screen'>
      <HeroSection />
      <MissionVisionSection />
      <AboutSection />
      <KeyAchievements />
      <TestimonialSection />
      <EventGallerySection />
    </div>
  );
}
