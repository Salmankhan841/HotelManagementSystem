import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Clock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Your message has been sent successfully! Our concierge will contact you promptly.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="bg-[#fdfdfd] min-h-screen font-light text-gray-800 overflow-x-hidden">
      
      {/* Aesthetic Hero */}
      <section className="relative min-h-[45vh] sm:min-h-[55vh] flex flex-col justify-center px-4 sm:px-6 lg:px-16 py-16 sm:py-24 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=80" 
            alt="Hotel exterior" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-2xl">
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold-400 uppercase tracking-[0.2em] text-xs sm:text-sm font-semibold mb-4"
          >
            Connect With Us
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-serif text-white mb-6 leading-tight"
          >
            We Are Here <br/><span className="italic text-gold-400">For You.</span>
          </motion.h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Contact Details Cards */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-3">Concierge Office</h2>
                <div className="w-12 h-0.5 bg-gold-600 mb-6"></div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our front desk & concierge teams are at your disposal 24 hours a day to facilitate reservations, transfers, and private events.
                </p>
              </div>
              
              <div className="space-y-6 pt-2">
                <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="p-2.5 bg-gold-50 text-gold-600 rounded-lg shrink-0 h-fit">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="uppercase tracking-widest text-[11px] font-bold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      123 Luxury Avenue, Beverly Hills, CA 90210
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="p-2.5 bg-gold-50 text-gold-600 rounded-lg shrink-0 h-fit">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="uppercase tracking-widest text-[11px] font-bold text-gray-900 mb-1">Direct Lines</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      +1 (555) 123-4567<br />
                      +1 (555) 987-6543
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="p-2.5 bg-gold-50 text-gold-600 rounded-lg shrink-0 h-fit">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="uppercase tracking-widest text-[11px] font-bold text-gray-900 mb-1">Email Inquiries</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      reservations@luxurystay.com<br />
                      concierge@luxurystay.com
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white p-6 sm:p-10 md:p-12 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gold-600"></div>
              
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-2">Send an Inquiry</h2>
                <p className="text-gray-500 text-xs sm:text-sm">We respond to all guest inquiries within 2 hours.</p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">Your Name *</label>
                    <input
                      type="text"
                      className={`block w-full border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg p-3 text-sm focus:outline-none focus:border-gold-600 transition-colors placeholder:text-gray-400 bg-gray-50/50`}
                      placeholder="e.g. Eleanor Vance"
                      {...register('name')}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">Your Email *</label>
                    <input
                      type="email"
                      className={`block w-full border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg p-3 text-sm focus:outline-none focus:border-gold-600 transition-colors placeholder:text-gray-400 bg-gray-50/50`}
                      placeholder="e.g. eleanor@example.com"
                      {...register('email')}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">Subject *</label>
                  <input
                    type="text"
                    className={`block w-full border ${errors.subject ? 'border-red-500' : 'border-gray-200'} rounded-lg p-3 text-sm focus:outline-none focus:border-gold-600 transition-colors placeholder:text-gray-400 bg-gray-50/50`}
                    placeholder="e.g. Presidential Suite Private Event"
                    {...register('subject')}
                  />
                  {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-600 mb-1">Your Message *</label>
                  <textarea
                    rows="4"
                    className={`block w-full border ${errors.message ? 'border-red-500' : 'border-gray-200'} rounded-lg p-3 text-sm focus:outline-none focus:border-gold-600 transition-colors placeholder:text-gray-400 resize-none bg-gray-50/50`}
                    placeholder="How may our concierge team assist your upcoming stay? *"
                    {...register('message')}
                  ></textarea>
                  {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-lg uppercase tracking-widest text-xs font-semibold hover:bg-gold-600 transition-colors duration-300 disabled:opacity-70 shadow-md"
                  >
                    {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                    {!isSubmitting && <Send className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
          
        </div>
      </section>
    </div>
  );
};

export default Contact;
