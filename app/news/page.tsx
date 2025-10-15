"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import { ArrowRight, Calendar, Minus, Search, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title", label: "Title A-Z" },
];

export default function NewsPage() {
  const news = useQuery(api.news.getAllNews);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Share function
  const handleShare = async (newsItem: { slug: string; title: string }) => {
    const shareData = {
      title: newsItem.title,
      text: newsItem.title,
      url: `${window.location.origin}/news/${newsItem.slug}`,
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
        // You could add a toast notification here
        alert("Link copied to clipboard!");
      } catch (error) {
        console.log("Error copying to clipboard:", error);
      }
    }
  };

  // Filter and sort news
  const filteredNews = (news || [])
    .filter((newsItem) => {
      const matchesSearch =
        newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        newsItem.body.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b._creationTime - a._creationTime;
        case "oldest":
          return a._creationTime - b._creationTime;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const featuredNews = filteredNews.find((newsItem) => newsItem.featured);
  const regularNews = filteredNews.filter((newsItem) => !newsItem.featured);

  return (
    <div className='min-h-screen bg-background w-full max-w-6xl mx-auto'>
      {/* Hero Section */}
      <div className='bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 pt-24 pb-16'>
        <div className='container mx-auto px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6'>
              Latest News & Updates
            </h1>
            <p className='text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 px-4'>
              Stay informed about the latest developments in the cooperative
              movement
            </p>
          </div>
        </div>
      </div>

      {news === undefined ? (
        <div className='flex items-center justify-center py-32'>
          <Minus className='w-4 h-4 animate-spin mr-2' />
          Loading news...
        </div>
      ) : news.length === 0 ? (
        <div className='flex items-center justify-center py-32 animate-pulse'>
          {" "}
          No news found{" "}
        </div>
      ) : (
        <div className='container mx-auto px-4 py-12'>
          {/* Search and Filter Controls */}
          <div className='max-w-6xl mx-auto mb-8 sm:mb-12'>
            <div className='flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8'>
              <div className='flex-1'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
                  <Input
                    placeholder='Search news articles...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-10'
                  />
                </div>
              </div>
              <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className='w-full sm:w-48'>
                    <SelectValue placeholder='Sort by' />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Featured Article */}
          {featuredNews && (
            <div className='max-w-6xl mx-auto mb-12 sm:mb-16'>
              <h2 className='text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6'>
                Featured Article
              </h2>
              <Card className='overflow-hidden hover:shadow-lg transition-shadow duration-300'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-8 sm:px-8 items-center'>
                  <div className=''>
                    <div className='flex items-center gap-2 mb-4'>
                      <Badge
                        variant='outline'
                        className='bg-green-50 text-green-700 border-green-200'>
                        Featured
                      </Badge>
                    </div>
                    <h3 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 leading-tight'>
                      {featuredNews.title}
                    </h3>
                    {/* <p className='text-muted-foreground mb-3 leading-5 text-sm sm:text-base line-clamp-3'>
                      {featuredNews.body}
                    </p> */}
                   
                    <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3'>
                      <div className='flex items-center gap-2'>
                        <Calendar className='w-4 h-4' />
                        <span>
                          {dayjs(featuredNews._creationTime).format(
                            "MMM DD, YYYY"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-3'>
                      <Button asChild className='group w-full sm:w-auto'>
                        <Link href={`/news/${featuredNews.slug}`}>
                          Read More
                          <ArrowRight className='w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform' />
                        </Link>
                      </Button>

                      <Button
                        variant='outline'
                        onClick={() => handleShare(featuredNews)}
                        className='group w-full sm:w-auto'>
                        <Share2 className='w-4 h-4 mr-1 group-hover:scale-110 transition-transform' />
                        Share
                      </Button>
                    </div>
                  </div>
                  <div className='relative overflow-hidden aspect-video w-full rounded-xl mx-auto'>
                    <Image
                      src={featuredNews.imageUrl || "/hero.svg"}
                      alt={featuredNews.title}
                      fill
                      className=' object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* News Grid */}
          <div className='max-w-6xl mx-auto'>
            <h2 className='text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8'>
              All Articles
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {regularNews.map((newsItem) => (
                <Card
                  key={newsItem._id}
                  className='group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden py-0'>
                  <div className='relative h-48 overflow-hidden'>
                    <Image
                      src={newsItem.imageUrl || "/hero.svg"}
                      alt={newsItem.title}
                      width={400}
                      height={300}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                  </div>

                  <CardContent className='pt-0 pb-5 space-y-3'>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground'>
                      <div className='flex items-center gap-1'>
                        <Calendar className='w-3 h-3' />
                        <span>
                          {dayjs(newsItem._creationTime).format("MMM DD, YYYY")}
                        </span>
                      </div>
                    </div>

                    <h3 className='text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-5'>
                      {newsItem.title}
                    </h3>
                    {/* <p className='text-muted-foreground text-sm leading-5 line-clamp-3'>
                      {newsItem.body}
                    </p> */}
                    <div className='flex items-center justify-between gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleShare(newsItem)}
                        className='group '>
                        <Share2 className='w-2 h-2 mr-1  group-hover:scale-110 transition-transform' />
                        <span>Share</span>
                      </Button>

                      <Button asChild size='sm' className='group'>
                        <Link href={`/news/${newsItem.slug}`}>
                          Read More
                          <ArrowRight className='w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform' />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredNews.length === 0 && (
              <div className='text-center py-12 sm:py-16 px-4'>
                <div className='w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
                  <Search className='w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground' />
                </div>
                <h3 className='text-lg sm:text-xl font-semibold text-foreground mb-2'>
                  No articles found
                </h3>
                <p className='text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base'>
                  Try adjusting your search terms or filters
                </p>
                <Button
                  variant='outline'
                  onClick={() => {
                    setSearchTerm("");
                    setSortBy("newest");
                  }}
                  className='w-full sm:w-auto'>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
