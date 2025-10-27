"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "About FEDCOOP", href: "/about-fedcoop" },
    { name: "Member Cooperatives", href: "/members" },
    { name: "Recent Events", href: "/events" },
    { name: "Board of Directors", href: "/directors" },
    { name: "Contact Us", href: "/contact" },
  ];

  // const memberCooperatives = [
  //   { name: "NFVCB Cooperative", href: "#" },
  //   { name: "NNPC Cooperative", href: "#" },
  //   { name: "CBN Cooperative", href: "#" },
  //   { name: "EFCC Cooperative", href: "#" },
  //   { name: "FMD Cooperative", href: "#" },
  //   { name: "FMAFS Cooperative", href: "#" },
  //   { name: "See All Cooperative", href: "/members" },
  // ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://www.facebook.com/groups/530898437955565",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://x.com/FEDCOOP_ng",
    },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/fedcoop_ng/" },
  ];

  return (
    <footer className='bg-background border-t'>
      <div className='container'>
        {/* Main Footer Content */}
        <div className='py-16'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* Company Info */}
            <div className='space-y-6'>
              <div className='flex items-center space-x-3'>
                <Image src='/logo.webp' alt='FedCoop' width={52} height={52} />

                <div>
                  <h3 className='text-xl font-bold'>FEDCOOP</h3>
                  <p className='text-sm text-muted-foreground'>
                    Federation of Federal Government Staff Cooperatives
                  </p>
                </div>
              </div>

              <p className='text-sm text-muted-foreground'>
                Unifying Workers Cooperatives for a Better World through
                Cooperation, Collaboration, Advocacy, Peer Review, Training and
                Investment.
              </p>

              <div className='flex space-x-4'>
                {socialLinks.map((social) => (
                  <Button
                    key={social.name}
                    variant='outline'
                    size='sm'
                    className='w-10 h-10 p-0'
                    asChild>
                    <a
                      href={social.href}
                      aria-label={social.name}
                      target='_blank'
                      rel='noreferrer'>
                      <social.icon className='h-4 w-4' />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className='flex flex-col items-start md:items-center'>
              <div className='space-y-6'>
                <h4 className='text-lg font-semibold'>Quick Links</h4>
                <ul className='space-y-3'>
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className='text-sm text-muted-foreground hover:text-primary transition-colors'>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Member Cooperatives */}
            {/* <div className='space-y-6'>
              <h4 className='text-lg font-semibold'>Member Cooperatives</h4>
              <ul className='space-y-3'>
                {memberCooperatives.map((coop) => (
                  <li key={coop.name}>
                    <a
                      href={coop.href}
                      className='text-sm text-muted-foreground hover:text-primary transition-colors'>
                      {coop.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Resources & Contact */}
            <div className='flex flex-col items-start md:items-center'>
              {/* Contact Info */}
              <div className='space-y-4'>
                <h4 className='text-lg font-semibold'>Contact Information</h4>
                <div className='space-y-3'>
                  <div className='flex items-start space-x-3'>
                    <MapPin className='h-4 w-4 mt-0.5 text-muted-foreground' />
                    <div className='text-sm text-muted-foreground'>
                      <div>Federal Secretariat Complex</div>
                      <div>Phase 1, Abuja, FCT</div>
                      <div>Nigeria</div>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <Phone className='h-4 w-4 text-muted-foreground' />
                    <a
                      href='tel:+2341234567890'
                      className='text-sm text-muted-foreground hover:text-primary transition-colors'>
                      +234 (0) 916 248 4000
                    </a>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <Mail className='h-4 w-4 text-muted-foreground' />
                    <a
                      href='mailto:info@fedcoop.ng'
                      className='text-sm text-muted-foreground hover:text-primary transition-colors'>
                      email@fedcoop.org
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className='py-8 flex flex-col items-center md:flex-row md:justify-between gap-4'>
          <div className='text-sm text-center text-muted-foreground'>
            © {currentYear} FedCoop - Federation of Federal Government Staff
            Cooperatives. All rights reserved.
          </div>
          <Link
            href='/admin'
            className='text-muted-foreground text-sm font-medium'>
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
