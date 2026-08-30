'use client';
import { useCurrentOrganizer } from '@/hooks/use-organizer';
import { useExperiences } from '@/hooks/use-experiences';
import { CreditCard, Check, ShieldCheck, Zap, Loader2, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { ImageUploader } from '@/components/ui/image-uploader';

export default function SubscriptionPage() {
  const { data: organizer, isLoading: isLoadingOrg, refetch } = useCurrentOrganizer();
  const { data: experiencesRes, isLoading: isLoadingExp } = useExperiences({ page: 1, pageSize: 100, sortDir: 'desc' });
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string[]>([]);
  const [formData, setFormData] = useState({ transactionId: '', name: '', phone: '' });

  if (isLoadingOrg || isLoadingExp) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  const isExpired = !!(organizer?.subscriptionExpiresAt && new Date() > new Date(organizer.subscriptionExpiresAt));
  const isActive = organizer?.subscriptionStatus === 'active' && !isExpired;
  const isPending = organizer?.subscriptionStatus === 'pending_verification';
  const isFreeLifetime = (!organizer?.subscriptionStatus || organizer.subscriptionStatus === 'free') && !organizer?.subscriptionExpiresAt;
  const totalExperiences = experiencesRes?.length || 0;
  const experiencesRemaining = Math.max(0, 2 - totalExperiences);

  const handleSubmitPayment = async () => {
    if (screenshotUrl.length === 0 || !formData.transactionId || !formData.name || !formData.phone) {
      alert('Please fill out all fields and upload a payment screenshot.');
      return;
    }

    setIsUpgrading(true);
    try {
      const res = await fetch('/api/subscription/upgrade', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          screenshotUrl: screenshotUrl[0],
          ...formData
        })
      });
      if (!res.ok) throw new Error('Failed to upgrade subscription');
      
      await refetch();
      setShowModal(false);
      alert('Success! Your payment receipt has been submitted and is pending verification.');
    } catch (error) {
      alert('Error submitting payment. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-gray-900">Subscription & Billing</h1>
        <p className="text-gray-500 mt-1">Manage your plan and billing details.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Current Status Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Current Plan</h2>
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isExpired ? 'bg-red-100 text-red-800' : 
              isPending ? 'bg-blue-100 text-blue-800' :
              isFreeLifetime ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
            }`}>
              {isExpired ? 'Expired' : isPending ? 'Pending Verification' : isFreeLifetime ? 'Free Plan' : 'Creator Plan'}
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              {isExpired 
                ? "Your Creator Plan has expired. You cannot create new experiences until you renew."
                : isPending
                ? "Your payment screenshot has been submitted and is currently being verified by our team. Please allow 1-2 business days."
                : isFreeLifetime 
                ? "You are on the Free Developer plan. This allows you to test the platform and publish up to 2 experiences."
                : "You are on the active Creator Plan. You have unlimited access to create as many experiences as you want."}
            </p>

            {isActive && organizer?.subscriptionExpiresAt && (
              <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 text-sm font-medium">
                Your subscription is active and will expire on {new Date(organizer.subscriptionExpiresAt).toLocaleDateString()}.
              </div>
            )}

            {isExpired && (
              <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 text-sm font-medium">
                Your subscription expired on {organizer?.subscriptionExpiresAt ? new Date(organizer.subscriptionExpiresAt).toLocaleDateString() : 'recently'}. Please renew to regain access.
              </div>
            )}
            
            {isFreeLifetime && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-semibold text-gray-900">Experiences Limit</span>
                  <span className="text-sm font-bold text-brand-600">{totalExperiences} / 2 Used</span>
                </div>
                <div className="w-full bg-[var(--border)] rounded-full h-2">
                  <div className="bg-brand-600 h-2 rounded-full" style={{ width: `${Math.min(100, (totalExperiences / 2) * 100)}%` }}></div>
                </div>
                {experiencesRemaining === 0 && (
                  <p className="text-xs text-red-600 font-medium mt-3">You have reached the free lifetime limit. Upgrade to publish more experiences.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Card */}
        {(isFreeLifetime || isExpired) && !isPending && (
          <div className="bg-gray-900 text-white rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap className="w-32 h-32" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div>
                <h2 className="text-2xl font-serif text-brand-600">Creator Plan</h2>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">₹299</span>
                  <span className="text-sm text-gray-500 opacity-80">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3">
                {['Create unlimited experiences', 'Priority support', 'Custom branding options', 'Advanced analytics'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="pt-4">
                <Button 
                  onClick={() => setShowModal(true)}
                  className="w-full py-6 bg-brand-600 hover:bg-brand-600/90 text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" /> Subscribe Now
                </Button>
                <p className="text-center text-[10px] text-[var(--bg-alt)] opacity-60 mt-3 uppercase tracking-widest">
                  Manual Payment & Verification
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Upgrade to Creator Plan</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">Scan this QR Code to pay ₹299</p>
                <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('upi://pay?pa=admin@upi&pn=HunarOKram&am=299&cu=INR')}`} 
                    alt="Payment QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-gray-500">UPI ID: admin@upi</p>
              </div>

              <div className="space-y-3 max-h-[40vh] overflow-y-auto px-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-900">Transaction ID (UTR)</label>
                  <Input 
                    placeholder="e.g. 123456789012" 
                    value={formData.transactionId}
                    onChange={e => setFormData({ ...formData, transactionId: e.target.value })}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-900">Billing Name</label>
                  <Input 
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-900">Phone Number</label>
                  <Input 
                    placeholder="Your contact number" 
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-sm font-medium text-gray-900">Upload Payment Screenshot</label>
                  <ImageUploader 
                    images={screenshotUrl} 
                    onChange={setScreenshotUrl} 
                    maxImages={1}
                  />
                </div>
              </div>

              <Button 
                onClick={handleSubmitPayment}
                disabled={isUpgrading || screenshotUrl.length === 0 || !formData.transactionId || !formData.name || !formData.phone}
                className="w-full py-6 bg-brand-600 hover:bg-brand-600/90 text-white font-bold rounded-xl text-lg flex items-center justify-center gap-2"
              >
                {isUpgrading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                ) : (
                  <><Check className="w-5 h-5" /> Submit for Verification</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
