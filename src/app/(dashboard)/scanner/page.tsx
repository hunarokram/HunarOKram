'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { QrCode, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const Scanner = dynamic(() => import('@/components/Scanner'), { ssr: false });

export default function ScannerPage() {
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleScanSuccess = async (decodedText: string) => {
    if (decodedText === lastScanned && status !== 'error') return; // Prevent spamming same code
    
    setLastScanned(decodedText);
    setStatus('loading');
    setMessage('Verifying booking...');

    try {
      const res = await fetch('/api/bookings/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingNumber: decodedText, checkInCount: 1 }), // Default checks in 1 person
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to check in');
      }

      setStatus('success');
      setMessage(`Checked in 1 attendee for booking ${decodedText} (Total: ${data.data.checkedInCount}/${data.data.quantity})`);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
          <QrCode className="w-8 h-8" />
          Ticket Scanner
        </h1>
        <p className="text-muted-foreground mt-1">Scan customer E-Tickets to instantly check them in.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <Scanner onScanSuccess={handleScanSuccess} />
          
          <div className="mt-8 text-center min-h-[100px]">
            {status === 'idle' && (
              <p className="text-muted-foreground">Point your camera at a ticket QR code...</p>
            )}
            
            {status === 'loading' && (
              <div className="flex flex-col items-center gap-2 text-blue-600">
                <Spinner size="md" />
                <p className="font-medium">{message}</p>
              </div>
            )}
            
            {status === 'success' && (
              <div className="flex flex-col items-center gap-2 text-green-600">
                <CheckCircle2 className="w-12 h-12" />
                <p className="font-medium text-lg">{message}</p>
                <Button variant="outline" className="mt-2" onClick={() => setStatus('idle')}>Scan Next</Button>
              </div>
            )}
            
            {status === 'error' && (
              <div className="flex flex-col items-center gap-2 text-red-600">
                <XCircle className="w-12 h-12" />
                <p className="font-medium text-lg">{message}</p>
                <Button variant="outline" className="mt-2" onClick={() => setStatus('idle')}>Try Again</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
