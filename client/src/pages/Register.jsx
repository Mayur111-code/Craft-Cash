import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield, Sparkles, Github, Chrome, ArrowRight, Smartphone } from 'lucide-react';
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

  const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    let label = '', color = '';
    if (score <= 2) { label = 'Weak'; color = '#ff7c7c'; }
    else if (score <= 4) { label = 'Medium'; color = '#d8b5ff'; }
    else { label = 'Strong'; color = '#5eead4'; }
    setPasswordStrength({ score, label, color, percent: (score / 6) * 100 });
  };

  useEffect(() => { if (formData.password) checkPasswordStrength(formData.password); }, [formData.password]);
  useEffect(() => { let timer; if (step === 2 && timeLeft > 0) timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000); return () => clearInterval(timer); }, [step, timeLeft]);
  useEffect(() => { let timer; if (resendCooldown > 0) timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000); return () => clearInterval(timer); }, [resendCooldown]);
  useEffect(() => { if (step === 2 && otpInputs.current[0]) otpInputs.current[0].focus(); }, [step]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpInputs.current[index + 1].focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpInputs.current[index - 1].focus();
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
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!acceptedTerms) { setError('Please accept Terms and Conditions'); return; }
    if (formData.password.length < 6) { setError('Password must be 6+ characters'); return; }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      setStep(2);
      setSuccess('Verification code sent!');
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
    if (otpValue.length !== 6) { setError('Enter the 6-digit code'); return; }
    setLoading(true);
    try {
      await verifyOtp(formData.name, formData.email, formData.password, otpValue);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    setLoading(true);
    console.log('Signup with ' + provider);
    setTimeout(() => setLoading(false), 1000);
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-12 text-slate-100">
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10 mx-auto w-full max-w-xl">
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="mx-auto inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-emerald-500/10 to-cyan-400/10 p-4 shadow-[0_24px_90px_-45px_rgba(16,185,129,0.8)]">
            <img src={logo} alt="CashCraft" className="h-14 w-auto" />
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{step === 1 ? 'Create Account' : 'Verify Email'}</h1>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">{step === 1 ? 'Start your financial journey' : `Code sent to ${formData.email}`}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-8">
          <AnimatePresence>
            {success && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300"><CheckCircle size={16} />{success}</motion.div>)}
          </AnimatePresence>
          <AnimatePresence>
            {error && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200"><AlertCircle size={16} />{error}</motion.div>)}
          </AnimatePresence>

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-200"><User size={16} />Full Name</label>
                <div className="relative"><User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" required placeholder="Your name" value={formData.name} disabled={loading} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-10 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20" /></div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-200"><Mail size={16} />Email Address</label>
                <div className="relative"><Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input type="email" required placeholder="your@email.com" value={formData.email} disabled={loading} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-10 py-3 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20" /></div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-200"><Lock size={16} />Password</label>
                <div className="relative"><Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input type={showPassword ? 'text' : 'password'} required placeholder="Create strong password" value={formData.password} disabled={loading} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-10 py-3 pr-12 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-emerald-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
                {formData.password && (<div className="space-y-1"><div className="flex justify-between text-xs"><span className="text-slate-400">Strength:</span><span style={{ color: passwordStrength.color }}>{passwordStrength.label}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-700"><div className="h-full rounded-full transition-all duration-300" style={{ width: `${passwordStrength.percent}%`, backgroundColor: passwordStrength.color }} /></div></div>)}
              </div>
              <label className="flex items-start gap-3"><input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-400" /><span className="text-sm text-slate-400">I agree to <Link to="/terms" className="text-emerald-400 hover:underline">Terms</Link> and <Link to="/privacy-policy" className="text-emerald-400 hover:underline">Privacy</Link></span></label>
              <button type="submit" disabled={loading} className="group relative flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"><span className="relative z-10 flex items-center gap-2">{loading ? (<><div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />Sending...</>) : (<>Sign Up<ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" /></>)}</span></button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="text-center"><div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium bg-slate-800/50 text-slate-300"><Smartphone size={14} />Expires: {formatTime(timeLeft)}</div></div>
              <div className="space-y-3"><label className="block text-center text-sm font-semibold text-slate-200">Enter 6-digit code</label><div className="flex justify-center gap-2">{otp.map((digit, index) => (<input key={index} ref={(el) => (otpInputs.current[index] = el)} type="text" maxLength={1} value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(index, e)} disabled={loading} className="h-12 w-12 rounded-xl border border-slate-800 bg-slate-950/90 text-center text-xl font-bold text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 sm:h-14 sm:w-14" />))}</div></div>
              <button type="submit" disabled={loading || timeLeft === 0} className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60">{loading ? (<span className="flex items-center gap-2"><div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />Verifying...</span>) : ('Verify & Login')}</button>
              <div className="space-y-2 text-center"><button type="button" onClick={handleResend} disabled={resendCooldown > 0 || loading} className="text-sm text-slate-400 transition-all duration-300 hover:text-emerald-400 disabled:opacity-50">{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}</button><button type="button" onClick={() => { setStep(1); setTimeLeft(600); setOtp(['', '', '', '', '', '']); setError(''); }} className="block w-full text-center text-sm text-slate-400 transition hover:text-emerald-400">← Change email</button></div>
            </form>
          )}

          {step === 1 && (<><div className="relative my-6 text-center text-xs text-slate-500"><div className="absolute inset-x-0 top-1/2 h-px bg-slate-800" /><span className="relative bg-slate-900 px-3">Or sign up with</span></div><div className="grid gap-3 sm:grid-cols-2"><button type="button" disabled={loading} onClick={() => handleSocialSignup('google')} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 transition hover:border-emerald-400 hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60"><Chrome size={18} /> Google</button><button type="button" disabled={loading} onClick={() => handleSocialSignup('github')} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 transition hover:border-cyan-400 hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60"><Github size={18} /> GitHub</button></div></>)}

          <div className="mt-6 text-center text-sm text-slate-400">Already have an account? <Link className="font-semibold text-emerald-400 transition hover:text-cyan-400 hover:underline" to="/login">Sign in</Link></div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500"><Shield size={12} />Protected with 256-bit encryption<Sparkles size={12} className="text-emerald-400" /></motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
