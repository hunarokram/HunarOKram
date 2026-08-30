'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        throw new Error('An unexpected server error occurred. Please try again.');
      }

      if (!res.ok) {
        if (data?.error?.details) {
          const detailMessages = Object.values(data.error.details).flat();
          throw new Error(detailMessages.join(', '));
        }
        throw new Error(data?.error?.message || 'Failed to login');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#faf9f6] p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        <Card className="w-full shadow-lg border-0">
          <CardHeader className="space-y-2 text-center pt-8">
            <CardTitle className="text-3xl font-serif text-[#2d2a26]">Welcome Back</CardTitle>
            <CardDescription className="text-[#686662] text-base">
              Log in to manage your experiences and bookings.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-4">
              {error && (
                <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-100">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2d2a26]">Email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#2d2a26]">Password</label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-white"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-8 pt-4">
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? <Spinner className="mr-2" /> : null}
                Log In
              </Button>
              <p className="text-sm text-center text-[#686662]">
                Don't have an account?{' '}
                <Link href="/register" className="text-[#a37e5c] hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}