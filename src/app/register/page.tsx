'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data?.error?.details) {
          throw new Error(Object.values(data.error.details).flat().join(', '));
        }
        throw new Error(data?.error?.message || 'Failed to register');
      }

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
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'Invalid verification code');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setResendSuccess(false);
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed to resend OTP');
      setResendSuccess(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#faf9f6] p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" size="sm" onClick={() => step === 2 ? setStep(1) : router.push('/')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {step === 2 ? 'Back' : 'Back to Home'}
        </Button>
        <Card className="w-full shadow-lg border-0">
          <CardHeader className="space-y-2 text-center pt-8">
            <CardTitle className="text-3xl font-serif text-[#2d2a26]">
              {step === 1 ? 'Create an Account' : 'Verify Email'}
            </CardTitle>
            <CardDescription className="text-[#686662] text-base">
              {step === 1 
                ? 'Start hosting your workshops and experiences today.' 
                : (
                  <>
                    We've sent a 6-digit code to <span className="font-medium text-[#2d2a26]">{email}</span>.
                    <br />
                    <span className="text-sm text-[#a37e5c]">Please also check your spam/junk folder.</span>
                  </>
                )}
            </CardDescription>
          </CardHeader>
          
          {step === 1 ? (
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4 pt-4">
                {error && <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2d2a26]">Full Name</label>
                  <Input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="bg-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2d2a26]">Email</label>
                  <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="bg-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2d2a26]">Password</label>
                  <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-white" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pb-8 pt-4">
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? <Spinner className="mr-2" /> : null} Continue
                </Button>
                <p className="text-sm text-center text-[#686662]">
                  Already have an account? <Link href="/login" className="text-[#a37e5c] hover:underline font-medium">Log in</Link>
                </p>
              </CardFooter>
            </form>
          ) : (
            <form onSubmit={handleVerify}>
              <CardContent className="space-y-4 pt-4">
                {error && <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>}
                {resendSuccess && <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm border border-green-100">Verification code resent successfully!</div>}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#2d2a26]">Verification Code</label>
                  <Input 
                    type="text" 
                    required 
                    maxLength={6}
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    placeholder="123456" 
                    className="bg-white text-center text-xl tracking-widest" 
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pb-8 pt-4">
                <Button type="submit" className="w-full" size="lg" disabled={loading || otp.length !== 6}>
                  {loading ? <Spinner className="mr-2" /> : null} Verify & Create Account
                </Button>
                <p className="text-sm text-center text-[#686662]">
                  Didn't receive the code?{' '}
                  <button type="button" onClick={handleResend} className="text-[#a37e5c] hover:underline font-medium bg-transparent border-none p-0 cursor-pointer">
                    Resend OTP
                  </button>
                </p>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}