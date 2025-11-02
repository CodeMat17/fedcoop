import { ContactSection } from "@/components/contact-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - FEDCOOP | Get in Touch",
  description:
    "Contact FEDCOOP - Federal Civil Service Staff of Nigeria Cooperative Societies. Reach out to us for inquiries, support, or to learn more about joining our cooperative network.",
  openGraph: {
    title: "Contact FEDCOOP - Get in Touch",
    description:
      "Reach out to FEDCOOP for inquiries, support, or to learn more about joining our cooperative network. We're here to help.",
  },
  twitter: {
    title: "Contact FEDCOOP - Get in Touch",
    description:
      "Reach out to FEDCOOP for inquiries, support, or to learn more about joining our cooperative network. We're here to help.",
  },
};

const ContactPage = () => {
  return (
    <div className='min-h-screen bg-background pb-12 pt-24'>
      <div className='w-full max-w-6xl mx-auto'>
        <ContactSection />
      </div>
    </div>
  );
};

export default ContactPage;
