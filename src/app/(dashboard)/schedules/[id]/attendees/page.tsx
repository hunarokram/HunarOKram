'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft, Users, CheckCircle2, Ticket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AttendeesPage() {
  const params = useParams();
  const router = useRouter();
  const scheduleId = params?.id as string;

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAttendees = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/bookings?scheduleId=${scheduleId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to load attendees');
      
      // We only care about confirmed bookings for attendance
      setBookings(data.data.filter((b: any) => b.status === 'confirmed'));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scheduleId) fetchAttendees();
  }, [scheduleId]);

  const handleCheckIn = async (bookingNumber: string, count: number) => {
    try {
      const res = await fetch('/api/bookings/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingNumber, checkInCount: count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Failed to check in');
      
      // Update local state
      setBookings(prev => prev.map(b => 
        b.bookingNumber === bookingNumber 
          ? { ...b, checkedInCount: (b.checkedInCount || 0) + count }
          : b
      ));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Spinner size="lg" /></div>;
  if (error) return <div className="p-12 text-center text-red-500">{error}</div>;

  const totalTickets = bookings.reduce((sum, b) => sum + (b.quantity || 1), 0);
  const checkedInTickets = bookings.reduce((sum, b) => sum + (b.checkedInCount || 0), 0);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Guest List</h1>
            <p className="text-muted-foreground mt-1">Manage attendees and check-ins</p>
          </div>
        </div>
        <Button onClick={() => router.push('/scanner')} className="bg-brand-600 hover:bg-brand-700 text-white">
          Open QR Scanner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-warm-50 border-warm-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full"><Users className="w-6 h-6 text-brand-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Guests</p>
              <p className="text-2xl font-bold">{totalTickets}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full"><CheckCircle2 className="w-6 h-6 text-green-600" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Checked In</p>
              <p className="text-2xl font-bold text-green-700">{checkedInTickets}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-warm-50 border-warm-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full"><Ticket className="w-6 h-6 text-orange-500" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Arrival</p>
              <p className="text-2xl font-bold">{totalTickets - checkedInTickets}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendees</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No confirmed bookings for this session yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3">Booking Ref</th>
                    <th className="px-4 py-3">Customer ID</th>
                    <th className="px-4 py-3">Tickets</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => {
                    const checkedIn = booking.checkedInCount || 0;
                    const bookingQuantity = booking.quantity || 1;
                    const isFullyCheckedIn = checkedIn >= bookingQuantity;
                    const remaining = bookingQuantity - checkedIn;
                    
                    return (
                      <tr key={booking._id} className="border-b last:border-0">
                        <td className="px-4 py-3 font-medium">{booking.bookingNumber}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-sm text-[var(--text-main)]">{booking.customerId?.name || 'Unknown'}</p>
                            <p className="text-xs text-[var(--text-light)]">{booking.customerId?.email}</p>
                            {booking.customerId?.phone && <p className="text-xs text-[var(--text-light)]">{booking.customerId?.phone}</p>}
                          </div>
                        </td>
                        <td className="px-4 py-3">{bookingQuantity}</td>
                        <td className="px-4 py-3">
                          {isFullyCheckedIn ? (
                            <Badge variant="success">Checked In</Badge>
                          ) : checkedIn > 0 ? (
                            <Badge variant="warning">Partial ({checkedIn}/{bookingQuantity})</Badge>
                          ) : (
                            <Badge variant="outline">Pending</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          {!isFullyCheckedIn && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleCheckIn(booking.bookingNumber, 1)}>
                                +1 Check-in
                              </Button>
                              {remaining > 1 && (
                                <Button size="sm" onClick={() => handleCheckIn(booking.bookingNumber, remaining)}>
                                  Check-in All
                                </Button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
