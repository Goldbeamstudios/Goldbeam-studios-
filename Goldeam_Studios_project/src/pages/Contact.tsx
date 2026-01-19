import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add form submission logic here
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-gray-400 uppercase mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white dark:bg-black border border-zinc-300 dark:border-amber-500/20 text-zinc-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-gray-400 uppercase mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white dark:bg-black border border-zinc-300 dark:border-amber-500/20 text-zinc-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-gray-400 uppercase mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white dark:bg-black border border-zinc-300 dark:border-amber-500/20 text-zinc-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 dark:text-gray-400 uppercase mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full bg-white dark:bg-black border border-zinc-300 dark:border-amber-500/20 text-zinc-900 dark:text-white px-4 py-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Tell us about your project..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 text-lg font-bold uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all rounded-lg flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </form>
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
                        123 Creative Ave, Suite 400
                        <br />
                        Chicago, IL 60607
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl">
                      <Phone className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-zinc-900 dark:text-white font-bold mb-1">Phone</h3>
                      <p className="text-zinc-600 dark:text-gray-400">(312) 555-0123</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl">
                      <Mail className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-zinc-900 dark:text-white font-bold mb-1">Email</h3>
                      <p className="text-zinc-600 dark:text-gray-400">hello@goldbeamstudios.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-xl">
                      <Clock className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-zinc-900 dark:text-white font-bold mb-1">Hours</h3>
                      <p className="text-zinc-600 dark:text-gray-400">
                        Mon - Fri: 9:00 AM - 10:00 PM
                        <br />
                        Sat - Sun: 10:00 AM - 8:00 PM
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
