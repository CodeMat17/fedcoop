"use client";

import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Minus, Star } from "lucide-react";

export function TestimonialSection() {
  const testimonials = useQuery(api.testimonials.getAllTestimonials);

  return (
    <section className='py-16 bg-muted/30'>
      <div className='w-full max-w-6xl mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold tracking-tight mb-4'>
            What Our Member Cooperatives Say
          </h2>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Hear from our member cooperative societies about their partnership
            with FEDCOOP and how we&apos;ve supported their growth and
            development.
          </p>
        </div>

        {testimonials === undefined ? (
          <div className='flex py-32 justify-center'>
            <Minus className='animate-spin mr-2' /> Loading Testimonials...
          </div>
        ) : testimonials.length === 0 ? (
          <div className='flex py-32 justify-center animate-pulse'>
            No testimonials found
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {testimonials.map((testimonial) => (
              <Card key={testimonial._id} className='h-full'>
                <CardContent className='p-6 h-full flex flex-col'>
                  <div className='flex items-center mb-4'>
                  
                      <h4 className='font-semibold leading-tight text-lg'>
                        {testimonial.name}
                      </h4>
                      {/* <p className='font-medium text-muted-foreground'>
                        Staff Multipurpose Cooperative Society
                      </p> */}
                  
                  </div>

                  <div className='flex items-center mb-3'>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className='h-4 w-4 fill-yellow-400 text-yellow-400'
                      />
                    ))}
                  </div>

                  <blockquote className='text-muted-foreground flex-grow italic'>
                    &quot;{testimonial.body}&quot;
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className='text-center mt-12'>
          <p className='text-sm text-muted-foreground'>
            Join hundreds of cooperative societies that trust FEDCOOP as their
            financial partner and development ally.
          </p>
        </div>
      </div>
    </section>
  );
}
