"use client";

import EventsGalleryContent from "@/app/admin/_components/EventsGalleryContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import dayjs from "dayjs";
import { Minus, Search, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import AddExcoModal from "./_components/AddExcoModal";
import AddNewsModal from "./_components/AddNewsModal";
import AddTestimonialModal from "./_components/AddTestimonialModal";
import DeleteExcoModal from "./_components/DeleteExcoModal";
import DeleteNewsModal from "./_components/DeleteNewsModal";
import DeleteTestimonialModal from "./_components/DeleteTestimonialModal";
import UpdateExcoModal from "./_components/UpdateExcoModal";
import UpdateNewsModal from "./_components/UpdateNewsModal";
import UpdateTestimonialModal from "./_components/UpdateTestimonialModal";
import CooperativesContent from "./_components/container/CooperativesContent";
import ActivationContent from "./_components/container/ActivationContent";
import HeroPage from "./_components/container/HeroPage";
import MissionVision from "./_components/container/MissionVision";
import OurRoleEditor from "./_components/container/OurRoleEditor";
import AboutEditor from "./_components/container/AboutEditor";

const AdminPage = () => {
  const news = useQuery(api.news.getAllNews);
  const excos = useQuery(api.excos.getExcos);
  const testimonials = useQuery(api.testimonials.getAllTestimonials);

  const [searchQuery, setSearchQuery] = useState("");


  // Filter news based on search query (title or date)
  const filteredNews = useMemo(() => {
    if (!news) return undefined;
    if (!searchQuery.trim()) return news;

    const query = searchQuery.toLowerCase().trim();
    return news.filter((item) => {
      const title = item.title.toLowerCase();
      const date = dayjs(item._creationTime)
        .format("MMMM DD, YYYY")
        .toLowerCase();
      return title.includes(query) || date.includes(query);
    });
  }, [news, searchQuery]);

  return (
    <div className='px-4 pb-12 pt-24 w-full min-h-screen max-w-5xl mx-auto'>
      <h1 className='text-2xl md:text-4xl text-center font-bold mb-8'>
        Admin Management Page
      </h1>
      <div className='flex w-full flex-col gap-6'>
        <Tabs defaultValue='activation'>
          <TabsList className='w-full flex flex-wrap justify-start gap-2 py-2 px-1'>
            <TabsTrigger
              value='activation'
              className='whitespace-nowrap px-3 py-2 text-sm'>
              Activation
            </TabsTrigger>
            <TabsTrigger
              value='cooperatives'
              className='whitespace-nowrap px-3 py-2 text-sm'>
              Cooperatives
            </TabsTrigger>
            <TabsTrigger
              value='hero'
              className='whitespace-nowrap px-3 py-2 text-sm'>
              Hero Page
            </TabsTrigger>
            <TabsTrigger
              value='about'
              className='whitespace-nowrap px-3 py-2 text-sm'>
              About Us
            </TabsTrigger>
            <TabsTrigger
              value='mission'
              className='whitespace-nowrap px-3 py-2 text-sm'>
              Mission / Vision
            </TabsTrigger>
            <TabsTrigger
              value='directors'
              className='whitespace-nowrap px-3 py-2 text-sm'>
              Directors
            </TabsTrigger>
            <TabsTrigger
              value='news'
              className='whitespace-nowrap px-3 py-2 text-sm'>
              News
            </TabsTrigger>
            <TabsTrigger
              value='events'
              className='whitespace-nowrap px-3 py-2 text-sm'>
              Events
            </TabsTrigger>
            <TabsTrigger
              value='testimonials'
              className='whitespace-nowrap px-3 py-2 text-sm'>
              Testimonials
            </TabsTrigger>
            <TabsTrigger
              value='role'
              className='whitespace-nowrap px-3 py-2 text-sm'>
              Our Role
            </TabsTrigger>
          </TabsList>

          <TabsContent value='activation'>
            <ActivationContent />
          </TabsContent>

          <TabsContent value='cooperatives'>
            <CooperativesContent />
          </TabsContent>

          <TabsContent value='hero'>
            <HeroPage />
          </TabsContent>

          <TabsContent value='about'>
            <AboutEditor />
          </TabsContent>

          <TabsContent value='mission'>
            <MissionVision />
          </TabsContent>

          <TabsContent value='news'>
            <Card>
              <CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                <CardTitle className='text-xl sm:text-2xl'>News</CardTitle>
                <AddNewsModal />
              </CardHeader>
              <CardContent className='grid gap-6'>
                {/* Search Input */}
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    type='text'
                    placeholder='Search by title or date (e.g., "January 2025")...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-10 pr-10 transition-all duration-300 focus:ring-2'
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'>
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </div>

                {filteredNews === undefined ? (
                  <div className='flex px-4 py-32 items-center justify-center'>
                    <Minus className='w-4 h-4 animate-spin mr-2' />
                    Loading news...
                  </div>
                ) : filteredNews.length === 0 ? (
                  <div className='text-center px-4 py-32 text-muted-foreground'>
                    {searchQuery
                      ? "No news found matching your search"
                      : "No news found"}
                  </div>
                ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {filteredNews.map((item) => (
                      <div
                        key={item._id}
                        className='rounded-xl overflow-hidden shadow-lg border w-full'>
                        <div className='relative w-full aspect-video'>
                          <Image
                            alt={item.title}
                            fill
                            src={item.imageUrl || "/placeholder-image.jpg"}
                            className='object-cover'
                          />
                        </div>
                        <div className='p-4 space-y-3'>
                          <p className='text-sm text-muted-foreground'>
                            {dayjs(item._creationTime).format("MMMM DD, YYYY")}
                          </p>
                          <h3 className='text-lg font-semibold line-clamp-2'>
                            {item.title}
                          </h3>
                          <div className='flex gap-2 justify-between'>
                            <UpdateNewsModal news={item} />
                            <DeleteNewsModal news={item} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='directors'>
            <Card>
              <CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                <CardTitle className='text-xl sm:text-2xl'>Directors</CardTitle>
                <AddExcoModal />
              </CardHeader>
              <CardContent className='grid gap-6'>
                {excos === undefined ? (
                  <div className='flex px-4 py-32 items-center justify-center'>
                    <Minus className='w-4 h-4 animate-spin mr-2' />
                    Loading Directors...
                  </div>
                ) : excos.length === 0 ? (
                  <div className='text-center px-4 py-32 text-muted-foreground'>
                    No executives found
                  </div>
                ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {excos.map((exco) => (
                      <div
                        key={exco._id}
                        className='rounded-xl overflow-hidden shadow-lg border p-6 flex flex-col items-center text-center space-y-4'>
                        <div className='relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary/20'>
                          <Image
                            alt={exco.name}
                            fill
                            src={exco.imageUrl || "/placeholder-avatar.jpg"}
                            className='object-cover'
                          />
                        </div>
                        <div className='flex-1'>
                          <h3 className='text-lg font-semibold'>{exco.name}</h3>
                          <p className='text-sm text-muted-foreground'>
                            {exco.position}
                          </p>
                          <p className='text-sm text-muted-foreground line-clamp-3'>
                            {exco.description}
                          </p>
                        </div>
                        <div className='flex justify-between gap-2 w-full pt-2'>
                          <UpdateExcoModal exco={exco} />
                          <DeleteExcoModal exco={exco} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='events'>
            <EventsGalleryContent />
          </TabsContent>

          <TabsContent value='testimonials'>
            <Card>
              <CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                <CardTitle className='text-xl sm:text-2xl'>
                  Testimonials
                </CardTitle>
                <AddTestimonialModal />
              </CardHeader>
              <CardContent className='grid gap-6'>
                {testimonials === undefined ? (
                  <div className='flex px-4 py-32 items-center justify-center'>
                    <Minus className='w-4 h-4 animate-spin mr-2' />
                    Loading testimonials...
                  </div>
                ) : testimonials.length === 0 ? (
                  <div className='text-center px-4 py-32 text-muted-foreground'>
                    No testimonial found
                  </div>
                ) : (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {testimonials.map((testimonial) => (
                      <div
                        key={testimonial._id}
                        className='rounded-xl overflow-hidden shadow-lg border p-6 flex flex-col space-y-4'>
                        <div className='space-y-3 flex-1'>
                          <div className='flex items-start justify-between'>
                            <h3 className='text-lg font-semibold'>
                              {testimonial.name}
                            </h3>
                            <div className='flex gap-0.5'>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`text-lg ${
                                    star <= testimonial.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className='text-sm text-muted-foreground line-clamp-4'>
                            {testimonial.body}
                          </p>
                        </div>
                        <div className='flex justify-between gap-2 w-full pt-2'>
                          <UpdateTestimonialModal testimonial={testimonial} />
                          <DeleteTestimonialModal testimonial={testimonial} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='role'>
            <OurRoleEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
