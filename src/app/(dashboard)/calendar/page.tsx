'use client';
import { EmptyState } from '@/components/ui/empty-state';
import { Calendar } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground mt-1">View your upcoming schedule.</p>
      </div>
      <EmptyState
        icon={Calendar}
        title="Coming Soon"
        description="The calendar view is currently under construction. Please manage schedules inside your Experience settings."
      />
    </div>
  );
}