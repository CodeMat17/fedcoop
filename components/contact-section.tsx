"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";

export function ContactSection() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Headquarters",
      details: [
        "Federal Secretariat Complex",
        "Phase 1, Abuja, FCT",
        "Nigeria",
      ],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+234 (0) 123 456 7890", "+234 (0) 987 654 3210"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@fedcoop.ng", "support@fedcoop.ng"],
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: [
        "Monday - Friday: 8:00 AM - 5:00 PM",
        "Saturday: 9:00 AM - 1:00 PM",
      ],
    },
  ];

  return (
    <section
      id='contact'
      className='py-24 bg-gradient-to-br from-background via-muted/20 to-background'>
      <div className='px-4 w-full max-w-6xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold mb-6'>Get in Touch</h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Ready to join our federation or have questions about our cooperative
            initiatives? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='space-y-8'>
            <div>
              <h3 className='text-2xl font-bold mb-6'>Contact Information</h3>
              <div className='grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4'>
                {contactInfo.map((info) => (
                  <Card
                    key={info.title}
                    className='hover:shadow-lg transition-shadow'>
                    <CardContent className='p-6'>
                      <div className='space-y-1'>
                        <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0'>
                          <info.icon className='w-6 h-6 text-primary' />
                        </div>
                        <div>
                          <h4 className='font-semibold mb-2'>{info.title}</h4>
                          {info.details.map((detail, idx) => (
                            <p
                              key={idx}
                              className='text-sm text-muted-foreground'>
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className='text-xl font-bold mb-4'>Quick Actions</h3>
              <div className='flex flex-wrap gap-3'>
                <Button className='w-auto justify-start' variant='outline'>
                  <Mail className='w-4 h-4' />
                  Send us an Email
                </Button>
                <Button className='w-auto justify-start' variant='outline'>
                  <Phone className='w-4 h-4' />
                  Call Us Now
                </Button>
                <Button className='w-auto justify-start' variant='outline'>
                  <MapPin className='w-4 h-4' />
                  Visit Our Office
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}>
            <Card className='shadow-xl'>
              <CardContent className='p-8'>
                <h3 className='text-2xl font-bold mb-6'>Send us a Message</h3>
                <form className='space-y-4'>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='firstName'>Full Name</Label>
                      <Input
                        id='firstName'
                        placeholder='Enter your first name'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='Enter your email'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='organization'>
                      Organization
                    </Label>
                    <Input
                      id='organization'
                      placeholder='Your organization name'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='subject'>Subject</Label>
                    <Input id='subject' placeholder='What is this about?' />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='message'>Message</Label>
                    <Textarea
                      id='message'
                      placeholder='Tell us how we can help you...'
                      rows={6}
                    />
                  </div>

                  <Button className='w-full' size='lg'>
                    <Send className='w-4 h-4 mr-2' />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

      
      </div>
    </section>
  );
}
