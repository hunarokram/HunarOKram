'use client';
import { useState } from 'react';
import { useOrganizerReviews, useCreateManualReview } from '@/hooks/use-reviews';
import { Spinner } from '@/components/ui/spinner';
import { Star, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paywall } from '@/components/ui/paywall';

export default function ReviewsPage() {
  const { data: reviews, isLoading } = useOrganizerReviews();
  const createManualReview = useCreateManualReview();
  
  const [showForm, setShowForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!customerName.trim()) {
      setError('Name is required');
      return;
    }
    if (rating < 1 || rating > 5) {
      setError('Rating must be between 1 and 5');
      return;
    }

    try {
      await createManualReview.mutateAsync({ customerName, rating, comment });
      setShowForm(false);
      setCustomerName('');
      setRating(5);
      setComment('');
    } catch (err: any) {
      setError(err.message || 'Failed to add review');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-warm-900">Reviews</h1>
          <p className="text-warm-500 mt-1">See what your customers are saying.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-brand-600 hover:bg-brand-700 text-white"
        >
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? 'Cancel' : 'Add Manual Review'}
        </Button>
      </div>

      <Paywall featureName="Reviews Management" description="Upgrade to unlock customer reviews and build trust on your storefront.">
        {showForm && (
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-lg font-semibold text-warm-900 mb-4">Add a Past Review</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
              {error && <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>}
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-warm-800">Customer Name</label>
                <Input 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  placeholder="e.g. Priya Sharma" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-warm-800">Rating (1-5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star className={`w-8 h-8 ${rating >= star ? 'fill-amber-400 text-amber-400' : 'text-warm-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-warm-800">Comment (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did they say about their experience?"
                  rows={3}
                  className="w-full rounded-lg border border-warm-200 bg-warm-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>

              <Button type="submit" disabled={createManualReview.isPending} className="bg-brand-600 hover:bg-brand-700 text-white">
                {createManualReview.isPending ? 'Saving...' : 'Save Review'}
              </Button>
            </form>
          </div>
        )}

        <div className="border border-warm-100 rounded-xl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-warm-50/70 text-warm-800 border-b border-warm-100">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wide text-xs">Customer</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wide text-xs">Rating</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wide text-xs">Comment</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wide text-xs">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-warm-400">
                    <Spinner size="sm" className="mx-auto" />
                  </td>
                </tr>
              ) : !reviews?.length ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-warm-400">
                    No reviews yet. Add a past review to get started!
                  </td>
                </tr>
              ) : (
                reviews.map((review: any) => (
                  <tr key={review._id} className="hover:bg-warm-50/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-warm-900 whitespace-nowrap">{review.customerName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-3.5 h-3.5 ${review.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-warm-200'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-warm-600 truncate">{review.comment || '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-warm-400 text-xs whitespace-nowrap">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Paywall>
    </div>
  );
}