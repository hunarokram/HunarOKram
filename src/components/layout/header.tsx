'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Compass, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = transparent && !scrolled && !mobileMenuOpen;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isTransparent 
          ? 'bg-transparent py-6' 
          : 'bg-white/80 backdrop-blur-md border-b border-warm-200 py-4 shadow-sm'
      )}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-brand-600 relative z-50">
          <img src="/logo.jpg" alt="HunarOKram Logo" className="w-8 h-8 object-contain" />
          <span className={cn(
            "text-2xl font-display font-bold",
            isTransparent ? "text-white" : "text-warm-900"
          )}>
            HunarOKram
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'Pricing', 'Creators', 'Stories'].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className={cn(
                "text-sm font-medium transition-colors",
                isTransparent ? "text-white/90 hover:text-white" : "text-warm-600 hover:text-brand-600"
              )}
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className={cn(
              "text-sm font-medium transition-colors",
              isTransparent ? "text-white hover:text-white/80" : "text-warm-700 hover:text-warm-900"
            )}
          >
            Log In
          </Link>
          <Button variant={isTransparent ? "secondary" : "primary"} size="sm" className="rounded-full px-6">
            Start Free
          </Button>
        </div>

        <button
          className={cn(
            "md:hidden relative z-50 p-2 -mr-2",
            isTransparent && !mobileMenuOpen ? "text-white" : "text-warm-900"
          )}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden flex flex-col">
            <nav className="flex flex-col gap-6 text-lg font-medium text-warm-900 mb-8">
              {['Features', 'Pricing', 'Creators', 'Stories'].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-warm-100 pb-4"
                >
                  {item}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-4 mt-auto mb-12">
              <Button variant="outline" className="w-full" size="lg">Log In</Button>
              <Button className="w-full" size="lg">Start Free</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
