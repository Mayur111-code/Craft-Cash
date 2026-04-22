import React, { useEffect, useState } from 'react';
import { 
    Shield, Lock, Eye, FileText, Server, 
    Database, Globe, Cookie, Mail, Phone, 
    MapPin, ChevronLeft, Printer, Download,
    CheckCircle, AlertCircle, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState(null);
    const [lastUpdated] = useState(new Date(2026, 4, 22)); // December 15, 2025

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);
        
        // Set up intersection observer for active section highlighting
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        const sections = document.querySelectorAll('.policy-section');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        const content = document.querySelector('.privacy-content-main').innerHTML;
        const style = document.querySelector('style').innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Privacy Policy - CashCraft</title>
                <style>${style}</style>
                <style>
                    body { padding: 40px; background: white; color: black; }
                    .no-print { display: none; }
                </style>
            </head>
            <body>
                ${content}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const sections = [
        {
            id: 'introduction',
            icon: FileText,
            title: 'Introduction',
            color: 'blue',
            content: (
                <div className="space-y-4">
                    <p className="text-[var(--text-muted)] leading-relaxed">
                        Welcome to <span className="font-semibold text-[var(--primary)]">CashCraft</span> - Your AI-Powered Expense Tracker. 
                        We value your privacy and are committed to protecting your personal and financial information.
                    </p>
                    <p className="text-[var(--text-muted)] leading-relaxed">
                        This Privacy Policy explains how we collect, use, and safeguard your data when you use our application. 
                        By using our services, you agree to the collection and use of information in accordance with this policy.
                    </p>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <CheckCircle size={18} className="text-blue-500" />
                        <p className="text-sm text-[var(--text-main)]">We are committed to transparency and data protection</p>
                    </div>
                </div>
            )
        },
        {
            id: 'information-collect',
            icon: Eye,
            title: 'Information We Collect',
            color: 'purple',
            content: (
                <div className="space-y-4">
                    <p className="text-[var(--text-muted)]">To provide you with the best experience, we collect the following types of information:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)]">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Database size={16} className="text-blue-500" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-main)]">Personal Information</h4>
                            </div>
                            <p className="text-sm text-[var(--text-muted)]">Name, email address, and authentication credentials for account management.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)]">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <Database size={16} className="text-green-500" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-main)]">Financial Data</h4>
                            </div>
                            <p className="text-sm text-[var(--text-muted)]">Expense records, budget limits, transaction categories, and spending habits.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)]">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                    <Server size={16} className="text-purple-500" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-main)]">Usage Data</h4>
                            </div>
                            <p className="text-sm text-[var(--text-muted)]">Interaction logs, feature usage patterns, and device information for optimization.</p>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)]">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                    <Cookie size={16} className="text-yellow-500" />
                                </div>
                                <h4 className="font-semibold text-[var(--text-main)]">Cookies & Tracking</h4>
                            </div>
                            <p className="text-sm text-[var(--text-muted)]">We use cookies to enhance your browsing experience and analyze app usage.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'data-usage',
            icon: Server,
            title: 'How We Use Your Data',
            color: 'green',
            content: (
                <div className="space-y-4">
                    <p className="text-[var(--text-muted)]">Your information helps us provide and improve our services. Specifically, we use your data for:</p>
                    <div className="space-y-3">
                        {[
                            'Provide and maintain the expense tracking service',
                            'Generate personalized financial insights and budget recommendations using AI',
                            'Detect anomalies and unusual patterns in your spending',
                            'Improve user experience and application performance',
                            'Send important notifications about your account and updates',
                            'Analyze usage patterns to enhance our AI models'
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start gap-3 p-3 rounded-lg bg-[var(--element-bg)]/50"
                            >
                                <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                                <span className="text-sm text-[var(--text-muted)]">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 'ai-services',
            icon: Globe,
            title: 'AI & Third-Party Services',
            color: 'orange',
            content: (
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                        <h4 className="font-semibold text-[var(--text-main)] mb-2">AI-Powered Features</h4>
                        <p className="text-sm text-[var(--text-muted)] mb-3">
                            Our application utilizes advanced AI models (LLaMA via Groq) to provide financial coaching and analysis.
                            When you use AI features, anonymized data snippets may be processed to generate responses.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                            <Shield size={14} />
                            <span>We do not sell your personal data to third parties</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-[var(--element-bg)] border border-[var(--border-color)]">
                            <p className="text-xs text-[var(--text-muted)]">AI Provider</p>
                            <p className="text-sm font-semibold text-[var(--text-main)]">Groq (LLaMA 3.3)</p>
                        </div>
                        <div className="p-3 rounded-lg bg-[var(--element-bg)] border border-[var(--border-color)]">
                            <p className="text-xs text-[var(--text-muted)]">Data Processing</p>
                            <p className="text-sm font-semibold text-[var(--text-main)]">Anonymized & Encrypted</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'data-security',
            icon: Lock,
            title: 'Data Security',
            color: 'red',
            content: (
                <div className="space-y-4">
                    <p className="text-[var(--text-muted)] leading-relaxed">
                        We implement robust security measures to protect your data from unauthorized access, alteration, or disclosure.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="text-center p-3 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)]">
                            <Lock size={24} className="mx-auto mb-2 text-green-500" />
                            <p className="text-xs font-semibold text-[var(--text-main)]">End-to-End Encryption</p>
                            <p className="text-xs text-[var(--text-muted)]">256-bit SSL/TLS</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)]">
                            <Shield size={24} className="mx-auto mb-2 text-blue-500" />
                            <p className="text-xs font-semibold text-[var(--text-main)]">Secure Authentication</p>
                            <p className="text-xs text-[var(--text-muted)]">JWT Tokens</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)]">
                            <Database size={24} className="mx-auto mb-2 text-purple-500" />
                            <p className="text-xs font-semibold text-[var(--text-main)]">Regular Backups</p>
                            <p className="text-xs text-[var(--text-muted)]">Automated & Secure</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <AlertCircle size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-[var(--text-muted)]">
                            No method of transmission over the internet is 100% secure. While we strive to protect your data, 
                            we cannot guarantee absolute security.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'your-rights',
            icon: Shield,
            title: 'Your Rights',
            color: 'teal',
            content: (
                <div className="space-y-4">
                    <p className="text-[var(--text-muted)]">Under data protection laws, you have the following rights:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            'Access your personal data',
                            'Correct inaccurate data',
                            'Request data deletion',
                            'Object to data processing',
                            'Data portability',
                            'Withdraw consent'
                        ].map((right, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--element-bg)]/50">
                                <CheckCircle size={14} className="text-teal-500" />
                                <span className="text-sm text-[var(--text-muted)]">{right}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-color)]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Link 
                                to="/" 
                                className="p-2 rounded-full bg-[var(--element-bg)] border border-[var(--border-color)] hover:bg-[var(--primary)]/10 hover:border-[var(--primary)] transition-all duration-300"
                            >
                                <ChevronLeft size={20} className="text-[var(--text-muted)]" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                                        <Shield size={20} className="text-white" />
                                    </div>
                                    <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                                        Privacy Policy
                                    </h1>
                                </div>
                                <p className="text-[var(--text-muted)] text-sm mt-1">
                                    Last Updated: {lastUpdated.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 no-print">
                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all duration-300"
                            >
                                <Printer size={16} />
                                <span className="text-sm hidden sm:inline">Print</span>
                            </button>
                            <button
                                onClick={handleDownload}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all duration-300"
                            >
                                <Download size={16} />
                                <span className="text-sm hidden sm:inline">Download</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Table of Contents - Sidebar */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:sticky lg:top-24 h-fit no-print"
                    >
                        <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-4">
                            <h3 className="font-semibold text-[var(--text-main)] mb-3 flex items-center gap-2">
                                <FileText size={16} />
                                Contents
                            </h3>
                            <nav className="space-y-1">
                                {sections.map((section) => {
                                    const Icon = section.icon;
                                    return (
                                        <a
                                            key={section.id}
                                            href={`#${section.id}`}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-300
                                                ${activeSection === section.id 
                                                    ? 'bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 text-[var(--primary)] border-l-2 border-[var(--primary)]' 
                                                    : 'text-[var(--text-muted)] hover:bg-[var(--element-bg)] hover:text-[var(--text-main)]'
                                                }`}
                                        >
                                            <Icon size={14} />
                                            {section.title}
                                        </a>
                                    );
                                })}
                            </nav>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 privacy-content-main">
                        <div className="space-y-6">
                            {sections.map((section, idx) => {
                                const Icon = section.icon;
                                return (
                                    <motion.div
                                        key={section.id}
                                        id={section.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden hover:border-[var(--primary)]/30 transition-all duration-300"
                                    >
                                        <div className={`p-5 border-b border-[var(--border-color)] bg-gradient-to-r from-${section.color}-500/5 to-transparent`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl bg-${section.color}-500/10`}>
                                                    <Icon className={`text-${section.color}-500`} size={20} />
                                                </div>
                                                <h2 className="text-xl font-bold text-[var(--text-main)]">
                                                    {section.title}
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            {section.content}
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Contact Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="rounded-2xl bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 border border-[var(--primary)]/30 p-6"
                            >
                                <div className="text-center">
                                    <Mail size={32} className="mx-auto mb-3 text-[var(--primary)]" />
                                    <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">Have Questions?</h3>
                                    <p className="text-[var(--text-muted)] mb-4">
                                        If you have any questions about this Privacy Policy, please contact our support team.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <a 
                                            href="mailto:webcarftservices@gmail.com"
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all duration-300"
                                        >
                                            <Mail size={16} />
                                            webcarftservices@gmail.com
                                        </a>
                                        <Link
                                            to="/"
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold hover:scale-105 transition-all duration-300"
                                        >
                                            Return to Dashboard
                                            <ExternalLink size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Footer Note */}
                            <div className="text-center text-xs text-[var(--text-muted)] pt-4">
                                <p>© 2025 CashCraft - AI Expense Tracker. All rights reserved.</p>
                                <p className="mt-1">This document was last updated on {lastUpdated.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;