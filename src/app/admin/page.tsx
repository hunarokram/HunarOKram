'use client';
import { useState, useEffect } from 'react';
import { ShieldAlert, Check, X, ShieldCheck, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [organizers, setOrganizers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logoutAsync } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutAsync();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const [settings, setSettings] = useState<any>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');

  const fetchOrganizersAndStats = async () => {
    try {
      const [res, statsRes, settingsRes] = await Promise.all([
        fetch('/api/admin/organizers'),
        fetch('/api/admin/stats'),
        fetch('/api/settings')
      ]);

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (res.status === 403) throw new Error('Forbidden: Only super admins can access this page.');
        throw new Error('Failed to load organizers');
      }

      const [data, statsData, settingsData] = await Promise.all([res.json(), statsRes.json(), settingsRes.json()]);
      setOrganizers(data.data);
      if (statsData.success) {
        setStats(statsData.data);
      }
      if (settingsData.success) {
        setSettings(settingsData.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setSettingsMessage('Settings saved successfully!');
        setTimeout(() => setSettingsMessage(''), 3000);
      } else {
        setSettingsMessage(data.error?.message || 'Failed to save');
      }
    } catch (err) {
      setSettingsMessage('Error saving settings');
    } finally {
      setSavingSettings(false);
    }
  };

  useEffect(() => {
    fetchOrganizersAndStats();
  }, []);

  const updateSubscription = async (organizerId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/organizers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizerId, subscriptionStatus: status })
      });
      
      if (!res.ok) throw new Error('Failed to update subscription');
      
      setOrganizers(orgs => orgs.map(org => 
        org._id === organizerId ? { ...org, subscriptionStatus: status } : org
      ));
      
      alert('Subscription updated successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="absolute top-6 right-6">
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center max-w-sm w-full">
          <h3 className="font-semibold text-gray-800 mb-2">Admin Setup</h3>
          <p className="text-xs text-gray-500 mb-4">Enter the Admin Secret Key to grant your account access.</p>
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const secret = formData.get('secret');
              const res = await fetch('/api/admin/make-me-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secret })
              });
              if (res.status === 401) {
                alert('You are currently logged out! Please log in first.');
                router.push('/login');
                return;
              }
              if (!res.ok) {
                alert('Invalid Secret Key');
                return;
              }
              window.location.reload();
            }}
            className="flex gap-2"
          >
            <input 
              name="secret" 
              type="password" 
              required
              placeholder="Secret Key" 
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-500 hover:text-red-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:border-red-200 hover:bg-red-50 transition-colors font-medium">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Total GMV</p>
              <h3 className="text-2xl font-bold text-gray-900">₹{(stats.gmv / 100).toLocaleString('en-IN')}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.bookings}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Organizers</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.organizers}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-1">Experiences</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.experiences}</h3>
            </div>
          </div>
        )}
        
        {/* Settings Panel */}
        {settings && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Configuration</h2>
            <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin UPI ID</label>
                <input
                  type="text"
                  required
                  value={settings.adminUpiId || ''}
                  onChange={(e) => setSettings({ ...settings, adminUpiId: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin UPI Name</label>
                <input
                  type="text"
                  required
                  value={settings.adminUpiName || ''}
                  onChange={(e) => setSettings({ ...settings, adminUpiName: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Price (₹)</label>
                <input
                  type="number"
                  required
                  value={settings.subscriptionPrice || ''}
                  onChange={(e) => setSettings({ ...settings, subscriptionPrice: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="md:col-span-3 flex items-center justify-end gap-4">
                {settingsMessage && (
                  <span className={`text-sm ${settingsMessage.includes('Error') || settingsMessage.includes('Failed') ? 'text-red-500' : 'text-green-600'} font-medium`}>
                    {settingsMessage}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {savingSettings && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-100 border-b border-gray-200 text-gray-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Organizer Name</th>
                  <th className="px-6 py-4 font-semibold">Total Revenue</th>
                  <th className="px-6 py-4 font-semibold">Experiences Created</th>
                  <th className="px-6 py-4 font-semibold">Current Plan</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {organizers.map((org) => {
                  const isExpired = org.subscriptionStatus === 'active' && org.subscriptionExpiresAt && new Date() > new Date(org.subscriptionExpiresAt);
                  const isPending = org.subscriptionStatus === 'pending_verification';
                  const isFree = !org.subscriptionStatus || org.subscriptionStatus === 'free' || isExpired;
                  
                  return (
                    <tr key={org._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{org.name}</div>
                        <div className="text-xs text-gray-500">{org.contact?.email}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-green-700">
                        ₹{((org.totalRevenue || 0) / 100).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          org.experiencesCount >= 2 && isFree ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {org.experiencesCount} workshops
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            isPending ? 'bg-blue-100 text-blue-800' : isFree ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {isPending ? 'Pending Verify' : isFree ? 'Free' : 'Creator'}
                          </span>
                          {!isFree && !isPending && org.subscriptionExpiresAt && (
                            <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                              Expires: {new Date(org.subscriptionExpiresAt).toLocaleDateString()}
                            </span>
                          )}
                          {isPending && org.subscriptionPaymentDetails && (
                            <div className="mt-1 flex flex-col gap-0.5 text-[10px] text-gray-600 border border-blue-100 bg-blue-50/50 p-1.5 rounded w-full">
                              <span className="font-semibold text-blue-900">UTR: {org.subscriptionPaymentDetails.transactionId}</span>
                              <span>{org.subscriptionPaymentDetails.name} • {org.subscriptionPaymentDetails.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {isPending && org.subscriptionPaymentScreenshotUrl && (
                          <a 
                            href={org.subscriptionPaymentScreenshotUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-block text-xs font-semibold bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md transition-colors"
                          >
                            View Receipt
                          </a>
                        )}
                        <a 
                          href={`/domain/${org.slug}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-block text-xs font-semibold bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md transition-colors"
                        >
                          View Store
                        </a>
                        {(isFree || isPending) ? (
                          <button
                            onClick={() => updateSubscription(org._id, 'active')}
                            className="inline-block text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md transition-colors"
                          >
                            {isPending ? 'Approve & Grant' : 'Grant Sub'}
                          </button>
                        ) : (
                          <button
                            onClick={() => updateSubscription(org._id, 'free')}
                            className="inline-block text-xs font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-md transition-colors"
                          >
                            Revoke Sub
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {organizers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No organizers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
