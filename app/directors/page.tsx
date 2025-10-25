"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Minus } from "lucide-react";

const DirectorsPage = () => {
  const executives = useQuery(api.excos.getExcos);

  return (
    <div className='min-h-screen bg-background relative overflow-hidden'>
      {/* Background decorative dots */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute top-20 left-10 w-3 h-3 bg-purple-300 rounded-full opacity-60'></div>
        <div className='absolute top-32 right-20 w-2 h-2 bg-blue-300 rounded-full opacity-50'></div>
        <div className='absolute top-60 left-1/4 w-4 h-4 bg-orange-300 rounded-full opacity-40'></div>
        <div className='absolute bottom-40 right-1/3 w-2 h-2 bg-pink-300 rounded-full opacity-50'></div>
        <div className='absolute bottom-60 left-20 w-3 h-3 bg-blue-400 rounded-full opacity-30'></div>
        <div className='absolute top-1/2 left-10 w-2 h-2 bg-green-300 rounded-full opacity-60'></div>
        <div className='absolute bottom-20 right-10 w-4 h-4 bg-yellow-300 rounded-full opacity-40'></div>
      </div>

      {/* Header Section */}
      <div className='w-full max-w-6xl mx-auto px-4 pt-24 pb-12 relative z-10'>
        <div className='text-center mb-20'>
          <h1 className='text-5xl md:text-6xl font-bold text-foreground mb-6'>
            FEDCOOP Board of Directors
          </h1>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
            Meet the dedicated leaders serving FedCoop&apos;s members and
            community with passion and expertise
          </p>
        </div>

        {executives === undefined ? (
          <div className='flex items-center justify-center px-4 py-32'>
            {" "}
            <Minus className='w-4 h-4 animate-spin mr-2' /> loading Directors
            profile
          </div>
        ) : executives.length === 0 ? (
          <div className='text-center px-4 py-32'>
            No Director profile found
          </div>
        ) : (
          <div>
            {/* Executive Gallery */}
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-16 lg:gap-20'>
              {executives.map((executive, index) => (
                <div
                  key={executive._id}
                  className='relative group'
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animation: "fadeInUp 1s ease-out forwards",
                    opacity: 0,
                  }}>
                  {/* Organic blob shape */}
                  <div className='absolute inset-0 -z-10'>
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700'></div>
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl group-hover:scale-105 transition-transform duration-700'></div>
                  </div>

                  {/* Main photo container */}
                  <div className='relative z-10 flex flex-col items-center'>
                    {/* Photo */}
                    <div className='relative mb-3'>
                      <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500'></div>
                      <Avatar className={`w-64 h-64 border-4 ${executive.position === 'President' ? 'border-amber-500/60' : 'border-white'} shadow-2xl group-hover:scale-105 transition-all duration-500`}>
                        <AvatarImage
                          src={executive.imageUrl || undefined}
                          alt={executive.name}
                          className='object-cover'
                        />
                        <AvatarFallback className='text-4xl font-bold bg-primary/10 text-primary'>
                          {executive.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Name and Position */}
                    <div className='text-center'>
                      <h3 className='text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300'>
                        {executive.name}
                      </h3>
                      <p className='text-muted-foreground text-lg'>
                        {executive.position}
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        {executive.description}
                      </p>
                    </div>
                  </div>

                  {/* Decorative dots around each executive */}
                  <div className='absolute top-12 left-8 w-2 h-2 bg-purple-300 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500'></div>
                  <div className='absolute top-24 right-12 w-3 h-3 bg-blue-300 rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-500 delay-100'></div>
                  <div className='absolute bottom-20 left-12 w-2 h-2 bg-orange-300 rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-500 delay-200'></div>
                  <div className='absolute bottom-32 right-8 w-2 h-2 bg-pink-300 rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-500 delay-300'></div>
                </div>
              ))}
            </div>

            {/* Additional Info Section */}
            <div className='mt-32 text-center'>
              <Card className='bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 shadow-xl max-w-5xl mx-auto'>
                <CardContent className='p-12'>
                  <h2 className='text-3xl font-bold text-foreground mb-6'>
                    Leadership Structure
                  </h2>
                  <p className='text-muted-foreground leading-relaxed text-lg max-w-4xl mx-auto'>
                    Our Directors consists of dedicated members elected by the
                    cooperative&apos;s membership. Each position plays a crucial
                    role in ensuring the smooth operation and growth of FEDCOOP,
                    serving our members with integrity, transparency, and
                    unwavering commitment to our shared values.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DirectorsPage;
