import React from 'react';
import {
  FileText,
  CalendarDays,
  CreditCard,
  TrendingUp,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import StatsCard from './StatsCard';

const StatsGrid = ({ bookings, totalSpent }) => {
  const upcomingTrips = bookings.filter(
    (b) => new Date(b.date) > new Date() && b.status === 'confirmed'
  ).length;

  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  const stats = [
    {
      title: 'Total Trips',
      value: bookings.length,
      icon: FileText,
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Upcoming',
      value: upcomingTrips,
      icon: CalendarDays,
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Spent',
      value: `₹${totalSpent.toLocaleString()}`,
      icon: CreditCard,
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Confirmed',
      value: confirmedCount,
      icon: CheckCircle,
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Cancelled',
      value: cancelledCount,
      icon: XCircle,
      bgColor: 'bg-red-50',
    },
    {
      title: 'Saved',
      value: '12%',
      icon: TrendingUp,
      bgColor: 'bg-amber-50',
      change: '+5% this month',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;
