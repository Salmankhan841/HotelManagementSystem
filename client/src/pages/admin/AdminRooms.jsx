import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Trash2, X, Image as ImageIcon, Sparkles, 
  Wrench, CheckCircle2, UserCheck, Clock, Bookmark, 
  RefreshCw, ShieldAlert, BedDouble, Check, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import useRoomStore from '../../store/useRoomStore';
import useNotificationStore from '../../store/useNotificationStore';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Available':
      return {
        label: 'Available (Ready)',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        icon: CheckCircle2
      };
    case 'Occupied':
      return {
        label: 'Occupied (In-Use)',
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        icon: UserCheck
      };
    case 'Cleaning':
      return {
        label: 'Cleaning / Housekeeping',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        icon: Sparkles
      };
    case 'Inspection':
      return {
        label: 'Awaiting Inspection',
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        dot: 'bg-purple-500',
        icon: Clock
      };
    case 'Maintenance':
      return {
        label: 'Maintenance / Out of Order',
        bg: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-500',
        icon: Wrench
      };
    case 'Reserved':
      return {
        label: 'Reserved (VIP Hold)',
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dot: 'bg-indigo-500',
        icon: Bookmark
      };
    default:
      return {
        label: status || 'Available',
        bg: 'bg-gray-50 text-gray-700 border-gray-200',
        dot: 'bg-gray-400',
        icon: BedDouble
      };
  }
};

const AdminRooms = () => {
  const { rooms, fetchRooms, createRoom, updateRoomStatus, deleteRoom, isLoading } = useRoomStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    roomNumber: '',
    name: '',
    type: 'Deluxe',
    price: '',
    capacity: '2',
    status: 'Available',
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = async (roomId, newStatus) => {
    const targetRoom = rooms.find(r => r._id === roomId);
    const res = await updateRoomStatus(roomId, newStatus);
    if (res.success) {
      toast.success(`Room status updated to "${newStatus}"`);
      addNotification(
        'Room Operational Status Changed',
        `Room #${targetRoom?.roomNumber || ''} (${targetRoom?.name || 'Suite'}) changed to "${newStatus}".`,
        'room'
      );
    } else {
      toast.error(res.error || 'Failed to update status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const submitData = new FormData();
    submitData.append('roomNumber', formData.roomNumber);
    submitData.append('name', formData.name);
    submitData.append('type', formData.type);
    submitData.append('price', formData.price);
    submitData.append('capacity', formData.capacity);
    submitData.append('status', formData.status);
    submitData.append('description', formData.description);
    
    if (imageFile) {
      submitData.append('images', imageFile);
    }

    const res = await createRoom(submitData);
    setIsSubmitting(false);

    if (res.success) {
      toast.success('New room created successfully!');
      setIsModalOpen(false);
      setFormData({
        roomNumber: '',
        name: '',
        type: 'Deluxe',
        price: '',
        capacity: '2',
        status: 'Available',
        description: ''
      });
      setImageFile(null);
    } else {
      toast.error(res.error || 'Failed to create room');
    }
  };

  const handleDelete = async (id, roomNumber) => {
    if (window.confirm(`Are you sure you want to delete Room ${roomNumber}?`)) {
      const res = await deleteRoom(id);
      if (res.success) {
        toast.success(`Room ${roomNumber} deleted successfully`);
      } else {
        toast.error(res.error || 'Failed to delete room');
      }
    }
  };

  // Operational metrics
  const availableCount = rooms.filter(r => r.status === 'Available').length;
  const occupiedCount = rooms.filter(r => r.status === 'Occupied').length;
  const cleaningCount = rooms.filter(r => ['Cleaning', 'Inspection'].includes(r.status)).length;
  const maintenanceCount = rooms.filter(r => r.status === 'Maintenance').length;

  const filteredRooms = rooms.filter(r => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return r.name?.toLowerCase().includes(term) || 
           r.roomNumber?.toLowerCase().includes(term) ||
           r.type?.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Inventory & Operations</h1>
          <p className="text-gray-500 text-sm">Monitor housekeeping progress, occupancy, maintenance, and live room statuses.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchRooms()}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-gold-600' : ''}`} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-gold-600 transition-colors shadow-md"
          >
            <Plus className="h-4 w-4" /> Add New Suite
          </button>
        </div>
      </div>

      {/* Live Operations Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Available (Clean)</p>
            <h3 className="text-2xl font-bold text-emerald-700">{availableCount} Rooms</h3>
            <p className="text-[11px] text-emerald-600 mt-1 font-medium">Ready for Check-In</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Occupied</p>
            <h3 className="text-2xl font-bold text-blue-700">{occupiedCount} Rooms</h3>
            <p className="text-[11px] text-blue-600 mt-1 font-medium">Guests In-House</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <UserCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Housekeeping</p>
            <h3 className="text-2xl font-bold text-amber-700">{cleaningCount} Rooms</h3>
            <p className="text-[11px] text-amber-600 mt-1 font-medium">In Cleaning / Inspection</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Maintenance</p>
            <h3 className="text-2xl font-bold text-red-700">{maintenanceCount} Rooms</h3>
            <p className="text-[11px] text-red-600 mt-1 font-medium">Out of Order / Repairs</p>
          </div>
          <div className="p-3 bg-red-50 rounded-xl text-red-600">
            <Wrench className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search room #, suite name, or tier..."
              className="block w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-gray-900 focus:border-gray-900 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {['All', 'Available', 'Occupied', 'Cleaning', 'Inspection', 'Maintenance', 'Reserved'].map(filter => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  statusFilter === filter
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Room Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Suite Preview</th>
                <th className="px-6 py-4 font-semibold">Room #</th>
                <th className="px-6 py-4 font-semibold">Tier & Capacity</th>
                <th className="px-6 py-4 font-semibold">Nightly Rate</th>
                <th className="px-6 py-4 font-semibold">Current Operational Status</th>
                <th className="px-6 py-4 font-semibold">Quick Status Actions</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && <tr><td colSpan="7" className="text-center py-8 text-gray-400">Loading hotel inventory...</td></tr>}
              {!isLoading && filteredRooms.length === 0 && (
                <tr><td colSpan="7" className="text-center py-8 text-gray-400">No rooms found matching your criteria.</td></tr>
              )}
              {filteredRooms.map((room) => {
                const badge = getStatusBadge(room.status);
                const BadgeIcon = badge.icon;

                return (
                  <tr key={room._id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* Image & Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {room.images && room.images.length > 0 ? (
                          <img 
                            src={`http://localhost:5000${room.images[0]}`} 
                            alt={room.name} 
                            className="w-14 h-14 rounded-xl object-cover border border-gray-200 shadow-sm shrink-0" 
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 shrink-0">
                            <ImageIcon className="h-6 w-6"/>
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-900">{room.name}</div>
                          <div className="text-xs text-gray-400 truncate max-w-[140px]">{room.description || 'Luxury Suite'}</div>
                        </div>
                      </div>
                    </td>

                    {/* Room # */}
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-base text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                        {room.roomNumber}
                      </span>
                    </td>

                    {/* Tier & Capacity */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{room.type}</div>
                      <div className="text-xs text-gray-500">Up to {room.capacity} Guests</div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 font-bold text-gray-900 text-base">
                      ${room.price} <span className="text-xs font-normal text-gray-400">/ night</span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-6 py-4">
                      <div className="relative inline-block w-full max-w-[200px]">
                        <select 
                          value={room.status || 'Available'} 
                          onChange={(e) => handleStatusChange(room._id, e.target.value)}
                          className={`w-full py-1.5 pl-3 pr-8 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer focus:ring-0 focus:outline-none transition-all shadow-sm ${badge.bg}`}
                        >
                          <option value="Available">🟢 Available (Ready)</option>
                          <option value="Occupied">🔵 Occupied (In-Use)</option>
                          <option value="Cleaning">🟡 Cleaning / Housekeeping</option>
                          <option value="Inspection">🟣 Awaiting Inspection</option>
                          <option value="Maintenance">🔴 Maintenance / Repair</option>
                          <option value="Reserved">🟠 Reserved (VIP Hold)</option>
                        </select>
                      </div>
                    </td>

                    {/* 1-Click Quick Action Buttons */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        
                        {/* Quick Mark Clean/Available */}
                        <button
                          onClick={() => handleStatusChange(room._id, 'Available')}
                          disabled={room.status === 'Available'}
                          title="Mark Ready & Available"
                          className="p-1.5 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
                        >
                          <Check className="h-4 w-4" />
                        </button>

                        {/* Quick Send to Cleaning */}
                        <button
                          onClick={() => handleStatusChange(room._id, 'Cleaning')}
                          disabled={room.status === 'Cleaning'}
                          title="Send to Housekeeping / Cleaning"
                          className="p-1.5 rounded-lg border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
                        >
                          <Sparkles className="h-4 w-4" />
                        </button>

                        {/* Quick Mark Occupied */}
                        <button
                          onClick={() => handleStatusChange(room._id, 'Occupied')}
                          disabled={room.status === 'Occupied'}
                          title="Mark Occupied (Guest Check-In)"
                          className="p-1.5 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>

                        {/* Quick Send to Maintenance */}
                        <button
                          onClick={() => handleStatusChange(room._id, 'Maintenance')}
                          disabled={room.status === 'Maintenance'}
                          title="Mark Out of Order / Maintenance"
                          className="p-1.5 rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
                        >
                          <Wrench className="h-4 w-4" />
                        </button>

                      </div>
                    </td>

                    {/* Delete Action */}
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(room._id, room.roomNumber)} 
                        className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50" 
                        title="Delete Room"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh] shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-serif font-bold text-gray-900">Add New Luxury Suite</h2>
                <p className="text-xs text-gray-500 mt-0.5">Configure room inventory and initial status</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 p-1">
                <X className="h-5 w-5"/>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1">Room Number *</label>
                  <input 
                    required 
                    name="roomNumber" 
                    placeholder="e.g. 504" 
                    value={formData.roomNumber} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-gold-500 focus:border-gold-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1">Suite / Room Name *</label>
                  <input 
                    required 
                    name="name" 
                    placeholder="e.g. Imperial Ocean Villa" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-gold-500 focus:border-gold-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1">Category Tier *</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-gold-500 focus:border-gold-500">
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Family">Family</option>
                    <option value="Presidential">Presidential</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1">Price ($/night) *</label>
                  <input 
                    required 
                    type="number" 
                    name="price" 
                    placeholder="450" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-gold-500 focus:border-gold-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1">Guest Capacity *</label>
                  <input 
                    required 
                    type="number" 
                    name="capacity" 
                    placeholder="2" 
                    value={formData.capacity} 
                    onChange={handleInputChange} 
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-gold-500 focus:border-gold-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1">Initial Status *</label>
                <select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-gold-500 focus:border-gold-500"
                >
                  <option value="Available">Available (Ready for Booking)</option>
                  <option value="Occupied">Occupied (Guest Checked-In)</option>
                  <option value="Cleaning">Cleaning / Housekeeping</option>
                  <option value="Inspection">Awaiting Inspection</option>
                  <option value="Maintenance">Maintenance / Out of Order</option>
                  <option value="Reserved">Reserved (VIP Hold)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1">Description & Key Features</label>
                <textarea 
                  rows="3" 
                  name="description" 
                  placeholder="Describe the ambiance, views, and exclusive amenities..." 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-gold-500 focus:border-gold-500" 
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-1">Upload Suite Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setImageFile(e.target.files[0])} 
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm" 
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-xs font-semibold uppercase tracking-wider text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-gold-600 transition-colors shadow-md disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving Suite...' : 'Save & Publish Suite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
