import * as React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Ticket, CreditCard, Settings, PlayCircle } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="bg-[#faf9f7] min-h-screen font-sans">
      <Header />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <h1 className="text-5xl md:text-7xl font-serif text-[#1a1a1a] tracking-tight mb-4">
            How can we help?
          </h1>
          <p className="text-xl text-[#6b6b6b] font-light max-w-2xl">
            Everything you need to know about setting up your storefront, managing bookings, and getting paid.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column: Sticky Navigation */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32 space-y-2">
              <a href="#getting-started" className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#e5e5e5] hover:border-[#d45f2a] transition-colors group text-left w-full">
                <div className="w-12 h-12 rounded-xl bg-[#f0ebe1] flex items-center justify-center group-hover:bg-[#d45f2a]/10 transition-colors">
                  <Settings className="w-5 h-5 text-[#1a1a1a] group-hover:text-[#d45f2a]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1a1a]">Getting Started</h3>
                  <p className="text-sm text-[#a3a3a3]">Setting up your storefront</p>
                </div>
              </a>

              <a href="#bookings" className="flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-[#e5e5e5] hover:bg-white transition-colors group text-left w-full">
                <div className="w-12 h-12 rounded-xl bg-[#f0ebe1] flex items-center justify-center group-hover:bg-white transition-colors">
                  <Ticket className="w-5 h-5 text-[#1a1a1a]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1a1a]">Managing Bookings</h3>
                  <p className="text-sm text-[#a3a3a3]">Tickets, limits, and schedules</p>
                </div>
              </a>

              <a href="#payments" className="flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-[#e5e5e5] hover:bg-white transition-colors group text-left w-full">
                <div className="w-12 h-12 rounded-xl bg-[#f0ebe1] flex items-center justify-center group-hover:bg-white transition-colors">
                  <CreditCard className="w-5 h-5 text-[#1a1a1a]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1a1a]">Payments & Payouts</h3>
                  <p className="text-sm text-[#a3a3a3]">Razorpay and UPI integration</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Accordions & Visual Answers */}
          <div className="lg:col-span-8 space-y-20">
            
            {/* Section 1 */}
            <section id="getting-started" className="scroll-mt-32 space-y-8">
              <h2 className="text-3xl font-serif text-[#1a1a1a] border-b border-[#e5e5e5] pb-4">Getting Started</h2>
              
              <div className="space-y-12">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#1a1a1a]">How do I change my storefront theme?</h3>
                  <p className="text-[#6b6b6b] leading-relaxed">
                    You can change your aesthetic at any time. Go to your Dashboard, navigate to <strong>Website Settings</strong>, and select a new theme from the palette.
                  </p>
                  {/* Visual Answer Placeholder */}
                  <div className="aspect-[16/9] w-full max-w-lg bg-[#f0ebe1] rounded-2xl overflow-hidden flex items-center justify-center group cursor-pointer relative border border-[#e5e5e5]">
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                    <PlayCircle className="w-12 h-12 text-[#1a1a1a] opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute bottom-4 left-4 text-xs font-medium text-[#6b6b6b] bg-white/80 px-2 py-1 rounded backdrop-blur">3s visual guide</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#1a1a1a]">Can I use my own domain?</h3>
                  <p className="text-[#6b6b6b] leading-relaxed">
                    Yes. If you are on the Creator plan or higher, you can connect your custom domain (e.g., bookings.yourwebsite.com) in the Settings panel.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section id="bookings" className="scroll-mt-32 space-y-8">
              <h2 className="text-3xl font-serif text-[#1a1a1a] border-b border-[#e5e5e5] pb-4">Managing Bookings</h2>
              <div className="space-y-12">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#1a1a1a]">What happens when I reject a manual booking?</h3>
                  <p className="text-[#6b6b6b] leading-relaxed">
                    If you reject a pending manual booking, two things happen instantly:
                    <br />1. The spots reserved by the customer are released back into your inventory.
                    <br />2. The customer receives an automated email explaining that the booking was not approved.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="payments" className="scroll-mt-32 space-y-8">
              <h2 className="text-3xl font-serif text-[#1a1a1a] border-b border-[#e5e5e5] pb-4">Payments & Payouts</h2>
              <div className="space-y-12">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#1a1a1a]">How do I connect Razorpay?</h3>
                  <p className="text-[#6b6b6b] leading-relaxed">
                    We use a "Bring Your Own Keys" model so payouts go directly to your bank account without us holding your funds.
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-[#6b6b6b]">
                    <li>Generate API Keys in your Razorpay Dashboard.</li>
                    <li>Paste your Key ID and Key Secret in our Dashboard Settings.</li>
                    <li>Set up a Webhook URL pointing to our platform to enable instant ticketing.</li>
                  </ol>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
