import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
    Download, Github, Twitter, Linkedin, Mail, 
    Heart, Zap, Shield, TrendingUp, Brain, 
    ChevronRight, Sparkles, Smartphone, Globe,
    Instagram, Facebook, Youtube
} from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = ({ installPrompt, onInstallClick }) => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail('');
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    const footerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const quickLinks = [
        { path: '/', label: 'Dashboard', icon: TrendingUp },
        { path: '/reports', label: 'Reports', icon: Zap },
        { path: '/ai-insights', label: 'AI Insights', icon: Brain },
        { path: '/privacy-policy', label: 'Privacy Policy', icon: Shield }
    ];

    const socialLinks = [
        { name: 'GitHub', icon: Github, url: 'https://github.com/Mayur111-code', color: 'hover:text-gray-400' },
       // { name: 'Twitter', icon: Twitter, url: '', color: 'hover:text-blue-400' },
        { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/mayur-borse-88b802367/', color: 'hover:text-blue-500' },
        { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/web_craft_services?igsh=aDVtazJpeWxmdm9h', color: 'hover:text-pink-500' }
    ];

    const features = [
        { name: 'AI-Powered Insights', icon: Brain, color: 'text-purple-500' },
        { name: 'Smart Budgeting', icon: Shield, color: 'text-green-500' },
        { name: 'Expense Tracking', icon: TrendingUp, color: 'text-blue-500' },
        { name: 'PWA Support', icon: Smartphone, color: 'text-yellow-500' }
    ];

    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={footerVariants}
            className="relative mt-auto overflow-hidden bg-gradient-to-b from-[var(--card-bg)] to-[var(--bg-color)] border-t border-[var(--border-color)] pt-12 pb-6"
        >
            {/* Animated Gradient Border Top */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent animate-pulse" />
            
            {/* Background Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl" />
            <div className="absolute top-20 right-0 w-80 h-80 bg-[var(--secondary)]/5 rounded-full blur-3xl" />
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
                    
                    {/* Brand Section */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                                <Sparkles size={20} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                                CashCraft
                            </h2>
                        </div>
                        <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                            Where your spending finds clarity. Smart AI-powered expense tracking for modern financial management.
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex gap-3 pt-2">
                            {socialLinks.map((social, idx) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={idx}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`p-2 rounded-lg bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-muted)] transition-all duration-300 hover:scale-110 ${social.color}`}
                                        aria-label={social.name}
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-sm font-semibold text-[var(--text-main)] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Zap size={14} className="text-[var(--primary)]" />
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link, idx) => {
                                const Icon = link.icon;
                                return (
                                    <li key={idx}>
                                        <Link
                                            to={link.path}
                                            className="group flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-all duration-300 text-sm"
                                        >
                                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                            <Icon size={14} className="opacity-50 group-hover:opacity-100" />
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </motion.div>

                    {/* Features */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-sm font-semibold text-[var(--text-main)] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Sparkles size={14} className="text-[var(--primary)]" />
                            Features
                        </h3>
                        <ul className="space-y-2">
                            {features.map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <li key={idx} className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                                        <Icon size={14} className={feature.color} />
                                        {feature.name}
                                    </li>
                                );
                            })}
                        </ul>
                    </motion.div>

                    {/* Newsletter & Install */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <h3 className="text-sm font-semibold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-2">
                            <Mail size={14} className="text-[var(--primary)]" />
                            Stay Updated
                        </h3>
                        
                        {/* Newsletter Form */}
                        <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-2.5 pr-24 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] text-sm placeholder:text-[var(--text-muted)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1 top-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white text-xs font-semibold hover:scale-105 transition-all duration-300"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </form>

                        {/* Success Message */}
                        {isSubscribed && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-xs text-green-500 flex items-center gap-1"
                            >
                                <Heart size={12} />
                                Thanks for subscribing!
                            </motion.p>
                        )}

                        {/* Install Button */}
                        {installPrompt && !window.matchMedia('(display-mode: standalone)').matches && (
                            <button
                                onClick={onInstallClick}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                className="w-full group relative overflow-hidden px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-105"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Download size={16} className={isHovered ? 'animate-bounce' : ''} />
                                    Install App
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                        )}

                        {/* Contact Info */}
                        <div className="flex items-center gap-2 pt-2">
                            <Mail size={14} className="text-[var(--primary)]" />
                            <a href="mailto: webcarftservices@gmail.com" className="text-[var(--text-muted)] text-sm hover:text-[var(--primary)] transition-all duration-300">
                                webcarftservices@gmail.com
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div 
                    variants={itemVariants}
                    className="pt-6 mt-6 border-t border-[var(--border-color)]"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                            <span>© {currentYear} CashCraft Powered by Webcraft </span>
                            <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]/50" />
                            <span>All rights reserved</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                            <a href="/privacy-policy" className="hover:text-[var(--primary)] transition-all duration-300">
                                Privacy Policy
                            </a>
                            <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]/50" />
                            <a href="/terms" className="hover:text-[var(--primary)] transition-all duration-300">
                                Terms of Service
                            </a>
                            <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]/50" />
                            <div className="flex items-center gap-1">
                                <Heart size={10} className="text-red-500 animate-pulse" />
                                <span>Made with love by</span>
                                <a
                                    href="https://web-craft-services.vercel.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--primary)] font-semibold hover:underline transition-all duration-300"
                                >
                                    WEB CRAFT SERVICES
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Version Badge */}
                <motion.div 
                    variants={itemVariants}
                    className="absolute bottom-4 right-4 opacity-30"
                >
                    <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                        <Globe size={10} />
                        v2.0.0
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
};

export default Footer;