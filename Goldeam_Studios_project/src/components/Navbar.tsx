import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/GoldBeam_Logo_PNG_06.png';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);

  // Separate state for mobile dropdowns
  const [mobileMoreDropdownOpen, setMobileMoreDropdownOpen] = useState(false);
  const [mobileResourcesDropdownOpen, setMobileResourcesDropdownOpen] = useState(false);

  const location = useLocation();
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const resourcesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target as Node)) {
        setResourcesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Studios', path: '/studios' },
  ];

  const moreLinks = [
    { name: 'How It Works', path: '/how-it-works', description: 'Our process from booking to delivery' },
    { name: 'About Us', path: '/build', description: 'Learn about our services' },
    { name: 'Contact', path: '/contact', description: 'Get in touch with us' },
    { name: 'FAQs', path: '/faqs', description: 'Frequently asked questions' },
  ];

  const resourcesLinks = [
    { name: 'Blog & Articles', path: '/blog', description: 'Tips, guides, and insights' },
    { name: 'More Info', path: '/more', description: 'Additional information hub' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-black/90 backdrop-blur-xl border-b border-amber-500/20'
        : 'bg-transparent'
        }`}
    >
      {/* Main container with reduced vertical padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group relative z-50">
            <div className="relative">
              <img
                src={logo}
                alt="Goldbeam Studios"
                className="h-28 md:h-36 lg:h-44 w-auto transition-all duration-500 
                  group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]
                  drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:text-amber-500 ${location.pathname === link.path
                  ? 'text-amber-500'
                  : 'text-gray-300'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {/* More Dropdown */}
            <div className="relative" ref={moreDropdownRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1 text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:text-amber-500 ${['/how-it-works', '/build', '/contact', '/faqs'].includes(location.pathname)
                  ? 'text-amber-500'
                  : 'text-gray-300'
                  }`}
              >
                More
                <ChevronDown className={`h-4 w-4 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-black border border-amber-500/20 rounded-xl shadow-2xl overflow-hidden z-50">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMoreDropdownOpen(false)}
                      className={`block px-6 py-4 hover:bg-amber-500/10 transition-colors border-b border-amber-500/10 last:border-0 ${location.pathname === link.path ? 'bg-amber-500/10' : ''
                        }`}
                    >
                      <div className="text-white font-bold text-sm uppercase">{link.name}</div>
                      <div className="text-gray-400 text-xs mt-1">{link.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative" ref={resourcesDropdownRef}>
              <button
                onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                className={`flex items-center gap-1 text-sm font-medium tracking-wider uppercase transition-all duration-300 hover:text-amber-500 ${['/resources', '/more'].includes(location.pathname)
                  ? 'text-amber-500'
                  : 'text-gray-300'
                  }`}
              >
                Resources
                <ChevronDown className={`h-4 w-4 transition-transform ${resourcesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {resourcesDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-black border border-amber-500/20 rounded-xl shadow-2xl overflow-hidden z-50">
                  {resourcesLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setResourcesDropdownOpen(false)}
                      className={`block px-6 py-4 hover:bg-amber-500/10 transition-colors border-b border-amber-500/10 last:border-0 ${location.pathname === link.path ? 'bg-amber-500/10' : ''
                        }`}
                    >
                      <div className="text-white font-bold text-sm uppercase">{link.name}</div>
                      <div className="text-gray-400 text-xs mt-1">{link.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/book"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 
                px-8 py-3 rounded-lg font-bold uppercase tracking-wide transition-all duration-300 
                transform hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/50 
                text-sm whitespace-nowrap"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-300 hover:text-amber-500 focus:outline-none transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-8 w-8" />
            ) : (
              <Menu className="h-8 w-8" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-amber-500/20 transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-6 py-4 space-y-0">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-base font-medium uppercase tracking-wide transition-colors py-4 ${location.pathname === link.path
                  ? 'text-amber-500'
                  : 'text-gray-300 hover:text-white'
                }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile More Dropdown Button */}
          <div className="border-t border-amber-500/20">
            <button
              onClick={() => setMobileMoreDropdownOpen(!mobileMoreDropdownOpen)}
              className="flex items-center justify-between w-full py-4 text-base font-medium uppercase tracking-wide text-gray-300 hover:text-amber-500 transition-colors"
            >
              <span>More</span>
              {mobileMoreDropdownOpen ? (
                <ChevronUp className="h-5 w-5 text-amber-500" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            {/* Mobile More Dropdown Content */}
            {mobileMoreDropdownOpen && (
              <div className="pl-4 pb-2 space-y-3 border-l border-amber-500/20 ml-3">
                {moreLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block group"
                  >
                    <div className={`text-sm font-medium uppercase tracking-wide transition-colors py-2 ${location.pathname === link.path
                        ? 'text-amber-500'
                        : 'text-gray-300 group-hover:text-white'
                      }`}>
                      {link.name}
                    </div>
                    <div className="text-gray-500 text-xs group-hover:text-gray-400 transition-colors">
                      {link.description}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Resources Dropdown Button */}
          <div className="border-t border-amber-500/20">
            <button
              onClick={() => setMobileResourcesDropdownOpen(!mobileResourcesDropdownOpen)}
              className="flex items-center justify-between w-full py-4 text-base font-medium uppercase tracking-wide text-gray-300 hover:text-amber-500 transition-colors"
            >
              <span>Resources</span>
              {mobileResourcesDropdownOpen ? (
                <ChevronUp className="h-5 w-5 text-amber-500" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            {/* Mobile Resources Dropdown Content */}
            {mobileResourcesDropdownOpen && (
              <div className="pl-4 pb-2 space-y-3 border-l border-amber-500/20 ml-3">
                {resourcesLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block group"
                  >
                    <div className={`text-sm font-medium uppercase tracking-wide transition-colors py-2 ${location.pathname === link.path
                        ? 'text-amber-500'
                        : 'text-gray-300 group-hover:text-white'
                      }`}>
                      {link.name}
                    </div>
                    <div className="text-gray-500 text-xs group-hover:text-gray-400 transition-colors">
                      {link.description}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-amber-500/20 pt-6">
            <Link
              to="/book"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 py-4 text-base font-bold uppercase rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all duration-300"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}