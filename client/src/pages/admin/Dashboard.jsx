import React, { useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { Users, DollarSign, BedDouble, CalendarCheck, ShieldCheck } from 'lucide-react';
import useBookingStore from '../../store/useBookingStore';
import useRoomStore from '../../store/useRoomStore';
import useUserStore from '../../store/useUserStore';

const data = [
  { name: 'Mon', revenue: 4000, bookings: 4 },
  { name: 'Tue', revenue: 3000, bookings: 3 },
  { name: 'Wed', revenue: 2000, bookings: 2 },
  { name: 'Thu', revenue: 2780, bookings: 3 },
  { name: 'Fri', revenue: 6890, bookings: 7 },
  { name: 'Sat', revenue: 8390, bookings: 9 },
  { name: 'Sun', revenue: 7490, bookings: 8 },
];

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</h3>
      <p className={`text-xs mt-2 font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-gray-500'}`}>
        {trend}
      </p>
    </div>
    <div className="bg-gold-50 p-3.5 rounded-xl text-gold-600">
      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
    </div>
  </div>
);

const Dashboard = () => {
  const { bookings, fetchAllBookings, isLoading } = useBookingStore();
  const { rooms, fetchRooms } = useRoomStore();
  const { users, fetchUsers } = useUserStore();

  useEffect(() => {
    fetchAllBookings();
    fetchRooms();
    fetchUsers();
  }, [fetchAllBookings, fetchRooms, fetchUsers]);

  // Calculate live revenue from verified bookings (Defensive array checks)
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const safeUsers = Array.isArray(users) ? users : [];
  const safeRooms = Array.isArray(rooms) ? rooms : [];

  const totalRevenue = safeBookings.reduce((sum, b) => sum + (b?.totalAmount || 0), 0);
  const activeBookingsCount = safeBookings.filter(b => b?.status !== 'Cancelled').length;
  const guestCount = safeUsers.filter(u => u?.role === 'guest').length;

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">Welcome back to LuxuryStay Management. Real-time statistics across all channels.</p>
      </div>

      {/* Stats Grid - Responsive 1/2/4 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} trend="+18.4% this month" />
        <StatCard title="Total Reservations" value={activeBookingsCount.toString()} icon={CalendarCheck} trend="Live Reservations" />
        <StatCard title="Registered VIP Guests" value={guestCount.toString()} icon={Users} trend="Live Directory" />
        <StatCard title="Available Suites" value={safeRooms.length.toString()} icon={BedDouble} trend="Active Inventory" />
      </div>

      {/* Charts Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-4">Weekly Revenue Trend</h3>
          <div className="h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#d18131" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-4">Weekly Booking Volume</h3>
          <div className="h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{fill: '#fbf3e5'}}
                />
                <Bar dataKey="bookings" fill="#111827" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Recent Bookings Table */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-base font-bold text-gray-900 mb-4">Latest Guest Reservations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg font-semibold">Guest</th>
                <th className="px-4 py-3 font-semibold">Suite</th>
                <th className="px-4 py-3 font-semibold">Dates</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 rounded-tr-lg font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-6 text-gray-400">Loading activity...</td></tr>
              ) : safeBookings.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-6 text-gray-400">No reservations recorded yet.</td></tr>
              ) : (
                safeBookings.slice(0, 5).map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3.5 font-medium text-gray-900">
                      <div>{b.user?.name || 'Guest User'}</div>
                      <div className="text-[11px] text-gray-400 font-normal">{b.user?.email}</div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700">Room {b.room?.roomNumber || 'N/A'}</td>
                    <td className="px-4 py-3.5 text-gray-600 text-xs">
                      {new Date(b.checkIn).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} &rarr; {new Date(b.checkOut).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-gray-900">${b.totalAmount}</td>
                    <td className="px-4 py-3.5">
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
