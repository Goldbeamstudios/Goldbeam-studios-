import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import MainLayout from './layouts/MainLayout';
import Loading from './components/Loading';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Studios = lazy(() => import('./pages/Studios'));
const Book = lazy(() => import('./pages/Book'));
const Build = lazy(() => import('./pages/Build'));
const More = lazy(() => import('./pages/More'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQs = lazy(() => import('./pages/FAQs'));
const Resources = lazy(() => import('./pages/Resources'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

// Admin pages
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Editor = lazy(() => import('./pages/admin/Editor'));

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
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Admin Routes - No MainLayout (No Navbar/Footer) */}
          <Route path="/admin/login" element={<Login />} />

          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="posts" element={<Dashboard />} />
              <Route path="editor" element={<Editor />} />
            </Route>
          </Route>

          {/* Public Routes wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/studios" element={<Studios />} />
            <Route path="/book" element={<Book />} />
            <Route path="/build" element={<Build />} />
            <Route path="/more" element={<More />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/resources" element={<Resources />} />

            {/* Blog Routes */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
