import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Twitter, Facebook } from 'lucide-react';
import logo from '../assets/images/GoldBeam_Logo_PNG_06.png';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black border-t border-amber-500/20 pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          {/* About */}
          <div className="flex flex-col">
            <Link to="/" className="mb-2 inline-block w-fit">
              <img
                src={logo}
                alt="Goldbeam Studios"
                className="h-28 md:h-36 lg:h-44 w-auto transition-all duration-500 
                  hover:scale-105 hover:drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]
                  dark:brightness-110"
              />
            </Link>
            <h4 className="text-lg font-bold text-zinc-900 dark:text-white uppercase mb-6">About Us</h4>
            <p className="text-zinc-600 dark:text-gray-400 leading-relaxed mb-6">
              Premium podcast and video production studio offering professional audio, 4K video recording, and live streaming services in Toronto.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-zinc-400 dark:text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-zinc-400 dark:text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-zinc-400 dark:text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110"
              >
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-zinc-900 dark:text-white uppercase mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start text-zinc-600 dark:text-gray-400">
                <MapPin className="h-5 w-5 mr-3 text-amber-500 shrink-0 mt-1" />
                <span className="hover:text-amber-400 transition-colors">
                  2017 Danforth Avenue, 2nd Floor
                  <br />
                  Toronto, ON M4C 1J7
                </span>
              </li>
              <li className="flex items-center text-zinc-600 dark:text-gray-400">
                <Phone className="h-5 w-5 mr-3 text-amber-500 shrink-0" />
                <a href="tel:2899433216" className="hover:text-amber-400 transition-colors">
                  (289) 943-3216
                </a>
              </li>
              <li className="flex items-center text-zinc-600 dark:text-gray-400">
                <Mail className="h-5 w-5 mr-3 text-amber-500 shrink-0" />
                <a href="mailto:contact@goldbeamstudios.com" className="hover:text-amber-400 transition-colors">
                  contact@goldbeamstudios.com
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-bold text-zinc-900 dark:text-white uppercase mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-zinc-600 dark:text-gray-400 hover:text-amber-500 transition-colors inline-block py-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-zinc-600 dark:text-gray-400 hover:text-amber-500 transition-colors inline-block py-1"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/studios"
                  className="text-zinc-600 dark:text-gray-400 hover:text-amber-500 transition-colors inline-block py-1"
                >
                  Studios
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-zinc-600 dark:text-gray-400 hover:text-amber-500 transition-colors inline-block py-1"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/faqs"
                  className="text-zinc-600 dark:text-gray-400 hover:text-amber-500 transition-colors inline-block py-1"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-zinc-600 dark:text-gray-400 hover:text-amber-500 transition-colors inline-block py-1"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-zinc-600 dark:text-gray-400 hover:text-amber-500 transition-colors inline-block py-1"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/book-wizard"
                  className="text-amber-500 hover:text-amber-400 transition-colors inline-block py-1 font-semibold"
                >
                  Book a Session →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-500/20 pt-8 flex flex-col md:flex-row justify-between items-center text-zinc-500 dark:text-gray-500 text-sm">
          <p className="mb-4 md:mb-0">&copy; 2026 Goldbeam Studios. All rights reserved.</p>
          <Link
            to="https://wa.me/251913901952"
            className="text-amber-500 hover:text-amber-400 transition-colors"
          >
            Powered by Haileab shimels
          </Link>
        </div>
      </div>
    </footer>
  );
}