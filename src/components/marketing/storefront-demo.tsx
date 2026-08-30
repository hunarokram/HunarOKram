'use client';
import * as React from 'react';
import { Palette, MousePointerClick, Check, ArrowRight, CalendarDays, MapPin, ArrowDown } from 'lucide-react';
import { cn } from '@/utils/cn';

const THEMES = [
  { 
    id: 'terracotta', 
    name: 'Terracotta', 
    bubbleColor: 'bg-[#faf9f7] border border-[#d45f2a]',
    colors: {
      bg: 'bg-white',
      surface: 'bg-[#fdf8f5]',
      primaryBg: 'bg-[#d45f2a]',
      primaryHover: 'hover:bg-[#b04a1e]',
      primaryText: 'text-[#d45f2a]',
      primaryRing: 'ring-[#d45f2a]',
      textDark: 'text-[#1a1a1a]',
      textMuted: 'text-[#8c8580]',
      border: 'border-[#efe6df]',
      shadow: 'shadow-[#d45f2a]/20'
    }
  },
  { 
    id: 'midnight', 
    name: 'Midnight', 
    bubbleColor: 'bg-[#1a1a1a]',
    colors: {
      bg: 'bg-[#0a0a0a]',
      surface: 'bg-[#141414]',
      primaryBg: 'bg-[#facc15]',
      primaryHover: 'hover:bg-[#eab308]',
      primaryText: 'text-[#facc15]',
      primaryRing: 'ring-[#facc15]',
      textDark: 'text-white',
      textMuted: 'text-[#a3a3a3]',
      border: 'border-[#262626]',
      shadow: 'shadow-yellow-500/10'
    }
  },
  { 
    id: 'sage', 
    name: 'Sage Green', 
    bubbleColor: 'bg-[#4a5d4e]',
    colors: {
      bg: 'bg-[#f4f6f4]',
      surface: 'bg-[#ffffff]',
      primaryBg: 'bg-[#4a5d4e]',
      primaryHover: 'hover:bg-[#38473b]',
      primaryText: 'text-[#4a5d4e]',
      primaryRing: 'ring-[#4a5d4e]',
      textDark: 'text-[#1c221e]',
      textMuted: 'text-[#7a8a7e]',
      border: 'border-[#e0e5e1]',
      shadow: 'shadow-[#4a5d4e]/20'
    }
  },
  { 
    id: 'blush', 
    name: 'Soft Blush', 
    bubbleColor: 'bg-[#e11d48]',
    colors: {
      bg: 'bg-[#fff5f5]',
      surface: 'bg-white',
      primaryBg: 'bg-[#e11d48]',
      primaryHover: 'hover:bg-[#be123c]',
      primaryText: 'text-[#e11d48]',
      primaryRing: 'ring-[#e11d48]',
      textDark: 'text-[#4c0519]',
      textMuted: 'text-[#9f1239]/60',
      border: 'border-[#ffe4e6]',
      shadow: 'shadow-rose-500/20'
    }
  },
  { 
    id: 'coastal', 
    name: 'Coastal Blue', 
    bubbleColor: 'bg-[#0ea5e9]',
    colors: {
      bg: 'bg-[#f8fafc]',
      surface: 'bg-white',
      primaryBg: 'bg-[#0ea5e9]',
      primaryHover: 'hover:bg-[#0284c7]',
      primaryText: 'text-[#0ea5e9]',
      primaryRing: 'ring-[#0ea5e9]',
      textDark: 'text-[#0f172a]',
      textMuted: 'text-[#64748b]',
      border: 'border-[#e2e8f0]',
      shadow: 'shadow-sky-500/20'
    }
  }
];

export function StorefrontDemo() {
  const [activeThemeId, setActiveThemeId] = React.useState('terracotta');
  const activeTheme = THEMES.find(t => t.id === activeThemeId) || THEMES[0];
  const c = activeTheme.colors;

  return (
    <section className="py-24 md:py-32 bg-white border-y border-[#f0ebe1]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          
          {/* Text Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-6 leading-tight">
              A storefront that feels entirely yours.
            </h2>
            <p className="text-[#6b6b6b] text-lg mb-10 leading-relaxed">
              Your craft deserves a beautiful canvas. Choose from bespoke, high-converting themes to create a seamless booking experience that perfectly matches your brand. No coding required.
            </p>
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-[#faf9f7] rounded-full flex items-center justify-center shrink-0 border border-[#f0ebe1] shadow-sm">
                  <Palette className="w-5 h-5 text-[#d45f2a]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-[#1a1a1a] text-lg mb-2">Curated Themes</h4>
                  <p className="text-[#6b6b6b] text-sm leading-relaxed">One-click themes designed specifically for creators, artists, and workshops. Try it out on the interactive demo.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-[#faf9f7] rounded-full flex items-center justify-center shrink-0 border border-[#f0ebe1] shadow-sm">
                  <MousePointerClick className="w-5 h-5 text-[#d45f2a]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-[#1a1a1a] text-lg mb-2">Frictionless Booking</h4>
                  <p className="text-[#6b6b6b] text-sm leading-relaxed">A buttery smooth checkout flow that converts casual visitors into paying attendees instantly, right from your page.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Visual Mockup */}
          <div className="relative rounded-3xl bg-[#fdf8f5] p-6 md:p-12 border border-[#efe6df] shadow-2xl overflow-hidden">
            
            {/* Theme Selector Floating UI */}
            <div className="absolute top-8 right-4 md:right-8 z-20 bg-white rounded-2xl p-4 shadow-xl border border-[#efe6df] w-48">
                <p className="text-xs font-bold text-[#1a1a1a] mb-3 uppercase tracking-wider flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d45f2a] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d45f2a]"></span>
                  </span>
                  Live Demo
                </p>
                <div className="space-y-3">
                  {THEMES.map((theme) => {
                    const isActive = theme.id === activeThemeId;
                    return (
                      <div 
                        key={theme.id}
                        onClick={() => setActiveThemeId(theme.id)}
                        className={cn(
                          "flex items-center gap-3 cursor-pointer p-1 -ml-1 rounded-lg transition-all",
                          isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center transition-all",
                          theme.bubbleColor,
                          isActive ? cn("ring-2 ring-offset-1", theme.colors.primaryRing) : ""
                        )}>
                        </div>
                        <span className="text-sm text-[#1a1a1a] font-semibold">{theme.name}</span>
                      </div>
                    );
                  })}
                </div>
            </div>

            {/* Booking Page Mockup (Dynamic based on theme) */}
            <div className={cn(
              "relative z-10 w-full h-[400px] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border overflow-hidden -rotate-2 hover:rotate-0 transition-all duration-700",
              c.bg, c.border
            )}>
              {/* Mini Top Nav */}
              <div className={cn("h-8 border-b flex items-center px-4 transition-colors duration-500", c.border, c.surface)}>
                <div className={cn("flex items-center gap-1.5 font-medium text-[10px] transition-colors duration-500", c.textDark)}>
                  <div className={cn("w-3 h-3 rounded-full flex items-center justify-center transition-colors duration-500", c.textMuted)}>
                    <ArrowRight className="w-2 h-2 rotate-180" />
                  </div>
                  HunarOKram Studios
                </div>
              </div>

              {/* Mini Content Area */}
              <div className="p-4 grid grid-cols-12 gap-4 h-[calc(100%-32px)] overflow-hidden">
                
                {/* Left Column */}
                <div className="col-span-7 space-y-4">
                  {/* Image Gallery Mock */}
                  <div className="h-32 w-full rounded-lg overflow-hidden relative">
                    <img src="/event1.jpg" alt="Cover" className="w-full h-full object-cover transition-transform duration-1000 scale-105" />
                  </div>
                  
                  {/* Host Info */}
                  <div className="flex items-center gap-2">
                    <div className={cn("w-6 h-6 rounded-full overflow-hidden border", c.border)}>
                      <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className={cn("text-[9px] font-semibold transition-colors duration-500", c.textDark)}>HunarOKram Studios</p>
                      <p className={cn("text-[7px] transition-colors duration-500", c.textMuted)}>Verified Host</p>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={cn("font-serif font-bold text-base leading-tight transition-colors duration-500", c.textDark)}>
                    Artisan Pottery Masterclass
                  </h3>

                  {/* Meta Pills */}
                  <div className="flex gap-2">
                    <div className={cn("px-2 py-1 rounded-full border text-[7px] flex items-center gap-1 transition-colors duration-500", c.surface, c.border, c.textMuted)}>
                      <CalendarDays className="w-2 h-2" /> 120m
                    </div>
                    <div className={cn("px-2 py-1 rounded-full border text-[7px] flex items-center gap-1 transition-colors duration-500", c.surface, c.border, c.textMuted)}>
                      <MapPin className="w-2 h-2" /> In-person
                    </div>
                  </div>
                  
                  {/* Description lines */}
                  <div className="space-y-1.5 pt-2">
                    <div className={cn("w-full h-1.5 rounded transition-colors duration-500 opacity-20", c.textMuted)} />
                    <div className={cn("w-11/12 h-1.5 rounded transition-colors duration-500 opacity-20", c.textMuted)} />
                    <div className={cn("w-4/5 h-1.5 rounded transition-colors duration-500 opacity-20", c.textMuted)} />
                  </div>
                </div>

                {/* Right Column (Booking Card) */}
                <div className="col-span-5">
                  <div className={cn("rounded-xl border shadow-sm overflow-hidden flex flex-col transition-colors duration-500", c.surface, c.border)}>
                    {/* Price Header */}
                    <div className={cn("p-3 border-b transition-colors duration-500", c.border)}>
                      <p className={cn("text-lg font-bold font-serif transition-colors duration-500", c.textDark)}>₹1,999</p>
                      <p className={cn("text-[7px] transition-colors duration-500", c.textMuted)}>per person</p>
                    </div>
                    
                    {/* Form area */}
                    <div className="p-3 space-y-3">
                      {/* Date Select Mock */}
                      <div className="space-y-1">
                        <p className={cn("text-[7px] font-semibold transition-colors duration-500", c.textDark)}>Select Date</p>
                        <div className={cn("w-full py-1.5 px-2 rounded border text-[8px] flex justify-between items-center transition-colors duration-500", c.bg, c.border, c.textDark)}>
                          <span>Sat, 24 Oct • 4:00 PM</span>
                          <ArrowDown className="w-2 h-2" />
                        </div>
                      </div>

                      {/* Guests Mock */}
                      <div className="space-y-1">
                        <p className={cn("text-[7px] font-semibold transition-colors duration-500", c.textDark)}>Tickets</p>
                        <div className={cn("w-full py-1 px-2 rounded border text-[8px] flex justify-between items-center transition-colors duration-500", c.bg, c.border, c.textDark)}>
                          <span className={cn("opacity-50", c.textMuted)}>-</span>
                          <span>1</span>
                          <span className={cn("opacity-50", c.textMuted)}>+</span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center pt-1">
                        <span className={cn("text-[8px] font-semibold transition-colors duration-500", c.textDark)}>Total</span>
                        <span className={cn("text-[9px] font-bold transition-colors duration-500", c.textDark)}>₹1,999</span>
                      </div>

                      {/* Button */}
                      <button className={cn(
                        "w-full text-white rounded py-2 font-semibold text-[9px] transition-all shadow-md mt-1", 
                        c.primaryBg, c.primaryHover, c.shadow,
                        activeThemeId === 'midnight' ? 'text-black' : 'text-white'
                      )}>
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
