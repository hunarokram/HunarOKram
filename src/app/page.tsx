import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowDown, Sparkles, CheckCircle2, Banknote, CalendarDays, Ticket, Users, Palette, MousePointerClick } from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import { StorefrontDemo } from '@/components/marketing/storefront-demo';

export default function LandingPage() {
  return (
    <div className="bg-[#faf9f7] min-h-screen font-sans selection:bg-[#d45f2a] selection:text-white">
      <main>
        {/* I. The Immersive Prologue */}
        <section 
          className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden px-6 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
        >
          {/* Subtle overlay to ensure text readability */}
          <div className="absolute inset-0 bg-[#faf9f7]/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f7] via-transparent to-transparent" />
          
          <div className="z-10 text-center max-w-4xl mx-auto space-y-8 flex flex-col items-center mt-12">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-[#1a1a1a] tracking-tight leading-[0.9]">
              Your craft. <br className="hidden md:block" />
              <span className="italic text-[#d45f2a]">Your stage.</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-[#6b6b6b] max-w-2xl mx-auto font-light leading-relaxed">
              The minimalist canvas for creators to host experiences, manage bookings, and own their audience.
            </p>

            <div className="pt-8 w-full max-w-md mx-auto">
              <form action="/register" method="GET" className="relative flex items-center bg-white rounded-full p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e5e5e5] hover:border-[#d45f2a] transition-colors group">
                <span className="pl-4 text-sm font-medium text-[#a3a3a3]">hunarokram.vercel.app/</span>
                <input 
                  type="text" 
                  name="slug"
                  placeholder="yourname"
                  className="flex-1 bg-transparent border-none outline-none text-sm font-semibold text-[#1a1a1a] placeholder:text-[#d4d4d4] px-1 min-w-0 focus:ring-0"
                />
                <button type="submit" className="bg-[#1a1a1a] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#d45f2a] transition-colors flex items-center gap-2 group-hover:shadow-lg">
                  Begin <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-[#a3a3a3]">
            <ArrowDown className="w-6 h-6" />
          </div>
        </section>

        {/* II. The Revelation (Sticky Scroll Layout) */}
        <section className="relative px-6 py-24 md:py-32 bg-white border-t border-[#f0ebe1]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
              
              {/* Left Side: Sticky Copy */}
              <div className="lg:col-span-5 relative">
                <div className="lg:sticky lg:top-40 space-y-6">
                  <h2 className="text-4xl md:text-6xl font-serif text-[#1a1a1a] leading-tight">
                    One link. <br />
                    <span className="text-[#a3a3a3]">Infinite experiences.</span>
                  </h2>
                  <p className="text-[#6b6b6b] text-lg font-light leading-relaxed">
                    Stop wrestling with generic calendar links and clunky forms. Give your audience a premium, bespoke booking experience that feels like an extension of your craft.
                  </p>
                  <ul className="space-y-4 pt-6">
                    {['Zero friction checkout', 'Instant Razorpay & UPI payouts', 'Automated E-Tickets & Reminders'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-[#404040]">
                        <div className="w-6 h-6 rounded-full bg-[#fdfbf9] border border-[#f0ebe1] flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#d45f2a]" />
                        </div>
                        <span className="font-medium text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Side: Scrolling Mockups */}
              <div className="lg:col-span-7 space-y-24">
                {/* Illustration 1: Booking Experience */}
                <div className="group relative rounded-[2rem] bg-white p-4 md:p-6 border border-[#f0ebe1] shadow-2xl overflow-hidden transition-transform duration-700 hover:-translate-y-2">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#d45f2a] opacity-5 blur-[100px] rounded-full" />
                  <div className="relative">
                    <span className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-sm font-semibold text-[#d45f2a] shadow-lg z-10">
                      <Sparkles className="w-4 h-4" /> Bespoke Booking Experience
                    </span>
                    <div className="rounded-xl overflow-hidden aspect-[4/3] bg-[#f0ebe1] relative">
                      <img src="/illust1.jpg" alt="Premium Booking Experience Illustration" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    </div>
                  </div>
                </div>

                {/* Illustration 2: Automation & Payouts */}
                <div className="group relative rounded-[2rem] bg-white p-4 md:p-6 border border-[#e2e8f0] shadow-2xl overflow-hidden transition-transform duration-700 hover:-translate-y-2">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#3b82f6] opacity-5 blur-[100px] rounded-full" />
                  <div className="relative">
                    <span className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-sm font-semibold text-[#3b82f6] shadow-lg z-10">
                      <Sparkles className="w-4 h-4" /> Automated Flow & Payouts
                    </span>
                    <div className="rounded-xl overflow-hidden aspect-[4/3] bg-[#f0ebe1] relative">
                      <img src="/illust2.jpg" alt="Automated E-tickets and Payouts Illustration" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* III. The Connected Ecosystem (Features) - Circular Layout */}
        <section className="py-24 md:py-32 bg-[#faf9f7] overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Section Heading */}
            <div className="text-center mb-16 md:mb-24 relative z-10">
               <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-4">The Connected Ecosystem</h2>
               <p className="text-[#6b6b6b] font-light text-lg">Fully automated. Seamlessly connected.</p>
            </div>

            {/* Mobile View (Stacked Grid) */}
            <div className="md:hidden space-y-8">
               <div className="text-center bg-[#1a1a1a] rounded-full flex flex-col items-center justify-center text-white shadow-2xl p-10 mb-8 aspect-square max-w-[280px] mx-auto border-4 border-white">
                <p className="font-serif text-base text-[#e5e5e5] mb-1">Everything you need.</p>
                <p className="font-serif font-bold text-lg text-[#d45f2a] italic">One bespoke storefront.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Banknote, title: 'Instant Payouts', desc: 'Direct to your bank.' },
                  { icon: CalendarDays, title: 'Smart Scheduling', desc: 'Manage dates & limits.' },
                  { icon: Ticket, title: 'Auto E-Tickets', desc: 'QR codes sent instantly.' },
                  { icon: Users, title: 'Customer CRM', desc: 'Own your audience data.' },
                  { icon: Sparkles, title: 'Custom Themes', desc: 'Beautiful booking pages.' },
                  { icon: CheckCircle2, title: 'Verified Reviews', desc: 'Build trust automatically.' },
                ].map((f, i) => (
                  <div key={i} className="text-center bg-[#fdfaf8] p-5 rounded-sm border border-[#f0ebe1] shadow-sm">
                    <f.icon className="w-5 h-5 mx-auto mb-3 text-[#8b5a33]" />
                    <h4 className="text-[#1a1a1a] font-serif font-semibold text-sm mb-1">{f.title}</h4>
                    <p className="text-[#6b6b6b] text-xs leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop View (Perfect Circular Orbit - Minimalist) */}
            <div className="hidden md:flex relative w-full max-w-[650px] mx-auto aspect-square items-center justify-center">
              
              {/* Background SVG Circle */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 1000">
                <circle cx="500" cy="500" r="290" stroke="#dcb897" strokeWidth="1" fill="none" strokeDasharray="6 6" className="opacity-60" />
              </svg>

              {/* Central Hub */}
              <div className="relative z-10 bg-[#211a18] w-48 h-48 rounded-full flex flex-col items-center justify-center text-white shadow-[0_10px_40px_rgba(220,184,151,0.2)] border border-[#dcb897]/30 transition-transform duration-700 hover:scale-105 p-6 text-center ring-4 ring-[#faf9f7]">
                <p className="font-serif text-[15px] text-[#e5e5e5] mb-2 tracking-wide">Everything you need.</p>
                <p className="font-serif font-bold text-[17px] text-[#dcb897] italic leading-snug">One bespoke<br/>storefront.</p>
              </div>

              {/* 1. Top - Payouts */}
              <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-40 text-center bg-[#fdf8f5] p-5 rounded-sm border border-[#efe6df] shadow-sm transition-transform duration-500 hover:-translate-y-1">
                <Banknote className="w-4 h-4 mx-auto mb-2 text-[#b89576]" strokeWidth={1.5} />
                <h4 className="text-[#211a18] font-serif font-bold text-[14px] mb-1">Instant Payouts</h4>
                <p className="text-[#8c8580] text-[11px] leading-tight">Direct to your bank.</p>
              </div>

              {/* 2. Bottom - CRM */}
              <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-40 text-center bg-[#fdf8f5] p-5 rounded-sm border border-[#efe6df] shadow-sm transition-transform duration-500 hover:-translate-y-1">
                <Users className="w-4 h-4 mx-auto mb-2 text-[#b89576]" strokeWidth={1.5} />
                <h4 className="text-[#211a18] font-serif font-bold text-[14px] mb-1">Customer CRM</h4>
                <p className="text-[#8c8580] text-[11px] leading-tight">Own your audience data.</p>
              </div>

              {/* 3. Top Right - Scheduling */}
              <div className="absolute top-[26%] right-[3%] w-40 text-center bg-[#fdf8f5] p-5 rounded-sm border border-[#efe6df] shadow-sm transition-transform duration-500 hover:-translate-y-1">
                <CalendarDays className="w-4 h-4 mx-auto mb-2 text-[#b89576]" strokeWidth={1.5} />
                <h4 className="text-[#211a18] font-serif font-bold text-[14px] mb-1">Smart Scheduling</h4>
                <p className="text-[#8c8580] text-[11px] leading-tight">Manage capacities.</p>
              </div>

              {/* 4. Bottom Right - Tickets */}
              <div className="absolute bottom-[26%] right-[3%] w-40 text-center bg-[#fdf8f5] p-5 rounded-sm border border-[#efe6df] shadow-sm transition-transform duration-500 hover:-translate-y-1">
                <Ticket className="w-4 h-4 mx-auto mb-2 text-[#b89576]" strokeWidth={1.5} />
                <h4 className="text-[#211a18] font-serif font-bold text-[14px] mb-1">Auto E-Tickets</h4>
                <p className="text-[#8c8580] text-[11px] leading-tight">QR codes & reminders.</p>
              </div>

              {/* 5. Top Left - Themes */}
              <div className="absolute top-[26%] left-[3%] w-40 text-center bg-[#fdf8f5] p-5 rounded-sm border border-[#efe6df] shadow-sm transition-transform duration-500 hover:-translate-y-1">
                <Sparkles className="w-4 h-4 mx-auto mb-2 text-[#b89576]" strokeWidth={1.5} />
                <h4 className="text-[#211a18] font-serif font-bold text-[14px] mb-1">Custom Themes</h4>
                <p className="text-[#8c8580] text-[11px] leading-tight">Beautiful booking pages.</p>
              </div>

              {/* 6. Bottom Left - Reviews */}
              <div className="absolute bottom-[26%] left-[3%] w-40 text-center bg-[#fdf8f5] p-5 rounded-sm border border-[#efe6df] shadow-sm transition-transform duration-500 hover:-translate-y-1">
                <CheckCircle2 className="w-4 h-4 mx-auto mb-2 text-[#b89576]" strokeWidth={1.5} />
                <h4 className="text-[#211a18] font-serif font-bold text-[14px] mb-1">Verified Reviews</h4>
                <p className="text-[#8c8580] text-[11px] leading-tight">Build trust automatically.</p>
              </div>

            </div>
          </div>
        </section>

        {/* IV. Custom Storefront & Themes (Interactive Demo) */}
        <StorefrontDemo />

        {/* Pricing Section */}
        <section className="py-24 md:py-32 bg-[#1a1a1a] text-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Simple, transparent pricing.</h2>
              <p className="text-[#a3a3a3] font-light text-lg">Start for free. Upgrade when you're ready to grow.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="bg-[#262626] rounded-[2rem] p-8 md:p-10 border border-[#333333]">
                <h3 className="text-2xl font-serif text-white mb-2">Free</h3>
                <p className="text-[#a3a3a3] text-sm mb-6">Perfect for trying out the platform.</p>
                <div className="text-5xl font-bold font-serif text-white mb-8">₹0<span className="text-lg font-sans font-normal text-[#a3a3a3]">/mo</span></div>
                
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-[#d45f2a] shrink-0" /><span className="text-[#d4d4d4]">Host up to 2 free workshops</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-[#d45f2a] shrink-0" /><span className="text-[#d4d4d4]">Basic storefront theme</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-[#d45f2a] shrink-0" /><span className="text-[#d4d4d4]">Standard support</span></li>
                </ul>
                <a href="/register" className="block w-full text-center bg-[#333333] text-white py-4 rounded-full font-semibold hover:bg-[#404040] transition">Get Started</a>
              </div>

              {/* Paid Plan */}
              <div className="bg-gradient-to-b from-[#d45f2a] to-[#b04a1e] rounded-[2rem] p-8 md:p-10 border border-[#e8703a] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 bg-white text-[#d45f2a] text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">Most Popular</div>
                <h3 className="text-2xl font-serif text-white mb-2">Creator Pro</h3>
                <p className="text-white/80 text-sm mb-6">Everything you need to run a serious business.</p>
                <div className="text-5xl font-bold font-serif text-white mb-8">₹299<span className="text-lg font-sans font-normal text-white/80">/mo</span></div>
                
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-white shrink-0" /><span className="text-white">Unlimited paid & free workshops</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-white shrink-0" /><span className="text-white">All premium themes unlocked</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-white shrink-0" /><span className="text-white">Advanced Analytics & Views</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-white shrink-0" /><span className="text-white">Custom Domain setup</span></li>
                </ul>
                <a href="/register" className="block w-full text-center bg-white text-[#d45f2a] py-4 rounded-full font-semibold hover:bg-[#faf9f7] transition">Upgrade to Pro</a>
              </div>
            </div>
          </div>
        </section>

        {/* V. The Frictionless Catalyst */}
        <section className="py-32 md:py-48 px-6 bg-[#faf9f7] text-center">
          <h2 className="text-5xl md:text-7xl font-serif text-[#1a1a1a] tracking-tight mb-8">
            Claim your space.
          </h2>
          <div className="w-full max-w-lg mx-auto">
            <form action="/register" method="GET" className="relative flex items-center bg-white rounded-full p-2 shadow-xl shadow-[#d45f2a]/5 border border-[#e5e5e5] focus-within:border-[#d45f2a] transition-all">
              <span className="pl-6 text-base font-medium text-[#a3a3a3]">hunarokram.vercel.app/</span>
              <input 
                type="text" 
                name="slug"
                placeholder="yourname"
                className="flex-1 bg-transparent border-none outline-none text-base font-semibold text-[#1a1a1a] placeholder:text-[#d4d4d4] px-1 min-w-0 focus:ring-0"
              />
              <button type="submit" className="bg-[#d45f2a] text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-[#b04a1e] transition-colors flex items-center gap-2">
                Start Free <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[#a3a3a3] text-sm mt-6">No credit card required. Setup in 60 seconds.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
