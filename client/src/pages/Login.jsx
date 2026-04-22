import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mail, Lock, Eye, EyeOff, LogIn, 
    Github, Chrome, ArrowRight, Sparkles,
    Shield, CheckCircle, AlertCircle
} from 'lucide-react';
import logo from '../assets/logo1.png';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Load saved email if remember me was checked
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setFormData(prev => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Basic validation
        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            await login(formData.email, formData.password);
            
            // Save email if remember me is checked
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        setIsLoading(true);
        // Implement social login logic here
        console.log(`Login with ${provider}`);
        setTimeout(() => setIsLoading(false), 1000);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--bg-color)] via-[var(--bg-color)] to-[var(--element-bg)] flex items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--secondary)]/10 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-3xl" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md relative z-10"
            >
                {/* Logo & Brand */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <div className="inline-block p-3 rounded-2xl bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 mb-4">
                        <img src={logo} alt="CashCraft" className="h-16 w-auto" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-[var(--text-muted)] mt-2">Sign in to continue your financial journey</p>
                </motion.div>

                {/* Login Card */}
                <motion.div 
                    variants={itemVariants}
                    className="bg-[var(--card-bg)] backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-[var(--border-color)] shadow-2xl overflow-hidden"
                >
                    <div className="p-6 sm:p-8">
                        {/* Success Message */}
                        <AnimatePresence>
                            {showSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-center gap-2"
                                >
                                    <CheckCircle size={16} />
                                    Login successful! Redirecting...
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-2"
                                >
                                    <AlertCircle size={16} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
                                    <Mail size={14} />
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="Enter your email"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
                                    <Lock size={14} />
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="w-full pl-10 pr-12 py-3 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Enter your password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-all duration-300"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--primary)] focus:ring-[var(--primary)] focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-[var(--text-muted)]">Remember me</span>
                                </label>
                                <Link 
                                    to="/forgot-password" 
                                    className="text-sm text-[var(--primary)] hover:text-[var(--secondary)] transition-all duration-300 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full relative overflow-hidden group py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Logging in...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn size={18} />
                                            Login
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[var(--border-color)]"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-3 bg-[var(--card-bg)] text-[var(--text-muted)]">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleSocialLogin('google')}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all duration-300 disabled:opacity-50"
                            >
                                <Chrome size={18} />
                                <span className="text-sm">Google</span>
                            </button>
                            <button
                                onClick={() => handleSocialLogin('github')}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all duration-300 disabled:opacity-50"
                            >
                                <Github size={18} />
                                <span className="text-sm">GitHub</span>
                            </button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-[var(--text-muted)]">
                                Don't have an account?{' '}
                                <Link 
                                    to="/register" 
                                    className="text-[var(--primary)] font-semibold hover:text-[var(--secondary)] transition-all duration-300 hover:underline"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Security Note */}
                <motion.div 
                    variants={itemVariants}
                    className="mt-6 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-2"
                >
                    <Shield size={12} />
                    Secure login with 256-bit encryption
                    <Sparkles size={12} className="text-[var(--primary)]" />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;