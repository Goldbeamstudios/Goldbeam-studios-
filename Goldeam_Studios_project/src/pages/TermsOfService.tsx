import { FileText } from 'lucide-react';

export default function TermsOfService() {
    const sections = [
        {
            title: 'Agreement to Terms',
            content: 'By accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not access or use our services.',
        },
        {
            title: 'Booking and Payments',
            content: 'All bookings are subject to availability. Payment is required at the time of booking via Stripe. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site.',
        },
        {
            title: 'Cancellations and Rescheduling',
            content: 'Rescheduling is permitted up to 24 hours before your session at no charge. Cancellations made within 24 hours of the session are subject to a 50% fee. No-shows will be charged the full amount.',
        },
        {
            title: 'Studio Rules',
            content: 'Clients are expected to treat the studio and equipment with respect. Any damage to studio property caused by the client or their guests will be the responsibility of the client. Smoking is strictly prohibited.',
        },
        {
            title: 'Intellectual Property',
            content: 'All content created during your session is your property. However, Goldbeam Studios reserves the right to use snippets for promotional purposes unless otherwise agreed in writing.',
        },
        {
            title: 'Limitation of Liability',
            content: 'Goldbeam Studios shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.',
        },
        {
            title: 'Governing Law',
            content: 'These Terms shall be governed and construed in accordance with the laws of Ontario, Canada, without regard to its conflict of law provisions.',
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
                                Terms of Service
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
                                        <FileText className="h-6 w-6 text-amber-500" />
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
                        Need Clarification?
                    </h2>
                    <p className="text-xl text-zinc-600 dark:text-gray-300 mb-8">
                        If you have any questions regarding these terms, please don't hesitate to reach out.
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
