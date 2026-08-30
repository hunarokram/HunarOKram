'use client';
import { useEffect, useState } from 'react';
import { Paywall } from '@/components/ui/paywall';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, CalendarCheck, IndianRupee, TrendingUp, Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(res => {
        if (res.data) setData(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-warm-900">Analytics</h1>
        <p className="text-warm-500 mt-1">Track your storefront views, bookings, and revenue.</p>
      </div>

      <Paywall featureName="Analytics Dashboard" description="Upgrade to the Studio or Pro plan to unlock detailed revenue and booking insights.">
        {loading ? (
          <div className="flex justify-center items-center h-64 border rounded-xl bg-white border-warm-100">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-warm-200 shadow-sm">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warm-500">Storefront Views (30d)</p>
                    <h3 className="text-3xl font-bold text-warm-900 mt-1">{data?.totalViews || 0}</h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-warm-200 shadow-sm">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                    <CalendarCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warm-500">Total Bookings</p>
                    <h3 className="text-3xl font-bold text-warm-900 mt-1">{data?.totalBookings || 0}</h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-warm-200 shadow-sm">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <IndianRupee className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warm-500">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-warm-900 mt-1">₹{data?.totalRevenue?.toLocaleString() || 0}</h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CHART AREA */}
            <Card className="border-warm-200 shadow-sm">
              <CardHeader className="pb-2 border-b border-warm-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-warm-500" />
                  <CardTitle className="text-base text-warm-800">Views Over Time (Last 30 Days)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-64 flex items-end gap-1 sm:gap-2 w-full pt-4">
                  {data?.chartData?.map((day: any, i: number) => {
                    // Find max views to scale bars
                    const maxViews = Math.max(...data.chartData.map((d: any) => d.views), 10); // min 10 to avoid 0 height
                    const heightPercent = (day.views / maxViews) * 100;
                    
                    return (
                      <div key={i} className="group relative flex-1 flex flex-col justify-end items-center h-full">
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-warm-900 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-10">
                          {day.date}: {day.views} views
                        </div>
                        {/* Bar */}
                        <div 
                          className="w-full bg-brand-100 group-hover:bg-brand-400 rounded-t-sm transition-colors duration-300"
                          style={{ height: `${Math.max(heightPercent, 2)}%` }}
                        />
                        {/* X-axis labels (show only a few on small screens) */}
                        <div className="text-[10px] text-warm-400 mt-2 truncate w-full text-center hidden sm:block opacity-0 group-hover:opacity-100 absolute -bottom-6">
                          {day.date}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Paywall>
    </div>
  );
}