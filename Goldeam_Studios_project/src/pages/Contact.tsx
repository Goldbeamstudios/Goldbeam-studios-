import { supabase } from '../lib/supabase';
import { Loader2, CheckCircle, AlertCircle, MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  }>({});

  // Canada/US (NANP) Phone Validation
  const isPhoneValid = (phone: string) => {
    if (!phone) return true; // Phone is optional
    const nanpRegex = /^(\+?1[-.\s]?)?\(?[2-9][0-9]{2}\)?[-.\s]?[2-9][0-9]{2}[-.\s]?[0-9]{4}$/;
    return nanpRegex.test(phone.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof fieldErrors = {};

    // Name Validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = 'Valid email is required';
    }

    // Phone Validation
    if (formData.phone && !isPhoneValid(formData.phone)) {
      errors.phone = 'Invalid phone format (e.g. 555-555-5555)';
    }

    // Message Validation
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setStatus('loading');

    try {
      const { error } = await supabase.functions.invoke('contact-handler', {
        body: formData
      });

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);

    } catch (error: any) {
      console.error('Contact form error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="bg-white dark:bg-black text-zinc-900 dark:text-white min-h-screen pt-24 transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white uppercase mb-6">
              Get In{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                Touch
              </span>
            </h1>
            <p className="text-xl text-zinc-600 dark:text-gray-300 leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and we'll respond
              as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-amber-500/20 p-8 rounded-2xl">
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase mb-6">
                Send Us a Message
              </h2>

              {status === 'success' ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center animate-in fade-in zoom-in duration-300">
                  <div className="bg-green-100 dark:bg-green-800/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Thank you for contacting Goldbeam Studios. We've received your message and will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 text-amber-500 font-bold hover:text-amber-600 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-gray-400 uppercase mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
                      }}
                      className={`w-full bg-white dark:bg-black border ${fieldErrors.name ? 'border-red-500' : 'border-zinc-300 dark:border-amber-500/20'
                        } text-zinc-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors`}
                      placeholder="Your Name"
                      required
                      disabled={status === 'loading'}
                    />
                    {fieldErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-gray-400 uppercase mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                      }}
                      className={`w-full bg-white dark:bg-black border ${fieldErrors.email ? 'border-red-500' : 'border-zinc-300 dark:border-amber-500/20'
                        } text-zinc-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors`}
                      placeholder="your@email.com"
                      required
                      disabled={status === 'loading'}
                    />
                    {fieldErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-gray-400 uppercase mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: undefined });
                      }}
                      className={`w-full bg-white dark:bg-black border ${fieldErrors.phone ? 'border-red-500' : 'border-zinc-300 dark:border-amber-500/20'
                        } text-zinc-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors`}
                      placeholder="(555) 123-4567"
                      disabled={status === 'loading'}
                    />
                    {fieldErrors.phone && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-gray-400 uppercase mb-2">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (fieldErrors.message) setFieldErrors({ ...fieldErrors, message: undefined });
                      }}
                      rows={6}
                      className={`w-full bg-white dark:bg-black border ${fieldErrors.message ? 'border-red-500' : 'border-zinc-300 dark:border-amber-500/20'
                        } text-zinc-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors`}
                      placeholder="Tell us about your project..."
                      required
                      disabled={status === 'loading'}
                    />
                    {fieldErrors.message && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 text-lg font-bold uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-amber-500/20 p-8 rounded-2xl">
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl">
                      <MapPin className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-zinc-900 dark:text-white font-bold mb-1">Address</h3>
                      <p className="text-zinc-600 dark:text-gray-400">
                        2017B Danforth Ave
                        <br />
                        Toronto, ON M4C 1J7M4
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl">
                      <Phone className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-zinc-900 dark:text-white font-bold mb-1">Phone</h3>
                      <p className="text-zinc-600 dark:text-gray-400">(289) 943-3216</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl">
                      <Mail className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-zinc-900 dark:text-white font-bold mb-1">Email</h3>
                      <p className="text-zinc-600 dark:text-gray-400">contact@goldbeamstudios.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl">
                      <Clock className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-zinc-900 dark:text-white font-bold mb-1">Hours</h3>
                      <p className="text-zinc-600 dark:text-gray-400">
                        Mon – Sun 7:00 AM – 9:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-amber-500/20 rounded-2xl overflow-hidden h-64">
                <div className="w-full h-full bg-gradient-to-br from-amber-500/10 to-amber-600/5 flex items-center justify-center">
                  <MapPin className="h-16 w-16 text-amber-500/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
