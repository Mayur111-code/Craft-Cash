import { useState, useEffect, useContext, useCallback } from 'react';
import ExpenseContext from '../context/ExpenseContext';
import { Wand2, Loader2, CheckCircle, AlertCircle, Save, Trash2, Calendar, Tag, CreditCard, FileText, Repeat } from 'lucide-react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
    { value: 'Food', label: '🍔 Food', color: '#7fc9ff' },
    { value: 'Travel', label: '✈️ Travel', color: '#7f81ff' },
    { value: 'Bills', label: '📄 Bills', color: '#ff7c7c' },
    { value: 'Shopping', label: '🛍️ Shopping', color: '#d8b5ff' },
    { value: 'Medical', label: '🏥 Medical', color: '#5eead4' },
    { value: 'Entertainment', label: '🎬 Entertainment', color: '#ffb347' },
    { value: 'Other', label: '📌 Other', color: '#a9b6d6' }
];

const paymentMethods = [
    { value: 'Cash', label: '💵 Cash', icon: '💰' },
    { value: 'UPI', label: '📱 UPI', icon: '📱' },
    { value: 'Card', label: '💳 Card', icon: '💳' },
    { value: 'Bank', label: '🏦 Bank Transfer', icon: '🏦' }
];

const budgetCategories = [
    { value: 'Needs', label: 'Needs (50%)', description: 'Essential expenses', color: '#7fc9ff' },
    { value: 'Wants', label: 'Wants (30%)', description: 'Discretionary spending', color: '#d8b5ff' },
    { value: 'Savings', label: 'Savings (20%)', description: 'Future goals', color: '#5eead4' }
];

const frequencies = [
    { value: 'Weekly', label: 'Weekly', icon: '📅' },
    { value: 'Monthly', label: 'Monthly', icon: '📆' },
    { value: 'Yearly', label: 'Yearly', icon: '📅' }
];

const ExpenseForm = ({ existingExpense, onClose }) => {
    const { addExpense, updateExpense } = useContext(ExpenseContext);
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        budgetCategory: 'Needs',
        notes: '',
        isRecurring: false,
        frequency: 'Monthly'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isCategorizing, setIsCategorizing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
    const [draftSaved, setDraftSaved] = useState(false);

    // Load draft from localStorage on mount
    useEffect(() => {
        if (!existingExpense) {
            const draft = localStorage.getItem('expenseFormDraft');
            if (draft) {
                const parsedDraft = JSON.parse(draft);
                if (Date.now() - parsedDraft.timestamp < 24 * 60 * 60 * 1000) { // 24 hours expiry
                    setFormData(prev => ({ ...prev, ...parsedDraft.data }));
                    setDraftSaved(true);
                }
            }
        }
    }, [existingExpense]);

    // Save draft to localStorage
    const saveDraft = useCallback(() => {
        if (!existingExpense && formData.title) {
            const draft = {
                data: formData,
                timestamp: Date.now()
            };
            localStorage.setItem('expenseFormDraft', JSON.stringify(draft));
            setDraftSaved(true);
            setTimeout(() => setDraftSaved(false), 2000);
        }
    }, [formData, existingExpense]);

    // Auto-save draft every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (formData.title && !existingExpense) {
                saveDraft();
            }
        }, 30000);
        
        return () => clearInterval(interval);
    }, [formData, existingExpense, saveDraft]);

    // Clear draft on successful submit
    const clearDraft = () => {
        localStorage.removeItem('expenseFormDraft');
        setDraftSaved(false);
    };

    useEffect(() => {
        if (existingExpense) {
            setFormData({
                ...existingExpense,
                date: new Date(existingExpense.date).toISOString().split('T')[0],
                isRecurring: existingExpense.isRecurring || false,
                frequency: existingExpense.frequency || 'Monthly'
            });
        }
    }, [existingExpense]);

    // Client-side keyword mapping (fallback)
    useEffect(() => {
        if (existingExpense) return;

        const lowerTitle = formData.title.toLowerCase();
        const rules = {
            'Food': ['kfc', 'mcdonalds', 'pizza', 'burger', 'restaurant', 'cafe', 'coffee', 'swiggy', 'zomato', 'dinner', 'lunch', 'breakfast', 'food', 'meal'],
            'Travel': ['uber', 'ola', 'rapido', 'bus', 'train', 'flight', 'petrol', 'fuel', 'taxi', 'cab', 'metro'],
            'Shopping': ['amazon', 'flipkart', 'myntra', 'clothes', 'shoes', 'mall', 'shopping', 'purchase', 'buy'],
            'Bills': ['electricity', 'water', 'internet', 'wifi', 'mobile', 'recharge', 'bill', 'rent', 'gas', 'broadband'],
            'Medical': ['doctor', 'medicine', 'hospital', 'pharmacy', 'clinic', 'health', 'medical'],
            'Entertainment': ['movie', 'cinema', 'netflix', 'prime', 'game', 'sports', 'concert', 'show']
        };

        for (const [cat, keywords] of Object.entries(rules)) {
            if (keywords.some(k => lowerTitle.includes(k))) {
                setFormData(prev => ({ ...prev, category: cat }));
                break;
            }
        }
    }, [formData.title, existingExpense]);

    const handleAICategorize = async () => {
        if (!formData.title) return;
        setIsCategorizing(true);
        try {
            const { data } = await api.post('/ai/categorize', { title: formData.title });
            if (data.category && categories.some(c => c.value === data.category)) {
                setFormData(prev => ({ ...prev, category: data.category }));
                setSuccess('AI categorized successfully!');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            console.error("AI Auto-cat failed", err);
            setError('AI categorization failed. Using manual selection.');
            setTimeout(() => setError(''), 3000);
        } finally {
            setIsCategorizing(false);
        }
    };

    const formatAmount = (value) => {
        if (!value) return '';
        const num = parseFloat(value);
        if (isNaN(num)) return value;
        return num.toLocaleString('en-IN');
    };

    const handleAmountChange = (e) => {
        const rawValue = e.target.value.replace(/,/g, '');
        if (rawValue === '' || /^\d*\.?\d*$/.test(rawValue)) {
            setFormData({ ...formData, amount: rawValue });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.title.trim()) {
            setError('Please enter a title');
            return;
        }
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setIsSubmitting(true);
        setShowSaveConfirmation(false);

        const payload = {
            ...formData,
            amount: parseFloat(formData.amount),
            title: formData.title.trim(),
            notes: formData.notes?.trim() || ''
        };

        let result;
        if (existingExpense) {
            result = await updateExpense(existingExpense._id, payload);
        } else {
            result = await addExpense(payload);
        }

        if (result.success) {
            clearDraft();
            setSuccess(existingExpense ? 'Expense updated successfully!' : 'Expense added successfully!');
            setTimeout(() => {
                onClose();
            }, 1000);
        } else {
            setError(result.message || 'Something went wrong. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit} 
            onKeyPress={handleKeyPress}
            className="space-y-5"
        >
            {/* Draft Saved Indicator */}
            <AnimatePresence>
                {draftSaved && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-xs"
                    >
                        <Save size={12} />
                        Draft saved locally
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
                {success && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm"
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
                        className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
                    >
                        <AlertCircle size={16} />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Title Field */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
                        <Tag size={14} />
                        Title
                    </label>
                    <button
                        type="button"
                        onClick={handleAICategorize}
                        disabled={isCategorizing || !formData.title}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 border border-[var(--primary)]/30 text-[var(--primary)] hover:from-[var(--primary)] hover:to-[var(--secondary)] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isCategorizing ? (
                            <Loader2 size={12} className="animate-spin" />
                        ) : (
                            <Wand2 size={12} />
                        )}
                        {isCategorizing ? 'Analyzing...' : 'AI Categorize'}
                    </button>
                </div>
                <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Dinner at KFC, Uber Ride, Netflix Subscription"
                    autoFocus
                />
            </div>

            {/* Amount & Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
                        <DollarSignIcon size={14} className="text-[var(--primary)]" />
                        Amount (₹)
                    </label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300"
                        value={formatAmount(formData.amount)}
                        onChange={handleAmountChange}
                        placeholder="0.00"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
                        <Calendar size={14} />
                        Date
                    </label>
                    <input
                        type="date"
                        className="w-full px-4 py-3 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>
            </div>

            {/* Category & Payment Method Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
                        <Tag size={14} />
                        Category
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300 cursor-pointer"
                    >
                        {categories.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
                        <CreditCard size={14} />
                        Payment Method
                    </label>
                    <select
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300 cursor-pointer"
                    >
                        {paymentMethods.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Budget Category (if 50/30/20 rule enabled) */}
            {user?.budgetRule && (
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
                        <Target size={14} />
                        Budget Category (50/30/20 Rule)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {budgetCategories.map(bc => (
                            <button
                                key={bc.value}
                                type="button"
                                onClick={() => setFormData({ ...formData, budgetCategory: bc.value })}
                                className={`p-3 rounded-xl text-center transition-all duration-300 ${
                                    formData.budgetCategory === bc.value
                                        ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white shadow-lg scale-95'
                                        : 'bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--primary)]'
                                }`}
                            >
                                <p className="text-sm font-semibold">{bc.label}</p>
                                <p className="text-xs opacity-75">{bc.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Recurring Expenses */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="recurring"
                        checked={formData.isRecurring}
                        onChange={e => setFormData({ ...formData, isRecurring: e.target.checked })}
                        className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--primary)] focus:ring-[var(--primary)] focus:ring-offset-0"
                    />
                    <label htmlFor="recurring" className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2 cursor-pointer">
                        <Repeat size={14} />
                        Recurring Expense
                    </label>
                </div>

                <AnimatePresence>
                    {formData.isRecurring && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-[var(--text-secondary)]">Frequency</label>
                                <div className="flex gap-2">
                                    {frequencies.map(f => (
                                        <button
                                            key={f.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, frequency: f.value })}
                                            className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                                formData.frequency === f.value
                                                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white'
                                                    : 'bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--primary)]'
                                            }`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Notes Field */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
                    <FileText size={14} />
                    Notes (Optional)
                </label>
                <textarea
                    className="w-full px-4 py-3 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300 resize-none"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any additional details about this expense..."
                    rows="3"
                />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                {!existingExpense && formData.title && (
                    <button
                        type="button"
                        onClick={saveDraft}
                        className="px-5 py-2.5 rounded-full bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all duration-300 flex items-center gap-2"
                    >
                        <Save size={16} />
                        Save Draft
                    </button>
                )}
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-full bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--danger-color)] hover:border-[var(--danger-color)] transition-all duration-300"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            {existingExpense ? 'Updating...' : 'Adding...'}
                        </>
                    ) : (
                        <>
                            {existingExpense ? 'Update Expense' : 'Add Expense'}
                        </>
                    )}
                </button>
            </div>
        </motion.form>
    );
};

// Helper components
const DollarSignIcon = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

const Target = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
    </svg>
);

export default ExpenseForm;