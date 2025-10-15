"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MembersMarquee } from "./members-marquee";

export function HeroSection() {
  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/10 pt-20 xl:py-0'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10 -z-10'>
        <svg
          className='w-full h-full'
          viewBox='0 0 100 100'
          preserveAspectRatio='none'
          xmlns='http://www.w3.org/2000/svg'>
          <defs>
            <pattern
              id='grid'
              width='3'
              height='5'
              patternUnits='userSpaceOnUse'>
              <path
                d='M 10 0 L 0 0 0 10'
                fill='none'
                stroke='currentColor'
                strokeWidth='0.3'
              />
            </pattern>
          </defs>
          <rect width='100' height='100' fill='url(#grid)' />
        </svg>
      </div>

      <div className='container relative z-10'>
        <div className='grid lg:grid-cols-2 gap-4 items-center py-4'>
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='space-y-8'>
            <div className='space-y-4'>
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className='inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-primary/10 text-primary'>
                <Handshake className='w-4 h-4 mr-2' />
                Uniting Workers Cooperatives
              </motion.div> */}

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className='text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight xl:mt-12'>
                Federation of Federal Government Staff Cooperatives (FEDCOOP)
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className='text-xl text-muted-foreground max-w-2xl'>
                Unifying Workers Cooperatives for a Better World through
                Cooperation, Collaboration, Advocacy, Peer Review, Training and
                Investment.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className='flex flex-col sm:flex-row gap-4'>
              <Button asChild size='lg' className='group'>
                <Link href='/members'>
                  <>
                    Join Us
                    <ArrowRight
                      className='ml-2 h-4 w-4
                transition-transform group-hover:translate-x-1'
                    />
                  </>
                </Link>
              </Button>                                                                                                   
              <Button asChild variant='outline' size='lg'>
                <Link href='/contact'>
                  <>
                    Contact Us
                    <ArrowRight
                      className='ml-2 h-4 w-4
                transition-transform group-hover:translate-x-1'
                    />
                  </>
                </Link>
              
               
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Content - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='relative '>
            <div className='relative flex justify-center'>
              {/* Marquee */}
              <MembersMarquee />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
