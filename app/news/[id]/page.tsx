"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { ArrowLeft, Calendar, Minus, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function NewsDetailPage() {
  const params = useParams();
  const newsId = params.id as string;
  const news = useQuery(api.news.getNewsById, { id: newsId as Id<"news"> });

  // Share function
  const handleShare = async () => {
    const shareData = {
      title: news?.title || "FedCoop News",
      text: news?.title || "Check out this news article from FedCoop",
      url: `${window.location.origin}/news/${newsId}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      } catch (error) {
        console.log("Error copying to clipboard:", error);
      }
    }
  };

  if (news === undefined) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='container mx-auto px-4 pt-24 pb-16'>
          <div className='flex items-center justify-center py-32'>
            <Minus className='w-4 h-4 animate-spin mr-2' />
            Loading news article...
          </div>
        </div>
      </div>
    );
  }

  if (news === null) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='container mx-auto px-4 pt-24 pb-16'>
          <Card className='max-w-2xl mx-auto'>
            <CardContent className='p-8 text-center'>
              <h1 className='text-2xl font-bold text-foreground mb-4'>
                News Article Not Found
              </h1>
              <p className='text-muted-foreground mb-6'>
                The news article you&apos;re looking for doesn&apos;t exist or
                has been removed.
              </p>
              <Link href='/news'>
                <Button variant='outline'>
                  <ArrowLeft className='w-4 h-4 mr-2' />
                  Back to News
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='w-full max-w-3xl mx-auto px-4 pt-24 pb-12'>
        {/* Back Button */}
        <div className='mb-8'>
          <Link href='/news'>
            <Button
              variant='ghost'
              className='text-muted-foreground hover:text-foreground'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to News
            </Button>
          </Link>
        </div>

        <div className='max-w-4xl mx-auto'>
          {/* Article Header */}
          <Card className='mb-6 sm:mb-8'>
            <CardHeader className='pb-4'>
              {news.featured && (
                <div className='flex items-center gap-2 mb-3 sm:mb-4'>
                  <Badge
                    variant='outline'
                    className='bg-green-50 text-green-700 border-green-200'>
                    Featured
                  </Badge>
                </div>
              )}

              <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3 sm:mb-4'>
                {news.title}
              </h1>

              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 sm:mt-6'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    <span>
                      {new Date(news._creationTime).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
                <Button
                  variant='outline'
                  onClick={handleShare}
                  className='group w-full sm:w-auto'>
                  <Share2 className='w-4 h-4 mr-2 group-hover:scale-110 transition-transform' />
                  Share
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Article Photo */}
          <Card className='mb-6 sm:mb-8 overflow-hidden py-0'>
            <div className='relative h-64 sm:h-80 md:h-96 overflow-hidden'>
              <Image
                src={news.imageUrl || "/hero.svg"}
                alt={news.title}
                width={800}
                height={600}
                className='w-full h-full object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
            </div>
          </Card>

          {/* Article Content */}
          <Card>
            <CardContent className='p-4 sm:p-6 md:p-8'>
              <div
                className='prose prose-sm sm:prose-base md:prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-li:text-foreground'
                dangerouslySetInnerHTML={{ __html: news.body }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
