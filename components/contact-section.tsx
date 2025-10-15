"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Clock, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [primaryCooperative, setPrimaryCooperative] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!name.trim() || name.trim().length < 2) {
      toast.error("Please enter your full name (at least 2 characters)");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!primaryCooperative.trim() || primaryCooperative.trim().length < 2) {
      toast.error(
        "Please enter your Primary Co-operative name (at least 2 characters)"
      );
      return;
    }

    if (!subject.trim() || subject.trim().length < 3) {
      toast.error("Please enter a subject (at least 3 characters)");
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      toast.error("Please enter a message (at least 10 characters)");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          primaryCooperative: primaryCooperative.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast.success("Message sent successfully!", {
        description: "We'll get back to you as soon as possible.",
      });

      // Reset form
      setName("");
      setEmail("");
      setPrimaryCooperative("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again or contact us directly via email.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
      details: ["+234 (0) 916 248 4000"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["email@fedcoop.org"],
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Monday - Friday: 8:00 AM - 4:00 PM"],
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
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>
                      Full Name <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='name'
                      placeholder='Enter your full name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='email'>
                      Email <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='Enter your email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='primaryCooperative'>
                      Primary Co-operative{" "}
                      <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='primaryCooperative'
                      placeholder='Enter your primary co-operative name'
                      value={primaryCooperative}
                      onChange={(e) => setPrimaryCooperative(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='subject'>
                      Subject <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='subject'
                      placeholder='What is this about?'
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='message'>
                      Message <span className='text-destructive'>*</span>
                    </Label>
                    <Textarea
                      id='message'
                      placeholder='Tell us how we can help you...'
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type='submit'
                    className='w-full'
                    size='lg'
                    disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className='w-4 h-4 mr-2' />
                        Send Message
                      </>
                    )}
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
