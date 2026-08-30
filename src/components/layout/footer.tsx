import * as React from 'react';
import Link from 'next/link';
import { Compass, Globe, ExternalLink, Mail, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface FooterProps {
  variant?: 'light' | 'dark';
}

export function Footer({ variant = 'light' }: FooterProps) {
  const isDark = variant === 'dark';
  
  return (
    <footer className={cn(
      "border-t pt-20 pb-10",
      isDark ? "bg-warm-900 text-warm-100 border-warm-800" : "bg-white text-warm-900 border-warm-200"
    )}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className={cn("flex items-center gap-2", isDark ? "text-brand-400" : "text-brand-600")}>
              <img src="/logo.jpg" alt="HunarOKram Logo" className="w-8 h-8 object-contain" />
              <span className="text-2xl font-display font-bold">HunarOKram</span>
            </Link>
            <p className={cn("max-w-xs text-sm leading-relaxed", isDark ? "text-warm-400" : "text-warm-500")}>
              The premium, all-in-one platform for creators, studios, and instructors to organize and sell workshops, classes, and experiences.
            </p>
            <div className="flex items-center gap-4">
              {[Globe, ExternalLink, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    isDark ? "bg-warm-800 hover:bg-warm-700 text-warm-300" : "bg-warm-100 hover:bg-warm-200 text-warm-600"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Product</h4>
            <ul className="space-y-4 text-sm">
              {['Features', 'Pricing', 'Integrations', 'Changelog'].map((item) => (
                <li key={item}>
                  <Link href="#" className={cn("transition-colors", isDark ? "text-warm-400 hover:text-white" : "text-warm-600 hover:text-brand-600")}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm">
              {['Help Center', 'Creator Guides', 'Blog', 'Community'].map((item) => (
                <li key={item}>
                  <Link href="#" className={cn("transition-colors", isDark ? "text-warm-400 hover:text-white" : "text-warm-600 hover:text-brand-600")}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              {[
                { name: 'About', href: '/about' },
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={cn("transition-colors", isDark ? "text-warm-400 hover:text-white" : "text-warm-600 hover:text-brand-600")}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={cn(
          "flex flex-col md:flex-row items-center justify-between pt-8 border-t",
          isDark ? "border-warm-800" : "border-warm-200"
        )}>
          <p className={cn("text-sm mb-4 md:mb-0", isDark ? "text-warm-500" : "text-warm-500")}>
            &copy; {new Date().getFullYear()} HunarOKram. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-500 text-white">
              ₹
            </span>
            <span>Made in India for the World</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
