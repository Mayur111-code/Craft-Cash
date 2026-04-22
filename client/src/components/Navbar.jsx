import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Download, Sun, Moon, Sparkles, User, LogOut, ChevronDown, Home, BarChart3, Bot } from 'lucide-react';
import logo1 from '../assets/logo1.png';
import logo2 from '../assets/logo2.png';
import AuthContext from '../context/AuthContext';

const Navbar = ({ installPrompt, onInstallClick }) => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const isActive = (path) => {
        if (path === '/') return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        setShowUserMenu(false);
    }, [location]);

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.style.setProperty('--primary', '#7fc9ff');
            root.style.setProperty('--secondary', '#7f81ff');
            root.style.setProperty('--bg-color', '#07121f');
            root.style.setProperty('--surface-color', 'rgba(10, 18, 31, 0.92)');
            root.style.setProperty('--text-main', '#f6f9ff');
            root.style.setProperty('--text-muted', '#a9b6d6');
            root.style.setProperty('--card-bg', 'rgba(20, 32, 56, 0.98)');
            root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.08)');
        } else {
            root.style.setProperty('--primary', '#4f46e5');
            root.style.setProperty('--secondary', '#7c3aed');
            root.style.setProperty('--bg-color', '#f8fafc');
            root.style.setProperty('--surface-color', '#ffffff');
            root.style.setProperty('--text-main', '#0f172a');
            root.style.setProperty('--text-muted', '#64748b');
            root.style.setProperty('--card-bg', '#ffffff');
            root.style.setProperty('--border-color', '#e2e8f0');
        }
    }, [isDarkMode]);

    const navItems = [
        { path: '/', label: 'Dashboard', icon: Home },
        { path: '/reports', label: 'Reports', icon: BarChart3 },
        { path: '/ai-insights', label: 'AI Insights', icon: Bot },
    ];

    return (
        <>
            <nav className={`
                fixed top-0 left-0 w-full z-50 transition-all duration-500
                ${scrolled 
                    ? 'bg-[var(--bg-color)]/95 backdrop-blur-xl shadow-2xl border-b border-[var(--border-color)]' 
                    : 'bg-[var(--bg-color)]/80 backdrop-blur-md border-b border-[var(--border-color)]/50'
                }
            `}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        
                        {/* Logo */}
                        <Link 
                            to="/" 
                            className="flex items-center gap-2 group"
                        >
                            <div className="relative">
                                <img 
                                    src={isDarkMode ? logo2 : logo1} 
                                    alt="CashCraft" 
                                    className="h-9 w-auto lg:h-11 transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <img src={isDarkMode ? logo2 : logo1} alt="" className="h-9 w-auto lg:h-11" />
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                                    CashCraft
                                </span>
                                <span className="text-[10px] lg:text-xs text-[var(--text-muted)] block -mt-1">Smart Finance</span>
                            </div>
                            <Sparkles className="hidden lg:block w-4 h-4 text-[var(--primary)] animate-pulse" />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1 bg-[var(--element-bg)]/30 rounded-full p-1 backdrop-blur-sm">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`
                                            relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                                            flex items-center gap-2
                                            ${active 
                                                ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg' 
                                                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--element-bg)]/50'
                                            }
                                        `}
                                    >
                                        <Icon size={16} className={active ? 'text-white' : ''} />
                                        {item.label}
                                        {active && (
                                            <span className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Desktop Right Section */}
                        <div className="hidden md:flex items-center gap-3">
                            {/* Install Button */}
                            {installPrompt && (
                                <button
                                    onClick={onInstallClick}
                                    className="group relative px-4 py-2 rounded-full text-sm font-semibold
                                        bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]
                                        text-white shadow-lg hover:shadow-xl transition-all duration-300
                                        hover:scale-105 active:scale-95 flex items-center gap-2 overflow-hidden"
                                >
                                    <Download size={16} className="group-hover:animate-bounce" />
                                    Install
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </button>
                            )}

                            {/* Theme Toggle */}
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="p-2 rounded-full bg-[var(--element-bg)] border border-[var(--border-color)]
                                    hover:scale-110 transition-all duration-300 hover:rotate-12"
                                aria-label="Toggle theme"
                            >
                                {isDarkMode ? 
                                    <Sun size={18} className="text-yellow-400" /> : 
                                    <Moon size={18} className="text-slate-700" />
                                }
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-[var(--element-bg)] 
                                        border border-[var(--border-color)] hover:border-[var(--primary)]/50 transition-all duration-300
                                        hover:scale-105"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] 
                                        flex items-center justify-center text-white font-bold text-sm">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <div className="text-sm font-semibold text-[var(--text-main)]">
                                            {user?.name?.split(' ')[0] || 'User'}
                                        </div>
                                    </div>
                                    <ChevronDown size={14} className="text-[var(--text-muted)] hidden lg:block" />
                                </button>

                                {/* Dropdown */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[var(--element-bg)] 
                                        border border-[var(--border-color)] shadow-2xl overflow-hidden
                                        animate-[slideDown_0.2s_ease]">
                                        <div className="p-3 border-b border-[var(--border-color)]">
                                            <div className="font-semibold text-[var(--text-main)]">{user?.name}</div>
                                            <div className="text-xs text-[var(--text-muted)] mt-0.5">{user?.email}</div>
                                        </div>
                                        <div className="p-2">
                                            <button
                                                onClick={logout}
                                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 
                                                    hover:bg-red-500/10 transition-all duration-300"
                                            >
                                                <LogOut size={16} />
                                                <span className="text-sm font-medium">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Controls */}
                        <div className="flex md:hidden items-center gap-2">
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="p-2 rounded-full bg-[var(--element-bg)] border border-[var(--border-color])"
                            >
                                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                            
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white"
                            >
                                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`
                    md:hidden fixed left-0 right-0 bg-[var(--bg-color)]/95 backdrop-blur-xl
                    border-t border-[var(--border-color)] shadow-2xl transition-all duration-400
                    ${isMenuOpen 
                        ? 'top-16 opacity-100 visible' 
                        : 'top-[-100%] opacity-0 invisible'
                    }
                `}>
                    <div className="p-4 space-y-2 max-h-[80vh] overflow-y-auto">
                        {/* User Info */}
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] 
                                flex items-center justify-center text-white font-bold text-lg">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold text-[var(--text-main)]">{user?.name}</div>
                                <div className="text-xs text-[var(--text-muted)]">{user?.email}</div>
                            </div>
                        </div>

                        {/* Nav Links */}
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl font-medium
                                        transition-all duration-300
                                        ${active
                                            ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white'
                                            : 'text-[var(--text-muted)] hover:bg-[var(--element-bg)] hover:text-[var(--text-main)]'
                                        }
                                    `}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </Link>
                            );
                        })}

                        {/* Install Button */}
                        {installPrompt && (
                            <button
                                onClick={onInstallClick}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                                    bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold
                                    mt-4 hover:scale-105 transition-all duration-300"
                            >
                                <Download size={18} />
                                Install App
                            </button>
                        )}

                        {/* Logout */}
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                                bg-red-500/10 text-red-500 border border-red-500/20 font-semibold
                                hover:bg-red-500 hover:text-white transition-all duration-300 mt-2"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Spacer to prevent content hiding under navbar */}
            <div className="h-16 lg:h-20" />
        </>
    );
};

export default Navbar;