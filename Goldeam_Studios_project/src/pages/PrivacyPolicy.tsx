import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
    const sections = [
        {
            title: 'Information We Collect',
            content: 'We collect information you provide directly to us when you book a session, contact us, or sign up for our newsletter. This may include your name, email address, phone number, and payment information processed securely through Stripe.',
        },
        {
            title: 'How We Use Your Information',
            content: 'We use the information we collect to provider, maintain, and improve our services, to process your bookings, and to communicate with you about your sessions and promotional offers.',
        },
        {
            title: 'Information Sharing',
            content: 'We do not share your personal information with third parties except as necessary to provide our services (e.g., payment processing via Stripe) or as required by law.',
        },
        {
            title: 'Data Security',
            content: 'We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.',
        },
        {
            title: 'Your Choices',
            content: 'You may update or correct your information at any time by contacting us. You may also opt out of receiving promotional emails from us by following the instructions in those emails.',
        },
        {
            title: 'Contact Us',
            content: 'If you have any questions about this Privacy Policy, please contact us at contact@goldbeamstudios.com.',
        },
    ];

    return (
        <div className="bg-white dark:bg-black text-zinc-900 dark:text-white min-h-screen pt-24 transition-colors duration-300">
            {/* Hero Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase mb-6">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                                Privacy Policy
                            </span>
                        </h1>
                        <p className="text-xl text-zinc-600 dark:text-gray-300 leading-relaxed">
                            Last updated: February 7, 2026
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-12">
                        {sections.map((section, index) => (
                            <div key={index} className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-amber-500/10 rounded-2xl p-8 hover:border-amber-500/30 transition-all duration-300">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-2 bg-amber-500/10 rounded-lg">
                                        <Shield className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
                                        {section.title}
                                    </h2>
                                </div>
                                <p className="text-zinc-600 dark:text-gray-400 leading-relaxed text-lg">
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 border-y border-zinc-200 dark:border-amber-500/20 bg-zinc-50 dark:bg-black">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase mb-6">
                        Questions?
                    </h2>
                    <p className="text-xl text-zinc-600 dark:text-gray-300 mb-8">
                        If you have any questions regarding our privacy practices, please reach out to us.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-8 py-4 text-lg font-bold uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all rounded-lg"
                    >
                        Contact Support
                    </a>
                </div>
            </section>
        </div>
    );
}
