"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Building2, Shield, Target, Users } from "lucide-react";
import Image from "next/image";

export function AboutSection() {
  const features = [
    {
      icon: Building2,
      title: "Secondary Society",
      description:
        "The umbrella body of all Staff Cooperative Societies in Federal Government MDAs",
    },
    {
      icon: Users,
      title: "Worker-Owned",
      description:
        "These Staff Cooperative Societies are owned by the workers themselves",
    },
    {
      icon: Target,
      title: "Economic Development",
      description:
        "Contributing immensely to Nigeria's economic development through their activities",
    },
    {
      icon: Shield,
      title: "Strong Capital Base",
      description:
        "Individual cooperatives have capital bases up to billions of naira",
    },
  ];

  return (
    <section id='about' className='py-24 px-4 bg-muted/30'>
      <div className='w-full max-w-6xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-16'>
          <Badge variant='outline' className='mb-4'>
            <Building2 className='w-4 h-4 mr-2' />
            About FedCoop
          </Badge>
          <h2 className='text-4xl md:text-5xl font-bold mb-6'>
            Building a Cooperative Nigeria
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            FedCoop is a Secondary Society, the umbrella body of all Staff
            Cooperative Societies in Federal Government Ministries, Departments
            and Agencies (MDAs).
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}>
              <Card className='h-full hover:shadow-lg transition-shadow'>
                <CardContent className='p-6 text-center'>
                  <div className='w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center'>
                    <feature.icon className='w-6 h-6 text-primary' />
                  </div>
                  <h3 className='font-semibold mb-2'>{feature.title}</h3>
                  <p className='text-sm text-muted-foreground'>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className='grid lg:grid-cols-2 gap-12 items-center mb-16'>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}>
            <h3 className='text-3xl font-bold mb-6'>
              Our Role in Nigeria&apos;s Development
            </h3>
            <div className='space-y-4 text-muted-foreground'>
              <p>
                FedCoop serves as the central coordinating body, ensuring that
                all member cooperatives operate with transparency,
                accountability, and in alignment with cooperative principles and
                values.
              </p>
              <p>
                Through our unified approach, we foster collaboration, knowledge
                sharing, and collective investment opportunities that benefit
                all members and contribute to Nigeria&apos;s sustainable
                economic growth.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='relative'>
            {/* Illustration */}
            <div className="flex justify-center">
              <Image src='/connected.svg' alt='Development' width={300} height={300} 
              />
          
            
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
