import * as React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-[#faf9f7] min-h-screen font-sans selection:bg-[#d45f2a] selection:text-white">
      <Header />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="mb-20 max-w-3xl">
          <div className="w-12 h-12 bg-[#f0ebe1] rounded-2xl flex items-center justify-center mb-6">
            <FileText className="w-6 h-6 text-[#1a1a1a]" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-[#1a1a1a] tracking-tight mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-[#6b6b6b] font-light">
            Effective Date: August 30, 2026. The rules of engagement for using our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          <div className="lg:col-span-8 prose prose-lg prose-headings:font-serif prose-headings:text-[#1a1a1a] prose-p:text-[#404040] prose-p:font-serif prose-p:leading-relaxed prose-a:text-[#d45f2a] max-w-none">
            
            <h2>1. Platform Provider, Not a Merchant</h2>
            <p>
              We provide software that allows creators and organizers to host experiences and accept bookings. We are not the merchant of record for the experiences sold through our platform. The legal contract for the purchase of a ticket or booking is strictly between the customer and the organizer.
            </p>

            <div className="my-12 h-px w-full bg-[#e5e5e5]" />

            <h2>2. Prohibited Uses</h2>
            <p>
              You may not use the platform to sell illegal, fraudulent, or strictly prohibited experiences. We reserve the right to suspend or terminate accounts that violate our community standards or use our infrastructure to facilitate unlawful transactions.
            </p>

            <div className="my-12 h-px w-full bg-[#e5e5e5]" />

            <h2>3. Refunds and Cancellations</h2>
            <p>
              Because payments are routed directly to the organizer's Razorpay or bank account via UPI, organizers are solely responsible for issuing refunds to their customers in the event of cancellations or disputes. Our platform facilitates the communication (e.g., sending cancellation emails) but cannot forcefully extract funds from an organizer's bank account to refund a customer.
            </p>

          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-32 space-y-8 border-l border-[#e5e5e5] pl-8">
              
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d45f2a]">Section 1 Summary</span>
                <p className="text-sm font-medium text-[#1a1a1a]">Who is selling what?</p>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">
                  We just provide the software. The actual business transaction is between the Creator and the Customer.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d45f2a]">Section 2 Summary</span>
                <p className="text-sm font-medium text-[#1a1a1a]">Play by the rules</p>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">
                  Don't use our platform for illegal activities, or we'll have to shut down your account.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d45f2a]">Section 3 Summary</span>
                <p className="text-sm font-medium text-[#1a1a1a]">Refund responsibility</p>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">
                  Since the money goes directly to you (the creator), you are responsible for processing your customers' refunds if an event is cancelled.
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
