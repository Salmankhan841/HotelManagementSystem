import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Wifi, Tv, Coffee, Wind, MapPin, ChevronLeft, Loader2, 
  Star, Trash2, Send, MessageSquare, CreditCard, Lock, ShieldCheck, 
  CheckCircle2, X, Calendar, Download, Sparkles 
} from 'lucide-react';
import useRoomStore from '../store/useRoomStore';
import useBookingStore from '../store/useBookingStore';
import useAuthStore from '../store/useAuthStore';
import useReviewStore from '../store/useReviewStore';
import usePaymentStore from '../store/usePaymentStore';
import toast from 'react-hot-toast';
import { getImageUrl } from '../utils/imageHelper';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentRoom: room, fetchRoom, isLoading: roomLoading } = useRoomStore();
  const { user, isAuthenticated } = useAuthStore();
  const { reviews, fetchRoomReviews, addReview, deleteReview, isLoading: reviewsLoading } = useReviewStore();
  const { processPayment, isProcessing: paymentProcessing, lastReceipt, clearReceipt } = usePaymentStore();
  
  // Date State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // Review Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Payment Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [cardName, setCardName] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    fetchRoom(id);
    fetchRoomReviews(id);
    if (user?.name) setCardName(user.name);
  }, [id, fetchRoom, fetchRoomReviews, user]);

  if (roomLoading || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-gold-600" />
      </div>
    );
  }

  // Calculate Total Price
  let totalPrice = 0;
  let nights = 0;
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (nights > 0) {
      totalPrice = nights * room.price;
    }
  }

  const finalAmount = totalPrice + Math.round(totalPrice * 0.15);

  const handleOpenCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to make a reservation');
      navigate('/login');
      return;
    }

    if (nights <= 0) {
      toast.error('Please select valid check-in and check-out dates');
      return;
    }

    setIsCheckoutOpen(true);
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();

    if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
      toast.error('Please complete all card details');
      return;
    }

    const payload = {
      room: room._id,
      checkIn,
      checkOut,
      totalAmount: finalAmount,
      paymentMethod: 'Stripe Card',
      cardDetails: {
        number: cardNumber.replace(/\s+/g, ''),
        name: cardName,
        expiry: cardExpiry,
        cvc: cardCvc
      }
    };

    const result = await processPayment(payload);

    if (result.success) {
      setIsCheckoutOpen(false);
      setReceiptData(result.receipt);
      toast.success('Payment Successful! Reservation Confirmed.');
    } else {
      toast.error(result.error || 'Payment failed');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to leave a review');
      navigate('/login');
      return;
    }

    if (!reviewText.trim()) {
      toast.error('Please enter review comments');
      return;
    }

    setSubmittingReview(true);
    const result = await addReview({
      room: room._id,
      rating,
      review: reviewText.trim()
    });
    setSubmittingReview(false);

    if (result.success) {
      toast.success('Thank you for your review!');
      setReviewText('');
      setRating(5);
      fetchRoom(id); // Refresh average rating
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      const res = await deleteReview(reviewId);
      if (res.success) {
        toast.success('Review deleted');
        fetchRoom(id);
      } else {
        toast.error(res.error);
      }
    }
  };

  // Format Card input
  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = `${val.substring(0, 2)}/${val.substring(2)}`;
    }
    setCardExpiry(val);
  };

  return (
    <div className="bg-[#fdfdfd] min-h-screen pb-24 font-light text-gray-800">
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <Link to="/rooms" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gray-500 hover:text-gold-600 font-semibold transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Rooms
        </Link>
      </div>

      {/* Hero Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="aspect-[16/10] sm:aspect-[21/9] overflow-hidden relative rounded-2xl shadow-lg">
          {room.images && room.images.length > 0 ? (
            <img src={getImageUrl(room.images[0])} alt={room.name} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
          )}
          <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white/90 backdrop-blur px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-bold text-gray-900 shadow-xl rounded-xl">
            ${room.price} <span className="text-gray-500 font-normal text-xs uppercase tracking-wider">/ night</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-gold-600 text-sm uppercase tracking-widest font-semibold">{room.type}</span>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  <Star className="h-4 w-4 fill-gold-500 text-gold-500" />
                  <span>{room.ratingsAverage || 4.5}</span>
                  <span className="text-gray-400">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">{room.name}</h1>
              <p className="text-lg text-gray-600 leading-relaxed font-serif italic border-l-2 border-gold-600 pl-6">
                "{room.description || "Experience the pinnacle of luxury and comfort in our thoughtfully designed spaces."}"
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-100">
              <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
                <Users className="h-6 w-6 text-gold-600" />
                <span className="text-sm uppercase tracking-wider font-semibold">Sleeps {room.capacity}</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
                <MapPin className="h-6 w-6 text-gold-600" />
                <span className="text-sm uppercase tracking-wider font-semibold">Ocean View</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
                <Wind className="h-6 w-6 text-gold-600" />
                <span className="text-sm uppercase tracking-wider font-semibold">850 sq ft</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
                <Wifi className="h-6 w-6 text-gold-600" />
                <span className="text-sm uppercase tracking-wider font-semibold">Free WiFi</span>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-serif text-gray-900 mb-6">Room Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                {room.amenities && room.amenities.map(amenity => (
                   <div key={amenity} className="flex items-center gap-3 text-gray-600">
                     <div className="h-1.5 w-1.5 bg-gold-600 rounded-full"></div>
                     {amenity}
                   </div>
                ))}
              </div>
            </div>

            {/* Guest Reviews & Ratings Section */}
            <div className="pt-8 border-t border-gray-100 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-serif text-gray-900">Guest Reviews & Experiences</h3>
                  <p className="text-sm text-gray-500 mt-1">Authentic feedback from verified guests</p>
                </div>
                <div className="flex items-center gap-2 bg-gold-50 px-4 py-2 border border-gold-200 rounded-lg">
                  <Star className="h-5 w-5 fill-gold-600 text-gold-600" />
                  <span className="text-lg font-bold text-gray-900">{room.ratingsAverage || 4.5}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">/ 5.0</span>
                </div>
              </div>

              {/* Submit Review Form */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <h4 className="font-serif text-lg text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gold-600" /> Share Your Experience
                </h4>
                
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 text-gray-300 hover:scale-110 transition-transform focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 transition-colors ${
                              (hoverRating || rating) >= star
                                ? 'fill-gold-500 text-gold-500'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-3 text-sm font-medium text-gray-600">
                        {rating} out of 5 stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Your Review</label>
                    <textarea
                      rows="3"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder={isAuthenticated ? "Describe your stay, comfort, service, and amenities..." : "Please login to write a review"}
                      disabled={!isAuthenticated || submittingReview}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-gold-600 transition-colors placeholder:text-gray-400 bg-[#fbfbfb]"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!isAuthenticated || submittingReview || !reviewText.trim()}
                      className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 uppercase tracking-widest text-xs font-semibold hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingReview ? <Loader2 className="animate-spin h-4 w-4" /> : <><Send className="h-3.5 w-3.5" /> Submit Review</>}
                    </button>
                  </div>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsLoading ? (
                  <div className="text-center py-8 text-gray-400">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl text-gray-500 border border-gray-100">
                    No reviews yet. Be the first guest to share your experience!
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <motion.div
                      key={rev._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-gray-900">{rev.user?.name || 'Guest'}</span>
                            {rev.user?.role === 'admin' && (
                              <span className="bg-gold-100 text-gold-800 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">
                                Staff
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(rev.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`h-4 w-4 ${
                                  s <= rev.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          {(user?._id === rev.user?._id || user?.role === 'admin') && (
                            <button
                              onClick={() => handleDeleteReview(rev._id)}
                              className="text-gray-400 hover:text-red-600 transition-colors p-1"
                              title="Delete review"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed">{rev.review}</p>
                    </motion.div>
                  ))
                )}
              </div>

            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 shadow-2xl shadow-gray-200/50 border-t-4 border-gold-600 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-serif text-gray-900">Reserve this Room</h3>
                <div className="flex items-center gap-1 text-xs text-gold-700 bg-gold-50 px-2.5 py-1 rounded border border-gold-200 font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" /> Best Price
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Check In</label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gold-600 transition-colors bg-transparent text-gray-900"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold text-gray-500 mb-2">Check Out</label>
                  <input 
                    type="date" 
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gold-600 transition-colors bg-transparent text-gray-900"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>

                {nights > 0 && (
                  <div className="bg-gray-50 p-4 border border-gray-100 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${room.price} x {nights} nights</span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Taxes & Luxury Resort Fees (15%)</span>
                      <span>${Math.round(totalPrice * 0.15)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                      <span>Total Due</span>
                      <span className="text-gold-700">${finalAmount}</span>
                    </div>
                  </div>
                )}

                <button 
                  onClick={handleOpenCheckout}
                  disabled={!checkIn || !checkOut || new Date(checkIn) >= new Date(checkOut)}
                  className="w-full flex justify-center items-center gap-2 bg-gray-900 text-white py-4 uppercase tracking-[0.2em] text-xs font-semibold hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-gold-500/20"
                >
                  <Lock className="h-4 w-4" /> Proceed to Secure Payment
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 uppercase tracking-widest font-medium text-center">
                  <ShieldCheck className="h-4 w-4 text-green-600" /> Powered by Stripe 256-bit SSL
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Stripe Interactive Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden border border-gold-200"
            >
              {/* Modal Header */}
              <div className="bg-gray-900 text-white p-6 relative">
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2 text-gold-400 uppercase tracking-widest text-xs font-bold mb-1">
                  <ShieldCheck className="h-4 w-4" /> Stripe Secure Checkout
                </div>
                <h3 className="text-2xl font-serif text-white">Complete Your Reservation</h3>
                <div className="mt-3 flex items-center justify-between text-sm text-gray-300 border-t border-gray-800 pt-3">
                  <span>{room.name} (#{room.roomNumber})</span>
                  <span className="text-gold-400 font-bold text-base">${finalAmount} USD</span>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleProcessPayment} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1.5">
                    Cardholder Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="e.g. Alexander Vance"
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-gold-600"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1.5">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 4242 4242 4242"
                      className="w-full border border-gray-300 rounded-lg p-3 pr-10 text-sm font-mono tracking-wider focus:outline-none focus:border-gold-600"
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm font-mono text-center focus:outline-none focus:border-gold-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1.5">
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      placeholder="•••"
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm font-mono text-center focus:outline-none focus:border-gold-600"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-200 text-xs text-gray-500 flex items-center gap-3">
                  <Lock className="h-5 w-5 text-gold-600 flex-shrink-0" />
                  <span>Your payment details are encrypted with TLS 1.3 and processed securely by Stripe.</span>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="w-1/3 py-3 border border-gray-300 rounded-lg text-xs font-semibold uppercase tracking-widest text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={paymentProcessing}
                    className="w-2/3 py-3 bg-gray-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gold-600 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
                  >
                    {paymentProcessing ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <>Pay ${finalAmount} USD</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Receipt / Confirmation Modal */}
      <AnimatePresence>
        {receiptData && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden border-2 border-gold-400"
            >
              {/* Receipt Header */}
              <div className="bg-gradient-to-br from-gray-900 to-black text-white p-8 text-center relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500/20 border border-gold-400 rounded-full mb-4">
                  <CheckCircle2 className="h-8 w-8 text-gold-400" />
                </div>
                <p className="text-gold-400 uppercase tracking-widest text-xs font-bold mb-1">
                  Payment Verified
                </p>
                <h3 className="text-3xl font-serif text-white mb-2">Reservation Confirmed</h3>
                <p className="text-gray-400 text-xs">
                  A receipt has been recorded and sent to {receiptData.guestEmail}
                </p>
              </div>

              {/* Receipt Details */}
              <div className="p-8 space-y-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transaction ID</span>
                    <span className="font-mono font-bold text-gray-900">{receiptData.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Accommodation</span>
                    <span className="font-semibold text-gray-900">{receiptData.roomName} (#{receiptData.roomNumber})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dates</span>
                    <span className="font-medium text-gray-900">{checkIn} to {checkOut} ({nights} nights)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Method</span>
                    <span className="font-medium text-gray-900">Stripe Card (•••• {receiptData.cardLast4})</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 text-base">
                    <span className="font-bold text-gray-900">Total Paid</span>
                    <span className="font-bold text-gold-700">${receiptData.amountPaid} USD</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setReceiptData(null);
                      navigate('/rooms');
                    }}
                    className="w-full py-3.5 bg-gray-900 text-white rounded-lg uppercase tracking-widest text-xs font-bold hover:bg-gold-600 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default RoomDetails;
