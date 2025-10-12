"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Target, TrendingUp } from "lucide-react";

export function KeyAchievements() {
  const achievements = [
    {
      title: "Largest Cooperative Federation",
      description:
        "Nigeria's premier federation of federal government staff cooperatives",
    },
    {
      title: "Economic Development Driver",
      description:
        "Contributing significantly to Nigeria's economic growth and stability",
    },
    {
      title: "Worker Empowerment",
      description:
        "Empowering federal government workers through cooperative ownership",
    },
    {
      title: "Financial Inclusion",
      description:
        "Promoting financial inclusion and cooperative banking across Nigeria",
    },
  ];

  return (
    <section
      id='impact'
      className='py-24 bg-gradient-to-br from-primary/5 via-background to-primary/5'>
      <div className='px-4 w-full max-w-6xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold mb-6'>
            Key Achievements
          </h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Discover the remarkable milestones and accomplishments that showcase
            FedCoop&apos;s commitment to empowering federal government staff
            through cooperative excellence and sustainable economic growth.
          </p>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}>
                <Card className='h-full hover:shadow-lg transition-shadow'>
                  <CardContent className='p-6'>
                    <div className=' space-y-2'>
                      <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0'>
                        <Target className='w-6 h-6 text-primary' />
                      </div>
                      <div>
                        <h4 className='font-semibold mb-2'>
                          {achievement.title}
                        </h4>
                        <p className='text-muted-foreground'>
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Impact Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='mt-16'>
          <Card className='overflow-hidden'>
            <CardContent className='p-0'>
              <div className='grid md:grid-cols-2'>
                <div className='p-8 md:p-12'>
                  <h3 className='text-2xl font-bold mb-6'>
                    Economic Impact Visualization
                  </h3>
                  <div className='space-y-6'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>
                        Direct Economic Contribution
                      </span>
                      <span className='text-lg font-bold text-primary'>
                        ₦50B+
                      </span>
                    </div>
                    <div className='w-full bg-muted rounded-full h-3'>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "85%" }}
                        transition={{ duration: 2 }}
                        viewport={{ once: true }}
                        className='h-3 bg-primary rounded-full'
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>
                        Financial Inclusion Impact
                      </span>
                      <span className='text-lg font-bold text-green-600'>
                        500K+
                      </span>
                    </div>
                    <div className='w-full bg-muted rounded-full h-3'>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "75%" }}
                        transition={{ duration: 2, delay: 0.5 }}
                        viewport={{ once: true }}
                        className='h-3 bg-green-600 rounded-full'
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>
                        Employment Support
                      </span>
                      <span className='text-lg font-bold text-blue-600'>
                        50+
                      </span>
                    </div>
                    <div className='w-full bg-muted rounded-full h-3'>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "90%" }}
                        transition={{ duration: 2, delay: 1 }}
                        viewport={{ once: true }}
                        className='h-3 bg-blue-600 rounded-full'
                      />
                    </div>
                  </div>
                </div>

                <div className='bg-muted/30 p-8 md:p-12 flex items-center justify-center'>
                  <div className='text-center'>
                    <div className='w-32 h-32 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center'>
                      <TrendingUp className='w-16 h-16 text-primary' />
                    </div>
                    <h4 className='text-xl font-bold mb-2'>Growing Together</h4>
                    <p className='text-muted-foreground'>
                      FedCoop&apos;s member cooperatives continue to grow,
                      creating sustainable economic impact across Nigeria.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
