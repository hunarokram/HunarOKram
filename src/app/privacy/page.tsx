import * as React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#faf9f7] min-h-screen font-sans selection:bg-[#d45f2a] selection:text-white">
      <Header />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20 max-w-3xl">
          <div className="w-12 h-12 bg-[#f0ebe1] rounded-2xl flex items-center justify-center mb-6">
            <Shield className="w-6 h-6 text-[#1a1a1a]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#1a1a1a] tracking-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-[#6b6b6b] font-light">
            Effective Date: August 30, 2026. We believe in absolute transparency about how your data is handled.
          </p>
        </div>

        {/* The "Readability Layout" */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Main Legal Text (Narrow line length, serif font for readability) */}
          <div className="lg:col-span-8 prose prose-lg prose-headings:font-serif prose-headings:text-[#1a1a1a] prose-p:text-[#404040] prose-p:font-serif prose-p:leading-relaxed prose-a:text-[#d45f2a] max-w-none">
            
            <h2>1. Information We Collect</h2>
            <p>
              When you create an account to use our platform, we collect personal information such as your name, email address, and billing information. If you are an organizer, we also collect data related to your Razorpay or UPI payment settings to facilitate direct transactions between you and your customers.
            </p>
            <p>
              When a customer books an experience through your storefront, we collect their name, email address, and phone number to generate tickets and send notifications on your behalf.
            </p>

            <div className="my-12 h-px w-full bg-[#e5e5e5]" />

            <h2>2. How We Use Your Information</h2>
            <p>
              We use the collected information solely for the purpose of operating, maintaining, and providing the features of the service. This includes processing bookings, sending automated email notifications (such as tickets, rescheduling alerts, and cancellations), and providing customer support.
            </p>
            <p>
              We do not use your customers' data for our own marketing purposes. The relationship is strictly between the organizer and the customer; we merely provide the infrastructure.
            </p>

            <div className="my-12 h-px w-full bg-[#e5e5e5]" />

            <h2>3. Third-Party Integrations</h2>
            <p>
              Our service integrates with third-party payment processors (e.g., Razorpay). We do not store your full credit card numbers or raw payment processing data on our servers. All online transactions are processed directly via the third-party providers, and their privacy policies govern that data.
            </p>

          </div>

          {/* Right Column: TL;DR Sidebar */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-32 space-y-8 border-l border-[#e5e5e5] pl-8">
              
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d45f2a]">Section 1 Summary</span>
                <p className="text-sm font-medium text-[#1a1a1a]">What we collect</p>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">
                  We collect basic profile data (name, email) and necessary payment configurations. We also collect customer emails to send tickets.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d45f2a]">Section 2 Summary</span>
                <p className="text-sm font-medium text-[#1a1a1a]">How we use it</p>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">
                  We only use data to make the platform work. <strong className="text-[#1a1a1a]">We never sell your data</strong> or market to your customers.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d45f2a]">Section 3 Summary</span>
                <p className="text-sm font-medium text-[#1a1a1a]">Payments</p>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">
                  We don't touch or store credit card numbers. Razorpay handles the heavy lifting securely.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
