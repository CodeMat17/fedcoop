"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Building2,
  Shield,
  Target,
  Users,
  Lightbulb,
  Handshake,
} from "lucide-react";
import Image from "next/image";

const AboutPage = () => {
  const features = [
    {
      icon: Building2,
      title: "Secondary Society",
      description:
        "FedCoop stands as the apex cooperative institution for all Staff Cooperative Societies in Federal Government Ministries, Departments, and Agencies (MDAs) across Nigeria.",
    },
    {
      icon: Users,
      title: "Worker-Owned",
      description:
        "Our member cooperatives are owned, governed, and driven by their members, the workforce of the Nigerian federal system, ensuring inclusion and transparency.",
    },
    {
      icon: Target,
      title: "Economic Development",
      description:
        "Through cooperative financing, entrepreneurship, and mutual support, FedCoop significantly contributes to the economic empowerment of Nigerian workers and communities.",
    },
    {
      icon: Shield,
      title: "Strong Capital Base",
      description:
        "Member societies collectively hold assets and capital worth billions of naira, driving sustainable development and fostering financial independence.",
    },
  ];

  return (
    <div>
      <section id='about' className='py-24 px-4 bg-muted/30'>
        <div className='w-full max-w-6xl mx-auto'>
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6'>
              About FEDCOOP
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
              The{" "}
              <strong>
                Federation of Federal Government Staff Cooperative Societies
                (FedCoop)
              </strong>
              is a secondary cooperative body that unites all Staff Cooperative
              Societies operating within Federal Government Ministries and MDAs.
              We promote collaboration, accountability, and sustainable
              development through the cooperative spirit of mutual benefit.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}>
                <Card className='h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ease-in-out bg-background/60 backdrop-blur-sm'>
                  <CardContent className='p-6 text-center'>
                    <div className='w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center'>
                      <feature.icon className='w-6 h-6 text-primary' />
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

          {/* Main Content */}
          <div className='grid lg:grid-cols-2 gap-12 items-center mb-24'>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}>
              <h3 className='text-3xl font-bold mb-6 text-foreground'>
                Our Role in Nigeria&apos;s Development
              </h3>
              <div className='space-y-5 text-muted-foreground leading-relaxed'>
                <p>
                  FedCoop plays a pivotal role in shaping the cooperative
                  landscape in Nigeria. We serve as the{" "}
                  <strong>central coordinating body</strong> that advocates for
                  policy reforms, ensures operational transparency, and builds
                  capacity among member societies through training and digital
                  transformation initiatives.
                </p>
                <p>
                  We also facilitate partnerships between government agencies,
                  private sector stakeholders, and cooperative institutions —
                  creating an enabling environment for innovation, inclusive
                  growth, and socio-economic resilience.
                </p>
                <p>
                  By strengthening the financial and managerial capacity of
                  cooperatives, FedCoop contributes to wealth creation,
                  employment generation, and the overall stability of the
                  Nigerian economy.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className='relative'>
              <div className='flex justify-center'>
                <Image
                  src='/connected.svg'
                  alt="Nigeria's Cooperative Development"
                  width={380}
                  height={380}
                  priority
                />
              </div>
            </motion.div>
          </div>

          {/* Mission & Vision */}
          <div className='grid sm:grid-cols-2 gap-12 items-start mb-20'>
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
              <p className='text-muted-foreground leading-relaxed'>
                To unify Workers Cooperatives for a Better World through
                Cooperation, Collaboration, Advocacy, Peer Review, Training, Savings and
                Investments.
              </p>
            </motion.div>

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
              <p className='text-muted-foreground leading-relaxed'>
                A Cooperative Nigeria without Hunger & Poverty.
              </p>
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
              FedCoop believes that when workers unite under a common vision of
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

export default AboutPage;
