"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExperience, useUpdateExperience, useDeleteExperience } from "@/hooks/use-experiences";
import { useSchedules, useCreateSchedule, useDeleteSchedule, useRescheduleSchedule } from "@/hooks/use-schedules";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, CalendarPlus, Clock, Plus, Edit } from "lucide-react";
import Link from "next/link";

export default function ExperienceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: experience, isLoading: isLoadingExp } = useExperience(id);
  const { mutateAsync: updateExperience, isPending: isUpdating } = useUpdateExperience();
  const { mutateAsync: deleteExp, isPending: isDeletingExp } = useDeleteExperience();
  
  const { data: schedules, isLoading: isLoadingSchedules } = useSchedules({ experienceId: id });
  const { mutateAsync: createSchedule, isPending: isCreatingSchedule } = useCreateSchedule();
  const { mutateAsync: deleteSchedule } = useDeleteSchedule();
  const { mutateAsync: rescheduleSchedule, isPending: isRescheduling } = useRescheduleSchedule();

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
    offers: [] as { minQuantity: number; discountPercentage: number }[],
  });

  const [newSchedule, setNewSchedule] = useState({
    sessions: [{ startAt: "", endAt: "" }],
    capacity: "10",
  });

  const [expError, setExpError] = useState<string | null>(null);
  const [expSuccess, setExpSuccess] = useState<string | null>(null);
  const [schedError, setSchedError] = useState<string | null>(null);
  const [schedSuccess, setSchedSuccess] = useState<string | null>(null);

  const [rescheduleData, setRescheduleData] = useState<{ id: string, sessions: { startAt: string; endAt: string }[], capacity: string } | null>(null);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const [rescheduleSuccess, setRescheduleSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (experience) {
      setFormData({
        title: experience.title,
        description: experience.description,
        price: (experience.price / 100).toString(),
        duration: experience.duration.toString(),
        locationType: experience.location.type,
        address: experience.location.address || "",
        mapUrl: experience.location.mapUrl || "",
        status: experience.status,
        images: experience.images || [],
        offers: experience.offers || [],
      });
    }
  }, [experience]);

  if (isLoadingExp) {
    return (
      <div className="flex justify-center p-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="p-8 text-center text-red-500">
        Experience not found.
      </div>
    );
  }

  const handleUpdateExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setExpError(null);
    setExpSuccess(null);
    try {
      const priceInPaise = Math.round(parseFloat(formData.price) * 100);
      await updateExperience({
        id,
        data: {
          title: formData.title,
          description: formData.description,
          price: priceInPaise,
          duration: parseInt(formData.duration, 10),
          location: {
            type: formData.locationType as "physical" | "online" | "hybrid",
            address: formData.address || undefined,
            mapUrl: formData.mapUrl || undefined,
          },
          status: formData.status as "draft" | "published" | "archived" | "past",
          images: formData.images,
          offers: formData.offers,
        },
      });
      setExpSuccess("Experience updated successfully");
      setTimeout(() => setExpSuccess(null), 3000);
    } catch (err: any) {
      setExpError(err.message || "Failed to update experience");
    }
  };

  const handleDeleteExperience = async () => {
    if (confirm(`Are you sure you want to completely delete "${experience.title}"? This cannot be undone.`)) {
      try {
        await deleteExp(id);
        router.push("/experiences");
      } catch (err: any) {
        setExpError(err.message || "Failed to delete experience");
      }
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSchedError(null);
    setSchedSuccess(null);
    if (newSchedule.sessions.length === 0) {
      setSchedError("Please add at least one session");
      return;
    }

    try {
      const sortedSessions = [...newSchedule.sessions].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
      
      const firstSession = sortedSessions[0];
      const lastSession = sortedSessions[sortedSessions.length - 1];
      
      if (!firstSession || !lastSession) return;

      const rootStartAt = new Date(firstSession.startAt);
      const rootEndAt = new Date(lastSession.endAt);

      await createSchedule({
        experienceId: id,
        startAt: rootStartAt as any,
        endAt: rootEndAt as any,
        sessions: sortedSessions.map(s => ({
          startAt: new Date(s.startAt) as any,
          endAt: new Date(s.endAt) as any
        })),
        capacity: Number(newSchedule.capacity)
      });
      setNewSchedule({ sessions: [{ startAt: "", endAt: "" }], capacity: "" });
      setSchedSuccess("Schedule added");
      setTimeout(() => setSchedSuccess(null), 3000);
    } catch (err: any) {
      setSchedError(err.message || "Failed to add schedule");
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (confirm("Are you sure you want to cancel this schedule? If there are active bookings, customers will receive an automated cancellation email and you will need to process their refunds.")) {
      try {
        await deleteSchedule(scheduleId);
        setSchedSuccess("Schedule cancelled successfully");
        setTimeout(() => setSchedSuccess(null), 3000);
      } catch (err: any) {
        setSchedError(err.message || "Failed to delete schedule");
      }
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleData) return;
    setRescheduleError(null);
    setRescheduleSuccess(null);
    if (rescheduleData.sessions.length === 0) {
      setRescheduleError("Please add at least one session");
      return;
    }

    try {
      const sortedSessions = [...rescheduleData.sessions].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
      await rescheduleSchedule({
        id: rescheduleData.id,
        sessions: sortedSessions.map(s => ({
          startAt: new Date(s.startAt).toISOString(),
          endAt: new Date(s.endAt).toISOString()
        }))
      });
      setRescheduleSuccess("Schedule updated and customers notified!");
      setTimeout(() => {
        setRescheduleSuccess(null);
        setRescheduleData(null);
      }, 2000);
    } catch (err: any) {
      setRescheduleError(err.message || "Failed to reschedule");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" type="button" onClick={() => router.push('/experiences')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Edit Experience</h1>
            <p className="text-muted-foreground mt-1">Manage details and schedules for {experience.title}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="text-red-600 border-red-200 hover:bg-red-50" 
          onClick={handleDeleteExperience}
          disabled={isDeletingExp}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {isDeletingExp ? "Deleting..." : "Delete Experience"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Experience Details</CardTitle>
            </CardHeader>
            <form onSubmit={handleUpdateExperience}>
              <CardContent className="space-y-6">
                {expError && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-sm whitespace-pre-wrap">
                    {expError}
                  </div>
                )}
                {expSuccess && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 text-sm">
                    {expSuccess}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
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

                <div className="space-y-4 pt-4 border-t border-warm-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Bulk Booking Offers</label>
                      <p className="text-xs text-muted-foreground">Offer percentage discounts when customers book multiple tickets (e.g. Duo or Trio offers).</p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setFormData({ ...formData, offers: [...formData.offers, { minQuantity: 2, discountPercentage: 10 }] })}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Offer
                    </Button>
                  </div>
                  
                  {formData.offers.length > 0 ? (
                    <div className="space-y-3">
                      {formData.offers.map((offer, idx) => (
                        <div key={idx} className="flex gap-4 items-end bg-warm-50 p-3 rounded-lg border border-warm-100">
                          <div className="flex-1 space-y-2">
                            <label className="text-xs font-medium">Minimum Tickets</label>
                            <Input 
                              type="number" 
                              min="2" 
                              required 
                              value={offer.minQuantity} 
                              onChange={(e) => {
                                const newOffers = [...formData.offers];
                                newOffers[idx]!.minQuantity = e.target.value === '' ? ('' as any) : parseInt(e.target.value);
                                setFormData({ ...formData, offers: newOffers });
                              }}
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <label className="text-xs font-medium">Discount (%)</label>
                            <Input 
                              type="number" 
                              min="1" 
                              max="100" 
                              required 
                              value={offer.discountPercentage} 
                              onChange={(e) => {
                                const newOffers = [...formData.offers];
                                newOffers[idx]!.discountPercentage = e.target.value === '' ? ('' as any) : parseInt(e.target.value);
                                setFormData({ ...formData, offers: newOffers });
                              }}
                            />
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="mb-0.5 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              const newOffers = formData.offers.filter((_, i) => i !== idx);
                              setFormData({ ...formData, offers: newOffers });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                      No bulk offers added.
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarPlus className="w-5 h-5" />
                Schedules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSchedule} className="space-y-4">
                {schedError && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-sm whitespace-pre-wrap mb-4">
                    {schedError}
                  </div>
                )}
                {schedSuccess && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 text-sm mb-4">
                    {schedSuccess}
                  </div>
                )}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Sessions (Dates & Times)</label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setNewSchedule({ 
                        ...newSchedule, 
                        sessions: [...newSchedule.sessions, { startAt: "", endAt: "" }] 
                      })}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Session
                    </Button>
                  </div>
                  
                  {newSchedule.sessions.map((session, index) => (
                    <div key={index} className="flex flex-col gap-3 bg-muted/30 p-3 pt-8 sm:p-4 sm:pt-10 rounded-lg border border-dashed relative">
                      {newSchedule.sessions.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => {
                            const newSessions = newSchedule.sessions.filter((_, i) => i !== index);
                            setNewSchedule({ ...newSchedule, sessions: newSessions });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      <div className="w-full space-y-1.5">
                        <label className="text-xs font-medium text-foreground">Session {index + 1} Start</label>
                        <Input
                          required
                          type="datetime-local"
                          value={session.startAt}
                          className="w-full"
                          onChange={(e) => {
                            const newSessions = [...newSchedule.sessions];
                            newSessions[index]!.startAt = e.target.value;
                            setNewSchedule({ ...newSchedule, sessions: newSessions });
                          }}
                        />
                      </div>
                      <div className="w-full space-y-1.5">
                        <label className="text-xs font-medium text-foreground">Session {index + 1} End</label>
                        <Input
                          required
                          type="datetime-local"
                          value={session.endAt}
                          className="w-full"
                          onChange={(e) => {
                            const newSessions = [...newSchedule.sessions];
                            newSessions[index]!.endAt = e.target.value;
                            setNewSchedule({ ...newSchedule, sessions: newSessions });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Capacity</label>
                  <Input
                    required
                    type="number"
                    min="1"
                    value={newSchedule.capacity}
                    onChange={(e) => setNewSchedule({ ...newSchedule, capacity: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isCreatingSchedule}>
                  {isCreatingSchedule ? "Adding..." : "Add Schedule"}
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="space-y-8">
                {isLoadingSchedules ? (
                  <div className="flex justify-center p-4"><Spinner size="sm" /></div>
                ) : !schedules || schedules.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No schedules found.
                  </div>
                ) : (
                  <>
                    {/* Upcoming Schedules */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-sm text-foreground">Upcoming Schedules</h4>
                      </div>
                      {schedules.filter(s => new Date(s.endAt) >= new Date()).length === 0 ? (
                        <p className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-lg text-center border border-dashed">No upcoming schedules.</p>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {schedules.filter(s => new Date(s.endAt) >= new Date()).map((schedule) => (
                            <div key={schedule._id} className="flex flex-col gap-3 p-4 border rounded-xl text-sm bg-white shadow-sm hover:shadow-md transition-shadow relative">
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex items-start gap-2 text-foreground font-medium">
                                  <Clock className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                                  <div className="flex flex-col leading-tight">
                                    <span>{new Date(schedule.startAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                    <span className="text-muted-foreground font-normal">{new Date(schedule.startAt).toLocaleTimeString([], { timeStyle: 'short' })}</span>
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                                  onClick={() => handleDeleteSchedule(schedule._id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <Separator className="bg-muted/50" />
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-col">
                                  <span className="text-xs text-muted-foreground mb-1">Status</span>
                                  <Badge variant="outline" className="text-xs font-medium px-2 py-0.5 rounded-full">
                                    {schedule.bookedCount} / {schedule.capacity} Booked
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" className="rounded-full px-4 text-warm-700" onClick={() => {
                                    setRescheduleData({
                                      id: schedule._id,
                                      capacity: schedule.capacity.toString(),
                                      sessions: schedule.sessions ? schedule.sessions.map((s: any) => ({
                                        startAt: new Date(s.startAt).toISOString().slice(0, 16),
                                        endAt: new Date(s.endAt).toISOString().slice(0, 16)
                                      })) : [{ startAt: "", endAt: "" }]
                                    });
                                  }}>
                                    <Edit className="w-3 h-3 mr-1" />
                                    Reschedule
                                  </Button>
                                  <Button variant="secondary" size="sm" className="rounded-full px-4" onClick={() => router.push(`/schedules/${schedule._id}/attendees`)}>
                                    Guest List
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Completed Schedules */}
                    {schedules.filter(s => new Date(s.endAt) < new Date()).length > 0 && (
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-sm text-muted-foreground">Completed Schedules</h4>
                        </div>
                        <div className="flex flex-col gap-4">
                          {schedules.filter(s => new Date(s.endAt) < new Date()).map((schedule) => (
                            <div key={schedule._id} className="flex flex-col gap-3 p-4 border rounded-xl text-sm bg-muted/20 opacity-80 relative">
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex items-start gap-2 text-muted-foreground font-medium">
                                  <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                                  <div className="flex flex-col leading-tight">
                                    <span className="line-through">{new Date(schedule.startAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                    <span className="font-normal">{new Date(schedule.startAt).toLocaleTimeString([], { timeStyle: 'short' })}</span>
                                  </div>
                                </div>
                                <Badge variant="default" className="text-[10px] uppercase tracking-wider bg-gray-200 text-gray-700 shrink-0 rounded-sm hover:bg-gray-200">Completed</Badge>
                              </div>
                              <Separator className="bg-muted/50" />
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-col">
                                  <span className="text-xs text-muted-foreground mb-1">Status</span>
                                  <span className="text-xs font-medium text-muted-foreground">
                                    {schedule.bookedCount} / {schedule.capacity} Booked
                                  </span>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-full px-4" onClick={() => router.push(`/schedules/${schedule._id}/attendees`)}>
                                  Guest List
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {rescheduleData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-warm-100 flex items-center justify-between">
              <h3 className="font-semibold">Reschedule Event</h3>
              <Button variant="ghost" size="icon" onClick={() => setRescheduleData(null)}>
                <Plus className="w-4 h-4 rotate-45" />
              </Button>
            </div>
            <form onSubmit={handleRescheduleSubmit} className="p-4 space-y-4">
              <p className="text-sm text-warm-600 bg-orange-50 border border-orange-100 p-3 rounded-lg mb-4">
                Updating the dates will automatically send an email notification to all booked customers. (Please advise them to check their spam/junk folder).
              </p>
              
              {rescheduleError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-100 text-sm whitespace-pre-wrap">
                  {rescheduleError}
                </div>
              )}
              {rescheduleSuccess && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-100 text-sm">
                  {rescheduleSuccess}
                </div>
              )}

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {rescheduleData.sessions.map((session, index) => (
                  <div key={index} className="flex flex-col gap-2 p-3 border rounded-lg bg-warm-50 relative">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">Session {index + 1}</span>
                      {rescheduleData.sessions.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 text-warm-500 hover:text-red-500 hover:bg-red-50"
                          onClick={() => {
                            setRescheduleData(prev => {
                              if (!prev) return null;
                              const newSessions = [...prev.sessions];
                              newSessions.splice(index, 1);
                              return { ...prev, sessions: newSessions };
                            });
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Start</label>
                        <Input 
                          type="datetime-local" 
                          required 
                          value={session.startAt}
                          onChange={(e) => {
                            setRescheduleData(prev => {
                              if (!prev) return null;
                              const newSessions = [...prev.sessions];
                              if (!newSessions[index]) return prev;
                              newSessions[index] = { ...newSessions[index], startAt: e.target.value };
                              return { ...prev, sessions: newSessions };
                            });
                          }}
                          className="text-sm h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">End</label>
                        <Input 
                          type="datetime-local" 
                          required 
                          value={session.endAt}
                          onChange={(e) => {
                            setRescheduleData(prev => {
                              if (!prev) return null;
                              const newSessions = [...prev.sessions];
                              if (!newSessions[index]) return prev;
                              newSessions[index] = { ...newSessions[index], endAt: e.target.value };
                              return { ...prev, sessions: newSessions };
                            });
                          }}
                          className="text-sm h-9"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full text-xs" 
                onClick={() => setRescheduleData(prev => prev ? {
                  ...prev,
                  sessions: [...prev.sessions, { startAt: "", endAt: "" }]
                } : null)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Session
              </Button>

              <div className="pt-4 border-t border-warm-100 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setRescheduleData(null)}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={isRescheduling}>
                  {isRescheduling ? <Spinner size="sm" className="mr-2" /> : null}
                  Update & Notify
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
