import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import Studios from './pages/Studios';
import Book from './pages/Book';
import Build from './pages/Build';
import More from './pages/More';
import Contact from './pages/Contact';
import FAQs from './pages/FAQs';
import Resources from './pages/Resources';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Editor from './pages/admin/Editor';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import MainLayout from './layouts/MainLayout';

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
    </Router>
  );
}

export default App;
