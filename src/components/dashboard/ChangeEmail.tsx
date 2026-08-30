'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle2 } from 'lucide-react';

export function ChangeEmail({ currentEmail }: { currentEmail: string }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail === currentEmail) {
      setError('This is already your email address');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/request-email-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'Failed to request email change');
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/verify-email-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'Invalid verification code');
      setSuccess(true);
      setStep(1);
      setNewEmail('');
      setOtp('');
      // Force a full refresh to update the global state/user context
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 border p-4 rounded-xl bg-white shadow-sm border-warm-200">
      <div>
        <h4 className="text-sm font-semibold text-warm-900">Email Address</h4>
        <p className="text-xs text-warm-500">
          This is your login email and public contact email.
        </p>
      </div>

      {success && (
        <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center gap-2 border border-green-100">
          <CheckCircle2 className="w-4 h-4" /> Email updated successfully!
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequest} className="flex flex-col sm:flex-row gap-3">
          <Input 
            type="email" 
            required 
            placeholder={currentEmail}
            value={newEmail} 
            onChange={e => setNewEmail(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !newEmail}>
            {loading ? <Spinner className="w-4 h-4 mr-2" /> : null}
            Change Email
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-3">
          <div>
            <p className="text-xs text-warm-600 font-medium">Enter the 6-digit code sent to {newEmail}</p>
            <p className="text-[11px] text-warm-500 mt-0.5">Please also check your spam/junk folder.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input 
              type="text" 
              required 
              maxLength={6}
              placeholder="123456"
              value={otp} 
              onChange={e => setOtp(e.target.value)}
              className="flex-1 tracking-widest"
            />
            <Button type="submit" disabled={loading || otp.length !== 6}>
              {loading ? <Spinner className="w-4 h-4 mr-2" /> : null}
              Verify & Save
            </Button>
            <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
