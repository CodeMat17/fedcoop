import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import NewsDetailContent from "../_components/NewsDetailContent";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const news = await fetchQuery(api.news.getNewsBySlug, { slug });

    if (!news) {
      return {
        title: "News Article Not Found - FedCoop",
        description: "The news article you're looking for could not be found.",
      };
    }

    // Strip HTML tags from body for description
    const plainTextBody = news.body.replace(/<[^>]*>/g, "").substring(0, 160);

    return {
      title: `${news.title} - FedCoop News`,
      description: plainTextBody || "Read the latest news from FedCoop.",
      openGraph: {
        title: news.title,
        description: plainTextBody || "Read the latest news from FedCoop.",
        images: news.imageUrl ? [news.imageUrl] : [],
        type: "article",
        publishedTime: new Date(news._creationTime).toISOString(),
      },
      twitter: {
        card: "summary_large_image",
        title: news.title,
        description: plainTextBody || "Read the latest news from FedCoop.",
        images: news.imageUrl ? [news.imageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "FedCoop News Article",
      description:
        "Read the latest news and updates from FedCoop - Federation of Federal Government Staff Cooperative Societies.",
    };
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;

  return <NewsDetailContent slug={slug} />;
}
