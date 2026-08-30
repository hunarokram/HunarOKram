import { useQuery, useMutation } from '@tanstack/react-query';
import { CreateBookingInput } from '@/schemas/booking.schema';

export type Booking = {
  _id: string;
  bookingNumber: string;
  organizerId: string;
  experienceId: string;
  scheduleId: string;
  customerId: string;
  status: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

async function fetchBookings(): Promise<Booking[]> {
  const res = await fetch('/api/bookings');
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch bookings');
  return json.data;
}

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });
}

async function createBooking(data: CreateBookingInput): Promise<Booking> {
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to create booking');
  return json.data;
}

async function fetchBooking(organizerId: string, bookingNumber: string): Promise<Booking> {
  const url = new URL(`/api/bookings/${bookingNumber}`, window.location.origin);
  url.searchParams.append('organizerId', organizerId);
  const res = await fetch(url.toString());
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch booking');
  return json.data;
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: createBooking,
  });
}

export function useBooking(organizerId: string, bookingNumber: string) {
  return useQuery({
    queryKey: ['bookings', organizerId, bookingNumber],
    queryFn: () => fetchBooking(organizerId, bookingNumber),
    enabled: !!organizerId && !!bookingNumber,
  });
}
