"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateOrganizerSchema } from '@/schemas/organizer.schema';
import { useCurrentOrganizer, useUpdateOrganizer } from '@/hooks/use-organizer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUploader } from '@/components/ui/image-uploader';
import { ChangeEmail } from '@/components/dashboard/ChangeEmail';
import { Loader2, Save, ExternalLink, Globe, CreditCard, User, Image as ImageIcon } from 'lucide-react';

type FormData = z.infer<typeof updateOrganizerSchema>;

export default function SettingsPage() {
  const { data: organizer, isLoading: isFetching } = useCurrentOrganizer();
  const updateOrganizer = useUpdateOrganizer();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string>('');
  const [mobileCoverImage, setMobileCoverImage] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(updateOrganizerSchema),
  });

  // Watch accepted methods to show/hide fields
  const acceptedMethods = watch('paymentSettings.acceptedMethods') || 'both';

  useEffect(() => {
    if (organizer) {
      reset({
        name: organizer.name,
        bio: (organizer as any).bio || '',
        coverImage: (organizer as any).coverImage || '',
        mobileCoverImage: (organizer as any).mobileCoverImage || '',
        avatar: (organizer as any).avatar || '',
        pastCustomersCount: (organizer as any).pastCustomersCount || 0,
        contact: { email: organizer.contact.email },
        customDomain: organizer.customDomain?.hostname || '',
        paymentSettings: {
          razorpayKeyId: organizer.paymentSettings?.razorpayKeyId || '',
          razorpayKeySecret: organizer.paymentSettings?.razorpayKeySecret || '',
          razorpayWebhookSecret: organizer.paymentSettings?.razorpayWebhookSecret || '',
          acceptedMethods: (organizer.paymentSettings as any)?.acceptedMethods || 'both',
          manualPaymentUpiId: (organizer.paymentSettings as any)?.manualPaymentUpiId || '',
          manualPaymentLink: (organizer.paymentSettings as any)?.manualPaymentLink || '',
        },
      });
      setCoverImage((organizer as any).coverImage || '');
      setMobileCoverImage((organizer as any).mobileCoverImage || '');
      setAvatar((organizer as any).avatar || '');
      setQrCodeUrl((organizer.paymentSettings as any)?.manualPaymentQrCodeUrl || '');
    }
  }, [organizer, reset]);

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    setSuccessMessage(null);
    try {
      const submissionData = {
        ...data,
        coverImage,
        mobileCoverImage,
        avatar,
        paymentSettings: {
          ...data.paymentSettings,
          manualPaymentQrCodeUrl: qrCodeUrl
        }
      };
      await updateOrganizer.mutateAsync(submissionData);
      setSuccessMessage('Settings saved successfully.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setServerError(err.message || 'Failed to update settings.');
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-warm-400" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-warm-900">Settings</h1>
          <p className="text-warm-500 mt-1 text-sm">Manage your brand profile, storefront, and payment setup.</p>
        </div>
        {organizer?.slug && (
          <a
            href={`/${organizer.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium border border-brand-200 bg-brand-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Storefront
          </a>
        )}
      </div>

      {serverError && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          {serverError}
        </div>
      )}
      {successMessage && (
        <div className="p-4 text-sm text-green-700 bg-green-50 rounded-xl border border-green-100 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
          {successMessage}
        </div>
      )}

      {organizer && <ChangeEmail currentEmail={organizer.contact.email} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* ── BRAND IDENTITY ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-warm-100 flex items-center justify-center">
                <User className="w-4 h-4 text-warm-600" />
              </div>
              <div>
                <CardTitle className="text-base">Brand Identity</CardTitle>
                <CardDescription className="text-xs mt-0.5">How your studio appears to customers on the storefront.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-warm-800">Brand / Studio Name</label>
              <Input {...register('name')} placeholder="e.g. Maya's Pottery Studio" className={errors.name ? 'border-red-400' : ''} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-warm-800">Bio / About</label>
              <textarea
                {...register('bio')}
                rows={3}
                placeholder="Tell customers about yourself, your story, what makes your workshops special..."
                className="w-full rounded-lg border border-warm-200 bg-warm-50 px-3 py-2.5 text-sm text-warm-900 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all resize-none"
              />
              <p className="text-xs text-warm-400">This appears on your public storefront below your name. Max 500 characters.</p>
              {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-warm-800">Past / Offline Customers</label>
              <Input type="number" {...register('pastCustomersCount', { valueAsNumber: true })} placeholder="e.g. 100" className={errors.pastCustomersCount ? 'border-red-400' : ''} />
              <p className="text-xs text-warm-400">If you have hosted attendees or customers offline before, add that number here. It will be added to your real online bookings to show your total "Happy Customers" on the storefront.</p>
              {errors.pastCustomersCount && <p className="text-xs text-red-500">{errors.pastCustomersCount.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-warm-800">Profile Avatar</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-warm-200 bg-warm-50 shrink-0">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-warm-300">
                      <User className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1 max-w-sm">
                  {avatar ? (
                    <button
                      type="button"
                      onClick={() => { setAvatar(''); setValue('avatar', ''); }}
                      className="text-xs text-red-600 font-medium hover:text-red-700"
                    >
                      Remove Avatar
                    </button>
                  ) : (
                    <ImageUploader
                      images={[]}
                      onChange={(urls: string[]) => { 
                        const url = urls[0] || '';
                        setAvatar(url); 
                        setValue('avatar', url); 
                      }}
                      maxImages={1}
                    />
                  )}
                </div>
              </div>
              <p className="text-xs text-warm-400">Upload a circular profile photo for your storefront.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-warm-800">Storefront URL Slug</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-warm-200 bg-warm-100 text-warm-500 text-sm">
                  yourdomain.com/
                </span>
                <Input disabled value={organizer?.slug || ''} className="rounded-l-none bg-warm-50 text-warm-500" />
              </div>
              <p className="text-xs text-warm-400">Contact support to change your URL slug.</p>
            </div>
          </CardContent>
        </Card>

        {/* ── STOREFRONT COVER IMAGE ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-warm-100 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-warm-600" />
              </div>
              <div>
                <CardTitle className="text-base">Hero Cover Image</CardTitle>
                <CardDescription className="text-xs mt-0.5">The full-bleed background shown at the top of your storefront page.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {coverImage && (
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-warm-200">
                <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <button
                  type="button"
                  onClick={() => { setCoverImage(''); setValue('coverImage', ''); }}
                  className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full hover:bg-black/70 transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
            {!coverImage && (
              <ImageUploader
                images={[]}
                onChange={(urls: string[]) => { 
                  const url = urls[0] || '';
                  setCoverImage(url); 
                  setValue('coverImage', url); 
                }}
                maxImages={1}
              />
            )}
            <p className="text-xs text-warm-400">Use a high-quality landscape photo (1920x1080 or wider). Natural, warm tones work best.</p>
          </CardContent>
        </Card>

        {/* ── MOBILE COVER IMAGE ── */}
        <Card className="border-warm-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-warm-50/50 border-b border-warm-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-100 rounded-lg text-brand-700">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base">Mobile Cover Image (Optional)</CardTitle>
                <CardDescription className="text-xs mt-0.5">A portrait-oriented image specifically for mobile devices.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            {mobileCoverImage && (
              <div className="relative w-48 h-64 mx-auto rounded-xl overflow-hidden border border-warm-200">
                <img src={mobileCoverImage} alt="Mobile Cover preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <button
                  type="button"
                  onClick={() => { setMobileCoverImage(''); setValue('mobileCoverImage', ''); }}
                  className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full hover:bg-black/70 transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
            {!mobileCoverImage && (
              <ImageUploader
                images={[]}
                onChange={(urls: string[]) => { 
                  const url = urls[0] || '';
                  setMobileCoverImage(url); 
                  setValue('mobileCoverImage', url); 
                }}
                maxImages={1}
              />
            )}
            <p className="text-xs text-warm-400 text-center">Use a portrait photo (e.g. 1080x1920). If left empty, the desktop cover image will be used.</p>
          </CardContent>
        </Card>

        {/* ── PAYMENT INTEGRATION ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-warm-100 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-warm-600" />
              </div>
              <div>
                <CardTitle className="text-base">Payment Integration</CardTitle>
                <CardDescription className="text-xs mt-0.5">Connect your Razorpay account to collect payments directly.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700">
              💡 In your Razorpay Dashboard → Webhooks, set the URL to:{' '}
              <code className="font-mono bg-blue-100 px-1 rounded">https://yourdomain.com/api/webhooks/razorpay</code>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-warm-800">Razorpay Key ID</label>
              <Input {...register('paymentSettings.razorpayKeyId')} type="password" placeholder="rzp_test_..." className={errors.paymentSettings?.razorpayKeyId ? 'border-red-400' : ''} />
              {errors.paymentSettings?.razorpayKeyId && <p className="text-xs text-red-500">{errors.paymentSettings.razorpayKeyId.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-warm-800">Razorpay Key Secret</label>
              <Input {...register('paymentSettings.razorpayKeySecret')} type="password" placeholder="••••••••••••••••" className={errors.paymentSettings?.razorpayKeySecret ? 'border-red-400' : ''} />
              {errors.paymentSettings?.razorpayKeySecret && <p className="text-xs text-red-500">{errors.paymentSettings.razorpayKeySecret.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-warm-800">Webhook Secret</label>
              <Input {...register('paymentSettings.razorpayWebhookSecret')} type="password" placeholder="••••••••••••••••" className={errors.paymentSettings?.razorpayWebhookSecret ? 'border-red-400' : ''} />
              <p className="text-xs text-warm-400">Used to verify incoming webhook events from Razorpay.</p>
              {errors.paymentSettings?.razorpayWebhookSecret && <p className="text-xs text-red-500">{errors.paymentSettings.razorpayWebhookSecret.message}</p>}
            </div>

            <div className="space-y-1.5 pt-4 border-t border-warm-100">
              <label className="text-sm font-medium text-warm-900">Accepted Payment Methods</label>
              <select {...register('paymentSettings.acceptedMethods')} className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option value="both">Both Razorpay & Manual QR</option>
                <option value="razorpay">Razorpay Only</option>
                <option value="manual">Manual QR Only</option>
              </select>
              <p className="text-xs text-warm-500">Choose how customers can pay for your experiences.</p>
            </div>

            {(acceptedMethods === 'manual' || acceptedMethods === 'both') && (
              <div className="pl-6 space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-warm-800">Your UPI ID</label>
                  <Input {...register('paymentSettings.manualPaymentUpiId')} placeholder="e.g. yourname@upi" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-warm-800">Payment QR Code</label>
                  <p className="text-xs text-warm-400 mb-2">Upload the screenshot of your UPI QR code. Customers will scan this to pay.</p>
                  <ImageUploader 
                    images={qrCodeUrl ? [qrCodeUrl] : []} 
                    onChange={(imgs) => setQrCodeUrl(imgs[0] || '')} 
                    maxImages={1} 
                  />
                </div>
                <div className="space-y-1.5 pt-4">
                  <label className="text-sm font-medium text-warm-800">Razorpay / External Payment Link (Optional)</label>
                  <p className="text-xs text-warm-400">If you prefer users to pay via a payment link (e.g. Razorpay Payment Link) instead of UPI QR, enter it here.</p>
                  <Input {...register('paymentSettings.manualPaymentLink')} placeholder="https://rzp.io/l/..." />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── CUSTOM DOMAIN ── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-warm-100 flex items-center justify-center">
                <Globe className="w-4 h-4 text-warm-600" />
              </div>
              <div>
                <CardTitle className="text-base">Custom Domain</CardTitle>
                <CardDescription className="text-xs mt-0.5">Use your own domain instead of the default URL.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-warm-800">Domain Name</label>
              <Input {...register('customDomain')} placeholder="e.g. workshops.mybrand.com" className={errors.customDomain ? 'border-red-400' : ''} />
              <p className="text-xs text-warm-400">After saving, add a CNAME record in your DNS pointing to our servers.</p>
              {errors.customDomain && <p className="text-xs text-red-500">{errors.customDomain.message}</p>}
            </div>
            {organizer?.customDomain?.hostname && (
              <div className="p-3.5 rounded-xl border border-warm-200 bg-warm-50 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-warm-900">{organizer.customDomain.hostname}</p>
                  <p className="text-xs text-warm-400 mt-0.5">
                    Status:{' '}
                    {organizer.customDomain.verified
                      ? <span className="text-green-600 font-semibold">✓ Verified</span>
                      : <span className="text-amber-600 font-semibold">⏳ Pending Verification</span>
                    }
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end pb-8">
          <Button type="submit" className="gap-2 px-6" disabled={updateOrganizer.isPending}>
            {updateOrganizer.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
