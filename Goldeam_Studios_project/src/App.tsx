import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import MainLayout from './layouts/MainLayout';
import Loading from './components/Loading';
import ScrollToTop from './components/ScrollToTop';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Studios = lazy(() => import('./pages/Studios'));
const Build = lazy(() => import('./pages/Build'));
const More = lazy(() => import('./pages/More'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQs = lazy(() => import('./pages/FAQs'));
const LocationParking = lazy(() => import('./pages/LocationParking'));
const Resources = lazy(() => import('./pages/Resources'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

// Admin pages
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Editor = lazy(() => import('./pages/admin/Editor'));
const AdminSchedule = lazy(() => import('./pages/admin/AdminSchedule'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AdminPosts = lazy(() => import('./pages/admin/AdminPosts'));

// Booking Wizard
const BookWizard = lazy(() => import('./pages/BookWizard'));
const BookingSuccess = lazy(() => import('./pages/BookingSuccess'));

const NotFound = () => (
  <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
    <h1 className="text-6xl font-bold text-white mb-4">404</h1>
    <p className="text-xl text-gray-400 mb-8">Page not found</p>
    <Link to="/" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-all">
      Return Home
    </Link>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Admin Routes - No MainLayout (No Navbar/Footer) */}
          <Route path="/admin/login" element={<Login />} />

          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="editor" element={<Editor />} />
              <Route path="schedule" element={<AdminSchedule />} />
            </Route>
          </Route>

          {/* Public Routes wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/studios" element={<Studios />} />
            <Route path="/book-wizard" element={<BookWizard />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/build" element={<Build />} />
            <Route path="/more" element={<More />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/location-parking" element={<LocationParking />} />
            <Route path="/resources" element={<Resources />} />

            {/* Blog Routes */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />

            {/* Legal Routes */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
