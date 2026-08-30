'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { Palette, CheckCircle2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Paywall } from '@/components/ui/paywall';

const THEMES = [
  {
    id: 'terracotta',
    name: 'Terracotta (Classic)',
    description: 'Warm, earthy tones. Great for pottery, art, and creative workshops.',
    primary: '#a84b23',
    bg: '#faf9f7'
  },
  {
    id: 'ocean',
    name: 'Ocean (Modern)',
    description: 'Cool, professional blues. Great for tech, consulting, and fitness.',
    primary: '#2563eb',
    bg: '#f8fafc'
  },
  {
    id: 'forest',
    name: 'Forest (Nature)',
    description: 'Calming greens. Perfect for wellness, yoga, and outdoor activities.',
    primary: '#16a34a',
    bg: '#f0fdf4'
  },
  {
    id: 'midnight',
    name: 'Midnight (Dark)',
    description: 'Sleek, luxurious dark mode. Great for nightlife, VIP, and tech.',
    primary: '#8b5cf6',
    bg: '#0f172a'
  },
  {
    id: 'sunset',
    name: 'Sunset (Warm)',
    description: 'Vibrant pinks and oranges. Perfect for creative and energetic vibes.',
    primary: '#f43f5e',
    bg: '#fff1f2'
  },
  {
    id: 'lavender',
    name: 'Lavender (Elegant)',
    description: 'Soft purples. Ideal for beauty, fashion, and sophisticated events.',
    primary: '#9333ea',
    bg: '#faf5ff'
  },
  {
    id: 'monochrome',
    name: 'Monochrome (Minimal)',
    description: 'Clean black and white. For photography, design, and modern brands.',
    primary: '#171717',
    bg: '#fafafa'
  }
];

export default function WebsitePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('terracotta');

  useEffect(() => {
    fetch('/api/organizers/me')
      .then(res => res.json())
      .then(res => {
        if (res.data?.theme) setSelectedTheme(res.data.theme);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/organizers/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: selectedTheme })
      });
      if (res.ok) {
        toast({ message: 'Theme updated successfully', variant: 'success' });
      } else {
        toast({ message: 'Failed to update theme', variant: 'error' });
      }
    } catch (err) {
      toast({ message: 'Something went wrong', variant: 'error' });
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center items-center min-h-[400px]"><Spinner /></div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Website Editor</h1>
          <p className="text-muted-foreground mt-1">Customize your storefront template and color scheme.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-brand-600 hover:bg-brand-700 text-white">
          {saving ? 'Saving...' : 'Publish Changes'}
        </Button>
      </div>

      <Paywall featureName="Custom Branding" description="Upgrade to unlock custom storefront themes, removing watermarks, and connecting a custom domain.">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle>Color Theme</CardTitle>
                    <CardDescription>Select a primary color scheme for your public booking pages</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {THEMES.map((theme) => (
                    <div 
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        selectedTheme === theme.id 
                          ? 'border-brand-500 bg-brand-50/50' 
                          : 'border-warm-200 hover:border-warm-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-medium text-sm">{theme.name}</span>
                        {selectedTheme === theme.id && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full border shadow-sm" style={{ backgroundColor: theme.primary }} />
                        <div className="w-12 h-12 rounded-full border shadow-sm" style={{ backgroundColor: theme.bg }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">{theme.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Paywall>
    </div>
  );
}