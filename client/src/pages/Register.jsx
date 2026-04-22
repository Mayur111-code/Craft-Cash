import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Mail, Lock, Eye, EyeOff, 
    CheckCircle, AlertCircle, Shield, Sparkles,
    Github, Chrome, ArrowRight, Smartphone
} from 'lucide-react';
import logo from '../assets/logo1.png';

const Register = () => {
    const { register, verifyOtp, resendOtp } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600);
    const [resendCooldown, setResendCooldown] = useState(30);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
    const otpInputs = useRef([]);

    // Password strength checker
    const checkPasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        let label = '';
        let color = '';
        if (score <= 2) { label = 'Weak'; color = '#ff7c7c'; }
        else if (score <= 4) { label = 'Medium'; color = '#d8b5ff'; }
        else { label = 'Strong'; color = '#5eead4'; }

        setPasswordStrength({ score, label, color, percent: (score / 6) * 100 });
    };

    useEffect(() => {
        if (formData.password) {
            checkPasswordStrength(formData.password);
        }
    }, [formData.password]);

    useEffect(() => {
        let timer;
        if (step === 2 && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [step, timeLeft]);

    useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
            timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [resendCooldown]);

    // Auto-focus OTP inputs
    useEffect(() => {
        if (step === 2 && otpInputs.current[0]) {
            otpInputs.current[0].focus();
        }
    }, [step]);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpInputs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputs.current[index - 1].focus();
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setError('');
        try {
            await resendOtp(formData.email);
            setResendCooldown(30);
            setTimeLeft(600);
            setSuccess('New verification code sent!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!acceptedTerms) {
            setError('Please accept the Terms and Conditions');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password);
            setStep(2);
            setSuccess('Verification code sent to your email!');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const otpValue = otp.join('');
        
        if (otpValue.length !== 6) {
            setError('Please enter the 6-digit verification code');
            return;
        }

        setLoading(true);
        try {
            await verifyOtp(formData.name, formData.email, formData.password, otpValue);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignup = (provider) => {
        setLoading(true);
        console.log(`Signup with ${provider}`);
        setTimeout(() => setLoading(false), 1000);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--bg-color)] via-[var(--bg-color)] to-[var(--element-bg)] flex items-center justify-center px-4 py-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--secondary)]/10 rounded-full blur-3xl animate-pulse delay-1000" />

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
                        {step === 1 ? 'Create Account' : 'Verify Your Email'}
                    </h1>
                    <p className="text-[var(--text-muted)] mt-2">
                        {step === 1 
                            ? 'Start your journey to financial freedom' 
                            : `We sent a code to ${formData.email}`}
                    </p>
                </motion.div>

                {/* Register Card */}
                <motion.div 
                    variants={itemVariants}
                    className="bg-[var(--card-bg)] backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-[var(--border-color)] shadow-2xl overflow-hidden"
                >
                    <div className="p-6 sm:p-8">
                        {/* Success Message */}
                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-center gap-2"
                                >
                                    <CheckCircle size={16} />
                                    {success}
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

                        {step === 1 ? (
                            // Registration Form
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
                                        <User size={14} />
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter your full name"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

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
                                            disabled={loading}
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
                                            placeholder="Create a strong password"
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-all duration-300"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-[var(--text-muted)]">Password strength:</span>
                                                <span style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
                                            </div>
                                            <div className="h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full transition-all duration-300 rounded-full"
                                                    style={{ width: `${passwordStrength.percent}%`, backgroundColor: passwordStrength.color }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Terms & Conditions */}
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        className="mt-0.5 w-4 h-4 rounded border-[var(--border-color)] text-[var(--primary)] focus:ring-[var(--primary)] focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-[var(--text-muted)]">
                                        I agree to the{' '}
                                        <Link to="/terms" className="text-[var(--primary)] hover:underline">
                                            Terms of Service
                                        </Link>
                                        {' '}and{' '}
                                        <Link to="/privacy-policy" className="text-[var(--primary)] hover:underline">
                                            Privacy Policy
                                        </Link>
                                    </span>
                                </label>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full relative overflow-hidden group py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Sending OTP...
                                            </>
                                        ) : (
                                            <>
                                                Sign Up
                                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </button>
                            </form>
                        ) : (
                            // OTP Verification Form
                            <form onSubmit={handleOtpSubmit} className="space-y-5">
                                {/* Timer Display */}
                                <div className="text-center">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${timeLeft < 60 ? 'bg-red-500/10 text-red-500' : 'bg-[var(--primary)]/10 text-[var(--primary)]'}`}>
                                        <Smartphone size={14} />
                                        Code expires in: {formatTime(timeLeft)}
                                    </div>
                                </div>

                                {/* OTP Inputs */}
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-[var(--text-secondary)] text-center block">
                                        Enter 6-digit verification code
                                    </label>
                                    <div className="flex gap-2 justify-center">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={el => otpInputs.current[index] = el}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300"
                                                disabled={loading}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || timeLeft === 0}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Verifying...
                                        </span>
                                    ) : (
                                        'Verify & Login'
                                    )}
                                </button>

                                {/* Resend Code */}
                                <div className="text-center space-y-2">
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={resendCooldown > 0 || loading}
                                        className={`text-sm transition-all duration-300 ${resendCooldown > 0 ? 'text-[var(--text-muted)] cursor-not-allowed' : 'text-[var(--primary)] hover:underline'}`}
                                    >
                                        {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep(1);
                                            setTimeLeft(600);
                                            setOtp(['', '', '', '', '', '']);
                                            setError('');
                                        }}
                                        className="block w-full text-center text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-all duration-300"
                                    >
                                        ← Change email address
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Divider for Social Signup */}
                        {step === 1 && (
                            <>
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-[var(--border-color)]" />
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-3 bg-[var(--card-bg)] text-[var(--text-muted)]">Or sign up with</span>
                                    </div>
                                </div>

                                {/* Social Signup Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleSocialSignup('google')}
                                        disabled={loading}
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all duration-300 disabled:opacity-50"
                                    >
                                        <Chrome size={18} />
                                        <span className="text-sm">Google</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSocialSignup('github')}
                                        disabled={loading}
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all duration-300 disabled:opacity-50"
                                    >
                                        <Github size={18} />
                                        <span className="text-sm">GitHub</span>
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-[var(--text-muted)]">
                                Already have an account?{' '}
                                <Link 
                                    to="/login" 
                                    className="text-[var(--primary)] font-semibold hover:text-[var(--secondary)] transition-all duration-300 hover:underline"
                                >
                                    Sign in
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
                    Your data is protected with 256-bit encryption
                    <Sparkles size={12} className="text-[var(--primary)]" />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Register;