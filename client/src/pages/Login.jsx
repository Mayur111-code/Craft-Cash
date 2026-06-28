// import { useState, useContext, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import AuthContext from '../context/AuthContext';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   LogIn,
//   Github,
//   Chrome,
//   ArrowRight,
//   Sparkles,
//   Shield,
//   CheckCircle,
//   AlertCircle,
// } from 'lucide-react';
// import logo from '../assets/logo1.png';

// const Login = () => {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   useEffect(() => {
//     const savedEmail = localStorage.getItem('rememberedEmail');
//     if (savedEmail) {
//       setFormData((prev) => ({ ...prev, email: savedEmail }));
//       setRememberMe(true);
//     }
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     if (!formData.email.includes('@')) {
//       setError('Please enter a valid email address');
//       setIsLoading(false);
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       await login(formData.email, formData.password);
//       if (rememberMe) {
//         localStorage.setItem('rememberedEmail', formData.email);
//       } else {
//         localStorage.removeItem('rememberedEmail');
//       }
//       setShowSuccess(true);
//       setTimeout(() => {
//         navigate('/');
//       }, 1000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
//       setIsLoading(false);
//     }
//   };

//   const handleSocialLogin = (provider) => {
//     setIsLoading(true);
//     console.log(`Login with ${provider}`);
//     setTimeout(() => setIsLoading(false), 1000);
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 },
//   };

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-12 text-slate-100">
//       <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
//       <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />

//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="relative z-10 mx-auto w-full max-w-xl"
//       >
//         <motion.div variants={itemVariants} className="text-center mb-8">
//           <div className="mx-auto inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-emerald-500/10 to-cyan-400/10 p-4 shadow-[0_24px_90px_-45px_rgba(16,185,129,0.8)]">
//             <img src={logo} alt="CashCraft" className="h-14 w-auto" />
//           </div>
//           <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
//             Welcome Back
//           </h1>
//           <p className="mt-3 text-sm text-slate-400 sm:text-base">
//             Sign in to continue your financial journey.
//           </p>
//         </motion.div>

//         <motion.div
//           variants={itemVariants}
//           className="overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-8"
//         >
//           <AnimatePresence>
//             {showSuccess && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300"
//               >
//                 <CheckCircle size={16} />
//                 Login successful! Redirecting...
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <AnimatePresence>
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 className="mb-4 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200"
//               >
//                 <AlertCircle size={16} />
//                 {error}
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
//                 <Mail size={16} />
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
//                 <input
//                   type="email"
//                   required
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   disabled={isLoading}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-10 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
//                 <Lock size={16} />
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   required
//                   placeholder="Enter your password"
//                   value={formData.password}
//                   disabled={isLoading}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-10 py-3 pr-12 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-emerald-400"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//               <label className="flex items-center gap-2 text-sm text-slate-400">
//                 <input
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-400"
//                 />
//                 Remember me
//               </label>
//               <Link className="text-sm text-emerald-400 transition hover:text-cyan-400 hover:underline" to="/forgot-password">
//                 Forgot password?
//               </Link>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="group relative flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               <span className="relative z-10 flex items-center gap-2">
//                 {isLoading ? (
//                   <>
//                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
//                     Logging in...
//                   </>
//                 ) : (
//                   <>
//                     <LogIn size={18} />
//                     Login
//                     <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
//                   </>
//                 )}
//               </span>
//             </button>
//           </form>

//           <div className="relative my-6 text-center text-xs text-slate-500">
//             <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800" />
//             <span className="relative bg-slate-900 px-3">Or continue with</span>
//           </div>

//           <div className="grid gap-3 sm:grid-cols-2">
//             <button
//               type="button"
//               disabled={isLoading}
//               onClick={() => handleSocialLogin('google')}
//               className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 transition hover:border-emerald-400 hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               <Chrome size={18} /> Google
//             </button>
//             <button
//               type="button"
//               disabled={isLoading}
//               onClick={() => handleSocialLogin('github')}
//               className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 transition hover:border-cyan-400 hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               <Github size={18} /> GitHub
//             </button>
//           </div>

//           <div className="mt-6 text-center text-sm text-slate-400">
//             Don&apos;t have an account?{' '}
//             <Link className="font-semibold text-emerald-400 transition hover:text-cyan-400 hover:underline" to="/register">
//               Create an account
//             </Link>
//           </div>
//         </motion.div>

//         <motion.div variants={itemVariants} className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
//           <Shield size={12} />
//           Secure login with 256-bit encryption
//           <Sparkles size={12} className="text-emerald-400" />
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;





import { useState, useContext, useEffect, useCallback, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    Mail, Lock, Eye, EyeOff, LogIn, Github, Chrome,
    ArrowRight, Sparkles, Shield, CheckCircle, AlertCircle,
} from 'lucide-react';
import logo from '../assets/logo1.png';

// ─── Static animation variants (defined once outside component) ───────────────
const containerVariants = {
    hidden:  { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.09, delayChildren: 0.15 },
    },
};

const itemVariants = {
    hidden:  { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

const alertVariants = {
    hidden:  { opacity: 0, y: -10, scale: 0.97 },
    visible: { opacity: 1, y: 0,   scale: 1,    transition: { duration: 0.22, ease: 'easeOut' } },
    exit:    { opacity: 0, y: -8,  scale: 0.97, transition: { duration: 0.16 } },
};

const inputFocusVariants = {
    rest:    { scale: 1 },
    focused: { scale: 1.01, transition: { type: 'spring', stiffness: 400, damping: 25 } },
};

// ─── Alert banner (memoized) ──────────────────────────────────────────────────
const AlertBanner = memo(({ type, message }) => {
    const isSuccess = type === 'success';
    return (
        <motion.div
            variants={alertVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`mb-4 flex items-center gap-2 rounded-2xl border p-3 text-sm
                ${isSuccess
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-red-500/30 bg-red-500/10 text-red-200'
                }`}
        >
            {isSuccess ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {message}
        </motion.div>
    );
});
AlertBanner.displayName = 'AlertBanner';

// ─── Input field (memoized) ───────────────────────────────────────────────────
const InputField = memo(({ icon: Icon, label, type, placeholder, value, onChange, disabled, children }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Icon size={16} />
                {label}
            </label>
            <motion.div
                variants={inputFocusVariants}
                animate={focused ? 'focused' : 'rest'}
                className="relative"
            >
                <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                    type={type}
                    required
                    placeholder={placeholder}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/90
                        px-10 py-3 text-slate-100 placeholder:text-slate-500
                        outline-none transition-colors duration-200
                        focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20
                        disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {children}
            </motion.div>
        </div>
    );
});
InputField.displayName = 'InputField';

// ─── Social button (memoized) ─────────────────────────────────────────────────
const SocialButton = memo(({ icon: Icon, label, hoverClass, onClick, disabled }) => (
    <motion.button
        type="button"
        disabled={disabled}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`flex items-center justify-center gap-2 rounded-2xl border border-slate-800
            bg-slate-950/90 px-4 py-3 text-sm text-slate-100
            transition-colors duration-200 ${hoverClass}
            disabled:cursor-not-allowed disabled:opacity-50`}
    >
        <Icon size={18} /> {label}
    </motion.button>
));
SocialButton.displayName = 'SocialButton';

// ─── Login page ───────────────────────────────────────────────────────────────
const Login = () => {
    const { login }   = useContext(AuthContext);
    const navigate    = useNavigate();
    const shouldReduce = useReducedMotion();

    const [formData,     setFormData]     = useState({ email: '', password: '' });
    const [error,        setError]        = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading,    setIsLoading]    = useState(false);
    const [rememberMe,   setRememberMe]   = useState(false);
    const [showSuccess,  setShowSuccess]  = useState(false);

    // Load remembered email once on mount
    useEffect(() => {
        const saved = localStorage.getItem('rememberedEmail');
        if (saved) {
            setFormData(prev => ({ ...prev, email: saved }));
            setRememberMe(true);
        }
    }, []);

    const handleEmailChange    = useCallback(e => setFormData(p => ({ ...p, email:    e.target.value })), []);
    const handlePasswordChange = useCallback(e => setFormData(p => ({ ...p, password: e.target.value })), []);
    const togglePassword       = useCallback(() => setShowPassword(s => !s), []);
    const toggleRememberMe     = useCallback(e => setRememberMe(e.target.checked), []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
            rememberMe
                ? localStorage.setItem('rememberedEmail', formData.email)
                : localStorage.removeItem('rememberedEmail');
            setShowSuccess(true);
            setTimeout(() => navigate('/'), 900);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
            setIsLoading(false);
        }
    }, [formData, rememberMe, login, navigate]);

    const handleSocialLogin = useCallback((provider) => {
        // TODO: implement OAuth
        console.log(`Login with ${provider}`);
    }, []);

    const handleGoogle = useCallback(() => handleSocialLogin('google'), [handleSocialLogin]);
    const handleGithub = useCallback(() => handleSocialLogin('github'), [handleSocialLogin]);

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-12 text-slate-100">
            {/* Ambient glows */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />

            <motion.div
                variants={shouldReduce ? {} : containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 mx-auto w-full max-w-xl"
            >
                {/* Logo + heading */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <motion.div
                        whileHover={shouldReduce ? {} : { scale: 1.05, rotate: 2 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="mx-auto inline-flex items-center justify-center rounded-3xl
                            bg-gradient-to-r from-emerald-500/10 to-cyan-400/10 p-4
                            shadow-[0_24px_90px_-45px_rgba(16,185,129,0.8)]"
                    >
                        <img src={logo} alt="CashCraft" className="h-14 w-auto" />
                    </motion.div>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Welcome Back
                    </h1>
                    <p className="mt-3 text-sm text-slate-400 sm:text-base">
                        Sign in to continue your financial journey.
                    </p>
                </motion.div>

                {/* Card */}
                <motion.div
                    variants={itemVariants}
                    className="overflow-hidden rounded-[2rem] border border-slate-800/80
                        bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-8"
                >
                    {/* Alerts */}
                    <AnimatePresence mode="wait">
                        {showSuccess && (
                            <AlertBanner key="success" type="success" message="Login successful! Redirecting..." />
                        )}
                        {error && !showSuccess && (
                            <AlertBanner key="error" type="error" message={error} />
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <InputField
                            icon={Mail}
                            label="Email Address"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleEmailChange}
                            disabled={isLoading}
                        />

                        <InputField
                            icon={Lock}
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handlePasswordChange}
                            disabled={isLoading}
                        >
                            <motion.button
                                type="button"
                                onClick={togglePassword}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute right-3 top-1/2 -translate-y-1/2
                                    text-slate-400 hover:text-emerald-400 transition-colors duration-200"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={showPassword ? 'hide' : 'show'}
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0,   opacity: 1 }}
                                        exit={{   rotate:  90, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </motion.span>
                                </AnimatePresence>
                            </motion.button>
                        </InputField>

                        {/* Remember me + Forgot */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={toggleRememberMe}
                                    className="h-4 w-4 rounded border-slate-700 bg-slate-900
                                        text-emerald-500 focus:ring-emerald-400"
                                />
                                Remember me
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-emerald-400 hover:text-cyan-400 hover:underline transition-colors duration-200"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={shouldReduce ? {} : { scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="group relative flex w-full items-center justify-center rounded-2xl
                                bg-gradient-to-r from-emerald-500 to-cyan-400
                                px-6 py-3 text-sm font-semibold text-slate-950
                                transition-opacity duration-200
                                disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {isLoading ? (
                                    <motion.span
                                        key="loading"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                                        Logging in...
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="idle"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="flex items-center gap-2"
                                    >
                                        <LogIn size={18} />
                                        Login
                                        <ArrowRight
                                            size={18}
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6 text-center text-xs text-slate-500">
                        <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800" />
                        <span className="relative bg-slate-900 px-3">Or continue with</span>
                    </div>

                    {/* Social login */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <SocialButton
                            icon={Chrome}
                            label="Google"
                            hoverClass="hover:border-emerald-400 hover:bg-emerald-500/10"
                            onClick={handleGoogle}
                            disabled={isLoading}
                        />
                        <SocialButton
                            icon={Github}
                            label="GitHub"
                            hoverClass="hover:border-cyan-400 hover:bg-cyan-500/10"
                            onClick={handleGithub}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Register link */}
                    <p className="mt-6 text-center text-sm text-slate-400">
                        Don&apos;t have an account?{' '}
                        <Link
                            to="/register"
                            className="font-semibold text-emerald-400 hover:text-cyan-400 hover:underline transition-colors duration-200"
                        >
                            Create an account
                        </Link>
                    </p>
                </motion.div>

                {/* Footer badge */}
                <motion.div
                    variants={itemVariants}
                    className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500"
                >
                    <Shield size={12} />
                    Secure login with 256-bit encryption
                    <Sparkles size={12} className="text-emerald-400" />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default memo(Login);