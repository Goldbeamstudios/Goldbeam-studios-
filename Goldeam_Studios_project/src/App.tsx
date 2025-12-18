import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Routes>
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

        {/* Admin Routes - No MainLayout (No Navbar/Footer) */}
        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="editor" element={<Editor />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
