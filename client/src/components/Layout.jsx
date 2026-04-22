import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp, Wifi, WifiOff, Loader2 } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    // PWA Install Prompt Handler
    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setInstallPrompt(e);
            console.log("PWA Install Prompt captured");
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    // Network Status Handler
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Scroll to Top Handler
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 500);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to Top on Route Change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    const handleInstallClick = async () => {
        if (!installPrompt) {
            alert("Installation is not currently available. \n\nThis could be because:\n1. The app is already installed.\n2. You are not using a supported browser (Chrome/Edge).\n3. You haven't interacted with the page enough.");
            return;
        }
        installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
            setInstallPrompt(null);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Page transition variants
    const pageVariants = {
        initial: {
            opacity: 0,
            y: 20
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.3,
                ease: "easeIn"
            }
        }
    };

    return (
        <div className="layout-wrapper min-h-screen flex flex-col bg-[var(--bg-color)]">
            {/* Network Status Bar */}
            <AnimatePresence>
                {!isOnline && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-0 left-0 right-0 z-[200] bg-red-500/90 backdrop-blur-md text-white py-2 px-4 text-center text-sm font-medium"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <WifiOff size={16} />
                            You are offline. Some features may be unavailable.
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Online Indicator (Floating) */}
            <AnimatePresence>
                {isOnline && !navigator.onLine === false && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed bottom-20 right-4 z-50 bg-green-500/90 backdrop-blur-md rounded-full px-3 py-1.5 text-xs text-white font-medium flex items-center gap-1.5 shadow-lg"
                    >
                        <Wifi size={12} />
                        Online
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] bg-[var(--bg-color)]/80 backdrop-blur-sm flex items-center justify-center"
                    >
                        <div className="bg-[var(--card-bg)] rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full border-4 border-[var(--border-color)] border-t-[var(--primary)] animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full bg-[var(--primary)] animate-pulse" />
                                </div>
                            </div>
                            <p className="text-sm text-[var(--text-muted)]">Loading...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navbar */}
            <Navbar installPrompt={installPrompt} onInstallClick={handleInstallClick} />

            {/* Main Content with Page Transitions */}
            <motion.main
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex-1 page-content"
            >
                {children}
            </motion.main>

            {/* Footer */}
            <Footer installPrompt={installPrompt} onInstallClick={handleInstallClick} />

            {/* Back to Top Button */}
            <AnimatePresence>
                {showBackToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={scrollToTop}
                        className="fixed bottom-24 right-4 z-50 p-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
                        aria-label="Back to top"
                    >
                        <ArrowUp size={20} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* PWA Install Prompt (Custom Banner) */}
            <AnimatePresence>
                {installPrompt && !window.matchMedia('(display-mode: standalone)').matches && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-0 left-0 right-0 z-[100] bg-[var(--card-bg)] border-t border-[var(--border-color)] shadow-2xl p-4"
                    >
                        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-[var(--text-main)]">Install CashCraft App</p>
                                    <p className="text-xs text-[var(--text-muted)]">Get faster access and offline support</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setInstallPrompt(null)}
                                    className="px-4 py-2 rounded-full bg-[var(--element-bg)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                                >
                                    Maybe Later
                                </button>
                                <button
                                    onClick={handleInstallClick}
                                    className="px-6 py-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold hover:scale-105 transition-all duration-300"
                                >
                                    Install Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Layout;