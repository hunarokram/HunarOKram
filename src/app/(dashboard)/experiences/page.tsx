"use client";

import { useExperiences, useDeleteExperience } from "@/hooks/use-experiences";
import { useCurrentOrganizer } from "@/hooks/use-organizer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { MapPin, Plus, Clock, IndianRupee, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ExperiencesPage() {
  const router = useRouter();
  const { data: experiences, isLoading, error } = useExperiences();
  const { data: organizer } = useCurrentOrganizer();
  const { mutateAsync: deleteExp } = useDeleteExperience();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to completely delete "${title}"? This cannot be undone.`)) {
      try {
        setDeletingId(id);
        await deleteExp(id);
      } catch (err: any) {
        alert(err.message || "Failed to delete");
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load experiences. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Experiences</h1>
          <p className="text-muted-foreground mt-1">Manage your experiences and their schedules.</p>
        </div>
        <div className="flex items-center gap-3">
          {organizer && (
            <Button variant="outline" onClick={() => window.open(`/${organizer.slug}`, '_blank')}>
              View Storefront
            </Button>
          )}
          <Button onClick={() => router.push('/experiences/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </div>
      </div>

      {(!experiences || experiences.length === 0) ? (
        <EmptyState
          icon={MapPin}
          title="No experiences found"
          description="You haven't created any experiences yet."
          action={
            <Button onClick={() => router.push('/experiences/new')}>
              Create Experience
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <Card key={exp._id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-1">{exp.title}</CardTitle>
                  <Badge variant={exp.status === 'published' ? 'default' : 'outline'}>
                    {exp.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                  {exp.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <IndianRupee className="w-4 h-4 mr-2" />
                    <span>{(exp.price / 100).toFixed(2)} INR</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{exp.duration} mins</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="capitalize">{exp.location?.type || 'Not specified'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => router.push(`/experiences/${exp._id}`)}>
                    Manage
                </Button>
                {organizer && exp.status === 'published' && (
                  <Button variant="outline" size="icon" title="View on Storefront" onClick={() => window.open(`/${organizer.slug}/${exp._id}`, '_blank')}>
                    <ExternalLink className="w-4 h-4 text-warm-600" />
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50" 
                  title="Delete Experience"
                  disabled={deletingId === exp._id}
                  onClick={() => handleDelete(exp._id, exp.title)}
                >
                  {deletingId === exp._id ? <Spinner className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
