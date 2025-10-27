"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Heart, TrendingUp } from "lucide-react";

export function MissionVisionSection() {
  const mission = useQuery(api.missionVision.getMission);
  const vision = useQuery(api.missionVision.getVision);

  return (
    <section className='py-16 bg-gradient-to-br from-primary/5 via-background to-primary/8'>
      <div className='container'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold mb-6'>
            Our Mission & Vision
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Driving Nigeria&apos;s cooperative movement towards a sustainable
            and prosperous future.
          </p>
        </motion.div>

        <div className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}>
            <Card className='h-full border-primary/20 bg-primary/5 hover:shadow-lg transition-shadow'>
              <CardContent className='p-8'>
                <div className='flex items-center space-x-4 mb-6'>
                  <div className='p-3 rounded-lg bg-primary/10'>
                    <TrendingUp className='h-8 w-8 text-primary' />
                  </div>
                  <h3 className='text-2xl font-bold'>Our Mission</h3>
                </div>
                {mission === undefined ? (
                  // Mission Skeleton
                  <div className='space-y-3'>
                    <Skeleton className='h-4 w-full rounded' />
                    <Skeleton className='h-4 w-11/12 rounded' />
                    <Skeleton className='h-4 w-10/12 rounded' />
                    <Skeleton className='h-4 w-9/12 rounded' />
                    <Skeleton className='h-4 w-full rounded' />
                  </div>
                ) : (
                  <p className='text-muted-foreground leading-relaxed'>
                    {mission.body}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}>
            <Card className='h-full border-primary/20 bg-primary/5 hover:shadow-lg transition-shadow'>
              <CardContent className='p-8'>
                <div className='flex items-center space-x-4 mb-6'>
                  <div className='p-3 rounded-lg bg-primary/10'>
                    <Heart className='h-8 w-8 text-primary' />
                  </div>
                  <h3 className='text-2xl font-bold'>Our Vision</h3>
                </div>
                {vision === undefined ? (
                  // Vision Skeleton
                  <div className='space-y-3'>
                    <Skeleton className='h-4 w-full rounded' />
                    <Skeleton className='h-4 w-2/3 rounded' />
                    <Skeleton className='h-4 w-1/2 rounded' />
                  </div>
                ) : (
                  <p className='text-muted-foreground leading-relaxed'>
                    {vision.body}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
