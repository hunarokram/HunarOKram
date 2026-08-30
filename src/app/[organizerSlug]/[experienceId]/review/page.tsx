"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating');
      return;
    }
    if (!customerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experienceId: params.experienceId,
          rating,
          comment,
          customerName,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit review');
      
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-[#edeae4] p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-serif text-[#2c2a27]">Thank you!</h1>
          <p className="text-[#8a8782]">Your review has been successfully submitted and will help others discover this experience.</p>
          <Button 
            className="w-full mt-6 bg-[#2c2a27] text-white hover:bg-[#1a1815]" 
            onClick={() => router.push(`/${params.organizerSlug}/${params.experienceId}`)}
          >
            Back to Experience
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-[#edeae4] overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-serif text-[#2c2a27] mb-2">Leave a Review</h1>
          <p className="text-sm text-[#8a8782] mb-8">How was your experience? Your feedback is incredibly valuable.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Star Rating */}
            <div className="space-y-2 text-center">
              <label className="block text-sm font-semibold text-[#2c2a27]">Rating</label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transition-transform hover:scale-110"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star 
                      className={`w-10 h-10 transition-colors ${
                        (hoverRating || rating) >= star 
                          ? 'fill-amber-400 text-amber-400' 
                          : 'text-[#e0dbd3]'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#edeae4]">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#2c2a27]">Your Name</label>
                <Input 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="bg-[#faf9f7]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#2c2a27]">Review <span className="text-[#8a8782] font-normal">(Optional)</span></label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you loved about it..."
                  rows={4}
                  className="w-full rounded-xl border border-[#edeae4] bg-[#faf9f7] px-4 py-3 text-sm text-[#2c2a27] placeholder:text-[#b0aca6] focus:outline-none focus:border-[#2c2a27] focus:ring-2 focus:ring-[#2c2a27]/10 transition-all resize-none"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-6 text-base font-semibold bg-[#2c2a27] hover:bg-[#1a1815] rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
