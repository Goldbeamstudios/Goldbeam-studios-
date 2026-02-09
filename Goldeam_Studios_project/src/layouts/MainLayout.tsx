import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-black">
            <Helmet>
                <title>Goldbeam Studios | Premium Podcast & Video Production Toronto</title>
                <meta name="description" content="Goldbeam Studios is a premium podcast and video production studio in Toronto. Professional audio, 4K multi-cam video, and on-site engineers for creators." />
            </Helmet>
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
}
