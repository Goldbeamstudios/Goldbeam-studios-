import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Twitter, Facebook } from 'lucide-react';
import logo from '../assets/images/GoldBeam_Logo_PNG_06.png';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-amber-500/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo Section - Big and Clean */}
        <div className="flex justify-center mb-16">
          <Link to="/" className="group relative">
            <div className="relative">
              {/* Big Logo */}
              <img
                src={logo}
                alt="Goldbeam Studios"
                className="h-40 md:h-48 lg:h-56 w-auto transition-all duration-500 
                  group-hover:scale-105 group-hover:drop-shadow-[0_0_25px_rgba(245,158,11,0.3)]
                  drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
              />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {/* About */}
          <div>
            <h4 className="text-lg font-bold text-white uppercase mb-6">About Us</h4>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Premier podcast production facility offering professional audio engineering,
              4K video recording, and live streaming services in Chicago.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110"
              >
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-white uppercase mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start text-gray-400">
                <MapPin className="h-5 w-5 mr-3 text-amber-500 shrink-0 mt-1" />
                <span className="hover:text-amber-400 transition-colors">
                  123 Creative Ave, Suite 400
                  <br />
                  Chicago, IL 60607
                </span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="h-5 w-5 mr-3 text-amber-500 shrink-0" />
                <a href="tel:3125550123" className="hover:text-amber-400 transition-colors">
                  (312) 555-0123
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail className="h-5 w-5 mr-3 text-amber-500 shrink-0" />
                <a href="mailto:hello@goldbeamstudios.com" className="hover:text-amber-400 transition-colors">
                  hello@goldbeamstudios.com
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-bold text-white uppercase mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-amber-500 transition-colors inline-block py-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-gray-400 hover:text-amber-500 transition-colors inline-block py-1"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/studios"
                  className="text-gray-400 hover:text-amber-500 transition-colors inline-block py-1"
                >
                  Studios
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-gray-400 hover:text-amber-500 transition-colors inline-block py-1"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/faqs"
                  className="text-gray-400 hover:text-amber-500 transition-colors inline-block py-1"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/book"
                  className="text-amber-500 hover:text-amber-400 transition-colors inline-block py-1 font-semibold"
                >
                  Book a Session →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-500/20 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p className="mb-4 md:mb-0">&copy; 2025 Goldbeam Studios. All rights reserved.</p>
          <Link 
            to="https://wa.me/251913901952" 
            className="text-amber-500 hover:text-amber-400 transition-colors"
          >
            Powered by Haileab
          </Link>
        </div>
      </div>
    </footer>
  );
}