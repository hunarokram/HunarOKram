'use client';
import { useBookings } from '@/hooks/use-bookings';
import { Spinner } from '@/components/ui/spinner';
import { IndianRupee, CheckCircle2, Clock, XCircle, CalendarCheck, TrendingUp } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  confirmed: {
    label: 'Confirmed',
    color: 'bg-green-50 text-green-700 border-green-100',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  pending: {
    label: 'Pending',
    color: 'bg-amber-50 text-amber-700 border-amber-100',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-50 text-red-700 border-red-100',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-700 border-red-100',
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

export default function BookingsPage() {
  const { data: bookings, isLoading } = useBookings();

  if (isLoading) return <div className="p-12 flex justify-center"><Spinner /></div>;

  const confirmed = (bookings || []).filter((b: any) => b.status === 'confirmed');
  const totalRevenue = confirmed.reduce((sum: number, b: any) => sum + (b.amount || 0), 0);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-warm-900">Bookings</h1>
          <p className="text-warm-500 mt-1 text-sm">All customer bookings across your experiences.</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-warm-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-warm-900">{confirmed.length}</p>
            <p className="text-xs text-warm-500 mt-0.5">Confirmed Bookings</p>
          </div>
        </div>
        <div className="bg-white border border-warm-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-warm-900">₹{(totalRevenue / 100).toLocaleString('en-IN')}</p>
            <p className="text-xs text-warm-500 mt-0.5">Total Revenue</p>
          </div>
        </div>
        <div className="bg-white border border-warm-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-warm-900">{(bookings || []).length}</p>
            <p className="text-xs text-warm-500 mt-0.5">Total Bookings</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-warm-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-warm-100 flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-warm-400" />
          <span className="text-sm font-semibold text-warm-700">All Bookings</span>
          <span className="ml-auto text-xs text-warm-400">{(bookings || []).length} total</span>
        </div>
        {(!bookings || bookings.length === 0) ? (
          <div className="py-20 text-center">
            <div className="w-14 h-14 mx-auto bg-warm-50 rounded-2xl flex items-center justify-center mb-4">
              <CalendarCheck className="w-7 h-7 text-warm-300" />
            </div>
            <p className="text-warm-400 text-sm font-medium">No bookings yet</p>
            <p className="text-warm-300 text-xs mt-1">Bookings will appear here once customers book your experiences.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-warm-50/70 border-b border-warm-100">
                  <th className="px-6 py-3 text-xs font-semibold text-warm-500 uppercase tracking-wide">Booking #</th>
                  <th className="px-6 py-3 text-xs font-semibold text-warm-500 uppercase tracking-wide">Customer</th>
                  <th className="px-6 py-3 text-xs font-semibold text-warm-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-warm-500 uppercase tracking-wide">Amount</th>
                  <th className="px-6 py-3 text-xs font-semibold text-warm-500 uppercase tracking-wide">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-warm-500 uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-50">
                {(bookings || []).map((booking: any) => {
                  const status = statusConfig[booking.status] || {
                    label: booking.status,
                    color: 'bg-warm-50 text-warm-600 border-warm-100',
                    icon: null,
                  };
                  return (
                    <tr key={booking._id} className="hover:bg-warm-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-warm-900">{booking.bookingNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-warm-900">{booking.customerId?.name || 'Unknown User'}</span>
                          <span className="text-xs text-warm-500">{booking.customerId?.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                          {status.icon}
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 font-semibold text-warm-900">
                          <IndianRupee className="w-3.5 h-3.5 text-warm-400" />
                          {(booking.amount / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-warm-400 text-xs">
                        {new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(booking.createdAt))}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {booking.paymentMethod === 'manual' && booking.status === 'pending' && (
                          <div className="flex items-center justify-end gap-2">
                            {booking.paymentScreenshotUrl && (
                              <a 
                                href={booking.paymentScreenshotUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-xs text-brand-600 hover:text-brand-700 underline"
                              >
                                View Screenshot
                              </a>
                            )}
                            <button
                              onClick={async () => {
                                if (confirm('Are you sure you want to reject this booking? The user will be notified.')) {
                                  try {
                                    const res = await fetch(`/api/bookings/${booking._id}/reject`, { method: 'POST' });
                                    if (res.ok) {
                                      window.location.reload();
                                    } else {
                                      const err = await res.json();
                                      alert(err.error?.message || 'Failed to reject');
                                    }
                                  } catch (e) {
                                    alert('An error occurred');
                                  }
                                }
                              }}
                              className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded text-xs font-medium transition-colors border border-red-200"
                            >
                              Reject
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm('Are you sure you want to verify this payment and send the ticket?')) {
                                  try {
                                    const res = await fetch(`/api/bookings/${booking._id}/verify`, { method: 'POST' });
                                    if (res.ok) {
                                      window.location.reload();
                                    } else {
                                      const err = await res.json();
                                      alert(err.error?.message || 'Failed to verify');
                                    }
                                  } catch (e) {
                                    alert('An error occurred');
                                  }
                                }
                              }}
                              className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                            >
                              Verify
                            </button>
                          </div>
                        )}
                        {booking.paymentMethod === 'manual' && booking.status === 'confirmed' && (
                           <span className="text-xs text-green-600 font-medium">Verified</span>
                        )}
                        {booking.paymentMethod === 'manual' && booking.status === 'rejected' && (
                           <span className="text-xs text-red-600 font-medium">Rejected</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}