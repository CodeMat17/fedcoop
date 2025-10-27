"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  Building2,
  Handshake,
  Lightbulb,
  Shield,
  Target,
  Users,
  BookOpen,
  Leaf,
  HeartHandshake,
  TrendingUp,
  LucideIcon,
} from "lucide-react";
import Image from "next/image";
import React from "react";

// Map icon names to actual components with proper typing - FIXED MAPPINGS
const iconMap: Record<string, LucideIcon> = {
  Users: Users,
  Shield: Shield,
  BookOpen: BookOpen, // Fixed: Using actual BookOpen icon
  Leaf: Leaf, // Fixed: Using actual Leaf icon
  Building: Building2,
  Building2: Building2, // Added Building2 mapping
  Target: Target,
  HeartHandshake: HeartHandshake, // Fixed: Using actual HeartHandshake icon
  TrendingUp: TrendingUp, // Fixed: Using actual TrendingUp icon
};

// Get icon component from name with proper typing
const getIconComponent = (iconName: string): React.JSX.Element => {
  const IconComponent = iconMap[iconName] || Users;
  return <IconComponent className='w-6 h-6 text-primary' />;
};

const AboutPage = () => {
  const about = useQuery(api.about.getAbout);
  const aboutFeatures = useQuery(api.about.getAboutFeatures);
  const mission = useQuery(api.missionVision.getMission);
  const vision = useQuery(api.missionVision.getVision);
  const ourRole = useQuery(api.ourRole.getOurRoleWithImageUrl);

  // Debug: Log the features to see what icon names are actually coming from the database
  React.useEffect(() => {
    if (aboutFeatures) {
      console.log("About Features from DB:", aboutFeatures);
    }
  }, [aboutFeatures]);

  return (
    <div>
      <section id='about' className='py-24 px-4 bg-muted/30'>
        <div className='w-full max-w-6xl mx-auto'>
          {about === undefined || aboutFeatures === undefined ? (
            <AboutSectionSkeleton />
          ) : (
            <div>
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className='text-center mb-16'>
                <h2 className='text-4xl md:text-5xl font-bold mb-4'>
                  About FEDCOOP
                </h2>
                <p className='text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
                  {about.tagline && <strong>{about.tagline} </strong>}
                  {about.description}
                </p>
              </motion.div>

              {/* Features Grid */}
              <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20'>
                {aboutFeatures.map((feature, index) => (
                  <motion.div
                    key={feature._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}>
                    <Card className='h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ease-in-out bg-background/60 backdrop-blur-sm'>
                      <CardContent className='p-6 text-center'>
                        <div className='w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center'>
                          {getIconComponent(feature.iconName)}
                        </div>
                        <h3 className='font-semibold mb-2 text-lg'>
                          {feature.title}
                        </h3>
                        <p className='text-sm text-muted-foreground leading-relaxed'>
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className='grid lg:grid-cols-2 gap-12 items-center mb-24'>
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}>
              {ourRole === undefined ? (
                // Skeleton for text content
                <div className='space-y-6'>
                  <Skeleton className='h-8 w-3/4 rounded' />
                  <div className='space-y-4'>
                    <Skeleton className='h-4 w-full rounded' />
                    <Skeleton className='h-4 w-full rounded' />
                    <Skeleton className='h-4 w-5/6 rounded' />
                    <Skeleton className='h-4 w-full rounded' />
                    <Skeleton className='h-4 w-4/5 rounded' />
                    <Skeleton className='h-4 w-full rounded' />
                    <Skeleton className='h-4 w-3/4 rounded' />
                  </div>
                </div>
              ) : (
                // Actual content
                <>
                  <h3 className='text-3xl font-bold mb-6 text-foreground'>
                    {ourRole.title}
                  </h3>
                  <div className='space-y-5 text-muted-foreground leading-relaxed whitespace-pre-wrap'>
                    {ourRole.content}
                  </div>
                </>
              )}
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className='relative'>
              <div className='flex justify-center'>
                <Image
                  src='/role.svg'
                  alt='Our Role Illustration'
                  width={480}
                  height={480}
                  priority
                  className='rounded-lg object-cover'
                />
              </div>
            </motion.div>
          </div>

          {/* Mission & Vision */}
          <div className='grid sm:grid-cols-2 gap-12 items-start mb-20'>
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className='bg-background/50 backdrop-blur-sm rounded-xl shadow-sm p-8 h-full'>
              <div className='flex items-center gap-3 mb-4'>
                <Lightbulb className='w-6 h-6 text-primary' />
                <h3 className='text-2xl font-semibold'>Our Mission</h3>
              </div>
              {mission === undefined ? (
                // Mission Skeleton - Multi-line to match mission content
                <div className='space-y-3'>
                  <Skeleton className='h-5 w-full rounded' />
                  <Skeleton className='h-5 w-11/12 rounded' />
                  <Skeleton className='h-5 w-10/12 rounded' />
                  <Skeleton className='h-5 w-9/12 rounded' />
                  <Skeleton className='h-5 w-full rounded' />
                </div>
              ) : (
                <p className='text-muted-foreground leading-relaxed'>
                  {mission.body}
                </p>
              )}
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className='bg-background/50 backdrop-blur-sm rounded-xl shadow-sm p-8 h-full'>
              <div className='flex items-center gap-3 mb-4'>
                <Handshake className='w-6 h-6 text-primary' />
                <h3 className='text-2xl font-semibold'>Our Vision</h3>
              </div>
              {vision === undefined ? (
                // Vision Skeleton - Shorter for vision content
                <div className='space-y-3'>
                  <Skeleton className='h-5 w-full rounded' />
                  <Skeleton className='h-5 w-2/3 rounded' />
                  <Skeleton className='h-5 w-1/2 rounded' />
                </div>
              ) : (
                <p className='text-muted-foreground leading-relaxed'>
                  {vision.body}
                </p>
              )}
            </motion.div>
          </div>

          {/* Closing Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='text-center max-w-3xl mx-auto'>
            <h3 className='text-3xl font-bold mb-4'>
              Together, We Build Better
            </h3>
            <p className='text-muted-foreground leading-relaxed'>
              FEDCOOP believes that when workers unite under a common vision of
              cooperation, they become a powerful force for national growth.
              Through shared knowledge, financial solidarity, and mutual
              respect, we continue to build a future where every cooperative
              society thrives — and every member prospers.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Skeleton loader for the about section
const AboutSectionSkeleton = () => {
  return (
    <div className='space-y-16'>
      {/* About Header Skeleton */}
      <div className='text-center mb-16'>
        <h2 className='text-4xl md:text-5xl font-bold mb-6'>About FEDCOOP</h2>
        <Skeleton className='h-6 w-3/4 mx-auto mb-2' />
        <Skeleton className='h-6 w-2/3 mx-auto' />
      </div>

      {/* About Features Grid Skeleton */}
      <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20'>
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className='h-full'>
            <CardContent className='p-6 text-center'>
              <Skeleton className='w-12 h-12 mx-auto mb-4 rounded-lg' />
              <Skeleton className='h-5 w-3/4 mx-auto mb-2' />
              <Skeleton className='h-4 w-full mb-1' />
              <Skeleton className='h-4 w-5/6 mx-auto' />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
