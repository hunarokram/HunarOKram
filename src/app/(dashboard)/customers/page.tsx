'use client';
import { useCustomers } from '@/hooks/use-customers';
import { Spinner } from '@/components/ui/spinner';

export default function CustomersPage() {
  const { data: customers, isLoading } = useCustomers();

  if (isLoading) return <div className="p-12 flex justify-center"><Spinner /></div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Customers</h1>
        <p className="text-muted-foreground mt-1">View your customer directory.</p>
      </div>

      <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-warm-50 text-warm-800 border-b">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Phone</th>
              <th className="px-6 py-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {(customers || []).map((customer: any) => (
              <tr key={customer._id} className="border-b last:border-0 hover:bg-warm-50/50">
                <td className="px-6 py-4 font-medium">{customer.name || 'N/A'}</td>
                <td className="px-6 py-4">{customer.email}</td>
                <td className="px-6 py-4">{customer.phone || 'N/A'}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!customers || customers.length === 0) && (
          <div className="p-12 text-center text-muted-foreground">No customers found.</div>
        )}
      </div>
    </div>
  );
}