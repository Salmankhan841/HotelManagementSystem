import React, { useEffect, useState } from 'react';
import { Search, CheckCircle, XCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import useBookingStore from '../../store/useBookingStore';
import toast from 'react-hot-toast';

const getStatusColor = (status) => {
  switch (status) {
    case 'Confirmed': return 'bg-green-100 text-green-800 border-green-200';
    case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Checked In': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Checked Out': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPaymentColor = (paymentStatus) => {
  switch (paymentStatus) {
    case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Refunded': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Failed': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-amber-50 text-amber-700 border-amber-200';
  }
};

const AdminBookings = () => {
  const { bookings, fetchAllBookings, updateBookingStatus, cancelBooking, isLoading } = useBookingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  const handleRefresh = () => {
    fetchAllBookings();
    toast.success('Reservations list refreshed');
  };

  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const filteredBookings = safeBookings.filter(b => {
    // Status filter
    if (statusFilter !== 'All' && b?.status !== statusFilter) {
      return false;
    }

    // Search filter
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    const guestName = b?.user?.name?.toLowerCase() || '';
    const guestEmail = b?.user?.email?.toLowerCase() || '';
    const roomNumber = b?.room?.roomNumber?.toString().toLowerCase() || '';
    const roomName = b?.room?.name?.toLowerCase() || '';
    const txnId = b?.transactionId?.toLowerCase() || '';

    return guestName.includes(term) || 
           guestEmail.includes(term) || 
           roomNumber.includes(term) || 
           roomName.includes(term) || 
           txnId.includes(term);
  });

  const handleStatusChange = async (id, newStatus) => {
    const res = await updateBookingStatus(id, newStatus);
    if (res.success) toast.success(`Status updated to ${newStatus}`);
    else toast.error(res.error);
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const res = await cancelBooking(id);
      if (res.success) toast.success('Booking cancelled');
      else toast.error(res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations & Payments</h1>
          <p className="text-gray-500 text-sm">All guest bookings, Stripe transactions, and check-in statuses in real time.</p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors shadow-sm w-fit"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-gold-600' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by guest, email, room #, txn ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-gray-900 focus:border-gray-900 text-sm"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {['All', 'Confirmed', 'Pending', 'Checked In', 'Checked Out', 'Cancelled'].map(filter => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  statusFilter === filter
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Guest</th>
                <th className="px-6 py-4 font-semibold">Suite</th>
                <th className="px-6 py-4 font-semibold">Stay Dates</th>
                <th className="px-6 py-4 font-semibold">Payment & Total</th>
                <th className="px-6 py-4 font-semibold">Reservation Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    Loading reservations...
                  </td>
                </tr>
              )}
              {!isLoading && filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
                    No reservations found matching your criteria.
                  </td>
                </tr>
              )}
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                  
                  {/* Guest Info */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{booking.user?.name || 'Guest User'}</div>
                    <div className="text-xs text-gray-500">{booking.user?.email || 'N/A'}</div>
                  </td>

                  {/* Room Info */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">Room {booking.room?.roomNumber || 'N/A'}</div>
                    <div className="text-xs text-gold-700 font-medium">{booking.room?.name || booking.room?.type || 'Suite'}</div>
                  </td>

                  {/* Dates */}
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-gray-900">
                      {new Date(booking.checkIn).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      &rarr; {new Date(booking.checkOut).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>

                  {/* Payment */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-base">${booking.totalAmount}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${getPaymentColor(booking.paymentStatus || 'Paid')}`}>
                        <ShieldCheck className="h-3 w-3" />
                        {booking.paymentStatus || 'Paid'}
                      </span>
                    </div>
                    {booking.transactionId && (
                      <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                        {booking.transactionId}
                      </div>
                    )}
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-6 py-4">
                    <select 
                      value={booking.status} 
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border cursor-pointer focus:ring-0 focus:outline-none ${getStatusColor(booking.status)}`}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Checked In">Checked In</option>
                      <option value="Checked Out">Checked Out</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Quick Action Buttons */}
                  <td className="px-6 py-4 flex items-center justify-end gap-2 mt-2">
                    <button 
                      onClick={() => handleStatusChange(booking._id, 'Confirmed')} 
                      className="text-gray-400 hover:text-green-600 transition-colors p-1" 
                      title="Mark Confirmed"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleCancel(booking._id)} 
                      className="text-gray-400 hover:text-red-600 transition-colors p-1" 
                      title="Cancel Booking"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminBookings;
