"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateExperience } from "@/hooks/use-experiences";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Select } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewExperiencePage() {
  const router = useRouter();
  const { mutateAsync: createExperience, isPending } = useCreateExperience();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "60",
    locationType: "physical",
    address: "",
    mapUrl: "",
    status: "draft",
    images: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const priceInPaise = Math.round(parseFloat(formData.price) * 100);
      
      const res = await createExperience({
        title: formData.title,
        description: formData.description,
        price: priceInPaise,
        currency: "INR",
        duration: parseInt(formData.duration, 10),
        location: {
          type: formData.locationType as "physical" | "online" | "hybrid",
          address: formData.address || undefined,
          mapUrl: formData.mapUrl || undefined,
        },
        status: formData.status as "draft" | "published" | "archived" | "past",
        images: formData.images,
        tags: [],
        offers: [],
      });
      
      setSuccess("Experience created successfully. Redirecting...");
      setTimeout(() => {
        router.push(`/experiences/${res._id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to create experience");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" type="button" onClick={() => router.push('/experiences')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Create Experience</h1>
          <p className="text-muted-foreground mt-1">Add details for a new experience offering.</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-sm whitespace-pre-wrap">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 text-sm">
                {success}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Morning Yoga Session"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what the experience is about..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Images</label>
              <ImageUploader 
                images={formData.images} 
                onChange={(images) => setFormData({ ...formData, images })} 
                maxImages={5}
              />
              <p className="text-xs text-muted-foreground">Upload up to 5 high-quality images for your storefront.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (INR)</label>
                <Input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (Minutes)</label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location Type</label>
                <Select
                  value={formData.locationType}
                  onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                >
                  <option value="physical">Physical</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="past">Past (Completed)</option>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Complete Address / Link</label>
                <Input
                  placeholder="e.g. 123 Studio Lane, Art District"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Google Maps URL (Optional)</label>
                <Input
                  placeholder="e.g. https://maps.app.goo.gl/..."
                  value={formData.mapUrl}
                  onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Experience"}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
