import { HeroSection } from "@/components/hero-section";
import { KeyAchievements } from "@/components/key-achievements";
import { MissionVisionSection } from "@/components/mission-vision-section";
import { TestimonialSection } from "@/components/testimonial-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "FedCoop - Federation of Federal Government Staff Cooperative Societies | Home",
  description:
    "Official website of FedCoop - The umbrella organization for all federal cooperative societies in Nigeria. Unifying workers cooperatives through cooperation, collaboration, advocacy, peer review, training and investment for a Nigeria without hunger and poverty.",
  openGraph: {
    title: "FedCoop - Unifying Federal Cooperatives in Nigeria",
    description:
      "Join the leading federation of federal government staff cooperative societies. Empowering members through collaboration, training, and investment opportunities.",
  },
  twitter: {
    title: "FedCoop - Unifying Federal Cooperatives in Nigeria",
    description:
      "Join the leading federation of federal government staff cooperative societies. Empowering members through collaboration, training, and investment opportunities.",
  },
};

export default function Home() {
  return (
    <div className='min-h-screen'>
      <HeroSection />
      <MissionVisionSection />
      {/* <AboutSection /> */}
      <KeyAchievements />
      <TestimonialSection />
      {/* <EventGallerySection /> */}
    </div>
  );
}
