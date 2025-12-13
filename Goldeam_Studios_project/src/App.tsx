import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Navbar />
        <Routes>
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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
