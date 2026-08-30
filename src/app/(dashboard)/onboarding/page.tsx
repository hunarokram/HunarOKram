"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createOrganizerSchema } from '@/schemas/organizer.schema';
import { useCreateOrganizer } from '@/hooks/use-organizer';
import { ArrowRight, ArrowLeft, Palette, Loader2, Sparkles, Coffee, Music, Camera, Activity, PenTool } from 'lucide-react';
import { cn } from '@/utils/cn';

type FormData = z.infer<typeof createOrganizerSchema>;

const CATEGORIES = [
  { id: 'art', label: 'Art & Craft', icon: Palette },
  { id: 'culinary', label: 'Culinary', icon: Coffee },
  { id: 'wellness', label: 'Wellness', icon: Activity },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'photo', label: 'Photography', icon: Camera },
  { id: 'other', label: 'Other', icon: PenTool },
];

const THEMES = [
  { id: 'terracotta', label: 'Terracotta', bg: 'bg-[#d45f2a]', text: 'text-white' },
  { id: 'ocean', label: 'Ocean', bg: 'bg-[#0369a1]', text: 'text-white' },
  { id: 'forest', label: 'Forest', bg: 'bg-[#15803d]', text: 'text-white' },
  { id: 'midnight', label: 'Midnight', bg: 'bg-[#1e1b4b]', text: 'text-white' },
  { id: 'sunset', label: 'Sunset', bg: 'bg-[#be123c]', text: 'text-white' },
  { id: 'lavender', label: 'Lavender', bg: 'bg-[#7e22ce]', text: 'text-white' },
  { id: 'monochrome', label: 'Monochrome', bg: 'bg-[#171717]', text: 'text-white' },
];

export default function VisualOnboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSlug = searchParams?.get('slug') || '';
  
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [theme, setTheme] = useState('terracotta');
  
  const createOrganizer = useCreateOrganizer();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createOrganizerSchema),
    defaultValues: {
      name: '',
      slug: initialSlug,
    },
  });

  const currentName = watch('name');
  const currentSlug = watch('slug');

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await createOrganizer.mutateAsync({
        ...data,
        theme: theme as any,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setServerError(err.message || 'Failed to create account.');
    }
  };

  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  // Visual Theme preview mapping
  const activeTheme = THEMES.find(t => t.id === theme) || THEMES[0]!;

  return (
    <div className="min-h-screen bg-[#faf9f7] flex">
      {/* Left side: Interactive Setup */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 py-12 relative z-10">
        
        {step > 1 && (
          <button onClick={prevStep} className="absolute top-8 left-8 lg:left-24 text-[#a3a3a3] hover:text-[#1a1a1a] transition-colors flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        <div className="max-w-md w-full mx-auto">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-3">
                <h1 className="text-4xl font-serif text-[#1a1a1a]">What's your craft?</h1>
                <p className="text-[#6b6b6b]">Select a category to tailor your experience.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {CATEGORIES.map(c => {
                  const Icon = c.icon;
                  const isActive = category === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => { setCategory(c.id); nextStep(); }}
                      className={cn(
                        "p-6 rounded-2xl border text-left transition-all duration-300 group",
                        isActive ? "border-[#d45f2a] bg-[#d45f2a]/5" : "border-[#e5e5e5] bg-white hover:border-[#d45f2a]/30"
                      )}
                    >
                      <Icon className={cn("w-6 h-6 mb-4", isActive ? "text-[#d45f2a]" : "text-[#a3a3a3] group-hover:text-[#d45f2a]")} />
                      <h3 className={cn("font-medium", isActive ? "text-[#d45f2a]" : "text-[#1a1a1a]")}>{c.label}</h3>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-3">
                <h1 className="text-4xl font-serif text-[#1a1a1a]">Choose your canvas.</h1>
                <p className="text-[#6b6b6b]">Pick an aesthetic that matches your brand.</p>
              </div>
              <div className="flex flex-wrap gap-4">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setTheme(t.id); }}
                    className={cn(
                      "w-12 h-12 rounded-full border-2 transition-all duration-300",
                      t.bg,
                      theme === t.id ? "ring-4 ring-offset-4 ring-offset-[#faf9f7] ring-[#1a1a1a] scale-110" : "border-transparent opacity-80 hover:opacity-100 hover:scale-105"
                    )}
                    title={t.label}
                  />
                ))}
              </div>
              <div className="pt-8">
                <button onClick={nextStep} className="w-full bg-[#1a1a1a] text-white rounded-xl py-4 font-semibold hover:bg-[#d45f2a] transition-colors flex justify-center items-center gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="space-y-3">
                <h1 className="text-4xl font-serif text-[#1a1a1a]">Name your space.</h1>
                <p className="text-[#6b6b6b]">What should we call your storefront?</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {serverError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                    {serverError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Creator / Business Name</label>
                  <input
                    {...register('name')}
                    placeholder="e.g. Studio Clay"
                    className="w-full bg-white border border-[#e5e5e5] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d45f2a] transition-all"
                    autoFocus
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Your unique link</label>
                  <div className="flex items-center bg-white border border-[#e5e5e5] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#d45f2a] transition-all">
                    <span className="pl-4 text-[#a3a3a3] text-sm">hunarokram.vercel.app/</span>
                    <input
                      {...register('slug')}
                      placeholder="studioclay"
                      className="flex-1 bg-transparent border-none px-2 py-3 focus:outline-none text-sm"
                    />
                  </div>
                  {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                </div>
                
                <button 
                  type="submit"
                  disabled={!currentName || !currentSlug || createOrganizer.isPending}
                  className="w-full bg-[#d45f2a] text-white rounded-xl py-4 font-semibold hover:bg-[#b04a1e] transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {createOrganizer.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finish Setup'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Live Preview (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[#f0ebe1] p-12 items-center justify-center relative overflow-hidden">
        {/* Dynamic Background based on theme */}
        <div className={cn("absolute inset-0 opacity-20 transition-colors duration-1000", activeTheme.bg)} />
        
        {/* The Phone Mockup */}
        <div className="relative w-[340px] h-[700px] bg-white rounded-[3rem] shadow-2xl border-8 border-white overflow-hidden flex flex-col z-10 transition-all duration-700 transform hover:scale-[1.02]">
          {/* Mockup Header */}
          <div className={cn("h-48 transition-colors duration-700 p-6 flex flex-col justify-end relative overflow-hidden", activeTheme.bg)}>
             <div className="absolute top-0 left-0 right-0 h-32 bg-black/10" />
             <div className="w-16 h-16 bg-white rounded-full border-4 border-white shadow-sm flex items-center justify-center relative z-10 overflow-hidden text-2xl font-serif text-[#1a1a1a]">
                {currentName ? currentName.charAt(0).toUpperCase() : 'S'}
             </div>
          </div>
          
          {/* Mockup Body */}
          <div className="p-6 flex-1 bg-[#faf9f7]">
            <h2 className="text-xl font-serif text-[#1a1a1a] mb-1">{currentName || 'Your Name'}</h2>
            <p className="text-[#a3a3a3] text-xs mb-6">hunarokram.vercel.app/{currentSlug || 'yourname'}</p>
            
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-[#f0ebe1] flex gap-4">
                  <div className="w-20 h-20 rounded-xl bg-[#f5f5f5] shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-3/4 bg-[#e5e5e5] rounded" />
                    <div className="h-3 w-1/2 bg-[#f5f5f5] rounded" />
                    <div className={cn("h-6 w-1/3 rounded mt-2 transition-colors duration-700", activeTheme.bg, "opacity-10")} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
