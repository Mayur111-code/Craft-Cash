import { useState, useContext, useMemo, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Trash2, Edit2, Calendar, Wallet, Sparkles, Brain, TrendingUp, AlertCircle, CheckCircle, Target, PieChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import ExpenseContext from '../context/ExpenseContext';
import AuthContext from '../context/AuthContext';
import api from '../api/axios';
import Modal from '../components/Modal';
import ExpenseForm from '../components/ExpenseForm';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';


const Dashboard = () => {
    const { user, updateProfile } = useContext(AuthContext);
    const { expenses, loading, deleteExpense, filters, updateFilters } = useContext(ExpenseContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [editExpense, setEditExpense] = useState(null);
    const [newBudget, setNewBudget] = useState('');
    const [useRule, setUseRule] = useState(false);
    const [aiInsights, setAiInsights] = useState(null);
    const [loadingInsights, setLoadingInsights] = useState(false);

    // Fetch AI Insights
    const fetchInsights = useCallback(async () => {
        if (expenses.length === 0) return;
        setLoadingInsights(true);
        try {
            const { data } = await api.get('/ai/insights');
            if (data.insight) setAiInsights(data);
        } catch (err) {
            console.error("Failed to fetch insights", err);
        } finally {
            setLoadingInsights(false);
        }
    }, [expenses.length]);

    useEffect(() => {
        const timer = setTimeout(fetchInsights, 1000);
        return () => clearTimeout(timer);
    }, [fetchInsights]);

    // Monthly Statistics
    const monthlyStats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const thisMonthExpenses = expenses.filter(expense => {
            const date = new Date(expense.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const total = thisMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);

        const byCategory = thisMonthExpenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});

        const NEEDS = ['Food', 'Bills', 'Medical', 'Rent'];
        const WANTS = ['Shopping', 'Entertainment', 'Travel', 'Other'];

        const needsTotal = thisMonthExpenses
            .filter(e => NEEDS.includes(e.category))
            .reduce((acc, curr) => acc + curr.amount, 0);

        const wantsTotal = thisMonthExpenses
            .filter(e => WANTS.includes(e.category))
            .reduce((acc, curr) => acc + curr.amount, 0);

        const highestCategoryEntry = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

        const breakdown = Object.keys(byCategory).map(cat => ({
            category: cat,
            amount: byCategory[cat],
            percentage: total > 0 ? ((byCategory[cat] / total) * 100).toFixed(1) : 0
        })).sort((a, b) => b.amount - a.amount);

        return {
            total,
            needsTotal,
            wantsTotal,
            highestCategory: highestCategoryEntry ? highestCategoryEntry[0] : 'N/A',
            highestCategoryAmount: highestCategoryEntry ? highestCategoryEntry[1] : 0,
            count: thisMonthExpenses.length,
            breakdown
        };
    }, [expenses]);

    // Budget Analysis
    const budgetAnalysis = useMemo(() => {
        const budget = user?.budget || 0;
        if (budget === 0) return { 
            status: 'No Budget Set', 
            color: 'var(--text-muted)', 
            percent: 0, 
            needsAnalysis: {}, 
            wantsAnalysis: {}, 
            savingsBudget: 0, 
            totalRemaining: 0 
        };

        const percent = (monthlyStats.total / budget) * 100;
        let status = 'On Track';
        let color = 'var(--success-color)';

        if (percent >= 100) {
            status = 'Over Budget!';
            color = 'var(--danger-color)';
        } else if (percent >= 80) {
            status = 'Warning';
            color = 'var(--warning-color)';
        }

        let needsAnalysis = { percent: 0, status: 'Safe', color: 'var(--success-color)', remaining: 0, budget: 0 };
        let wantsAnalysis = { percent: 0, status: 'Safe', color: 'var(--success-color)', remaining: 0, budget: 0 };
        let savingsBudget = 0;

        if (user?.budgetRule) {
            const needsBudget = budget * 0.5;
            const wantsBudget = budget * 0.3;
            savingsBudget = budget * 0.2;

            const needsPercent = (monthlyStats.needsTotal / needsBudget) * 100;
            const wantsPercent = (monthlyStats.wantsTotal / wantsBudget) * 100;

            const needsRemaining = needsBudget - monthlyStats.needsTotal;
            const wantsRemaining = wantsBudget - monthlyStats.wantsTotal;

            if (needsPercent >= 100) needsAnalysis = { percent: needsPercent, status: 'Exceeded', color: 'var(--danger-color)', remaining: needsRemaining, budget: needsBudget };
            else if (needsPercent >= 80) needsAnalysis = { percent: needsPercent, status: 'Warning', color: 'var(--warning-color)', remaining: needsRemaining, budget: needsBudget };
            else needsAnalysis = { percent: needsPercent, status: 'Safe', color: 'var(--success-color)', remaining: needsRemaining, budget: needsBudget };

            if (wantsPercent >= 100) wantsAnalysis = { percent: wantsPercent, status: 'Exceeded', color: 'var(--danger-color)', remaining: wantsRemaining, budget: wantsBudget };
            else if (wantsPercent >= 80) wantsAnalysis = { percent: wantsPercent, status: 'Warning', color: 'var(--warning-color)', remaining: wantsRemaining, budget: wantsBudget };
            else wantsAnalysis = { percent: wantsPercent, status: 'Safe', color: 'var(--success-color)', remaining: wantsRemaining, budget: wantsBudget };
        }

        const totalRemaining = budget - monthlyStats.total;

        return { status, color, percent: percent.toFixed(1), needsAnalysis, wantsAnalysis, savingsBudget, totalRemaining };
    }, [monthlyStats, user?.budget, user?.budgetRule]);

    // Savings Trend
    const savingsTrend = useMemo(() => {
        const months = {};
        const today = new Date();
        const budget = user?.budget || 0;

        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = d.toLocaleString('default', { month: 'short' });
            months[key] = { name: key, expenses: 0, budget: budget, savings: 0 };
        }

        expenses.forEach(exp => {
            const d = new Date(exp.date);
            const key = d.toLocaleString('default', { month: 'short' });
            if (months[key]) {
                months[key].expenses += exp.amount;
            }
        });

        return Object.values(months).map(m => ({
            ...m,
            savings: Math.max(0, m.budget - m.expenses)
        }));
    }, [expenses, user?.budget]);

    const handleEdit = (expense) => {
        setEditExpense(expense);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            await deleteExpense(id);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditExpense(null);
    };

    const saveBudget = async (e) => {
        e.preventDefault();
        if (newBudget && !isNaN(newBudget)) {
            try {
                await updateProfile({ budget: Number(newBudget), budgetRule: useRule });
                setIsBudgetModalOpen(false);
            } catch (err) {
                console.error("Failed to save budget:", err.response?.data?.message || err.message);
                alert(`Error saving budget: ${err.response?.data?.message || err.message}`);
            }
        }
    };

    // Chart Colors
    const CHART_COLORS = ['#7fc9ff', '#7f81ff', '#9a8cff', '#5eead4', '#d8b5ff', '#ff7c7c'];

    return (
        <div className="min-h-screen bg-[var(--bg-color)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                        <p className="text-[var(--text-muted)] mt-1">
                            Welcome back, <span className="font-semibold text-[var(--text-main)]">{user?.name}</span>
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        <Plus size={20} />
                        Add Expense
                    </button>
                </div>

                {/* AI Insights Section */}
                {aiInsights && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 rounded-2xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10 border border-[var(--primary)]/30 p-6 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full blur-3xl" />
                        <div className="relative z-10">
                            <div className="flex items-start gap-4 flex-wrap">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">
                                    <Brain size={24} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <p className="text-sm lg:text-base text-[var(--text-main)] leading-relaxed mb-4">
                                        {aiInsights.insight}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)]">
                                            <p className="text-xs text-[var(--text-muted)] mb-1">Next Month Prediction</p>
                                            <p className="text-xl font-bold text-[var(--primary)]">₹{aiInsights.prediction?.toLocaleString() || 'N/A'}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)]">
                                            <p className="text-xs text-[var(--text-muted)] mb-1">Recommendation</p>
                                            <p className="text-sm font-semibold text-[var(--text-main)]">{aiInsights.recommendation || 'Track your expenses'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {/* Remaining Balance Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="group relative rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-6 hover:border-[var(--primary)]/50 transition-all duration-300 hover:shadow-xl"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-sm font-medium text-[var(--text-muted)]">Remaining Balance</p>
                            <div className={`p-2 rounded-xl ${(user?.budget - monthlyStats.total) >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                <Wallet size={18} className={(user?.budget - monthlyStats.total) >= 0 ? 'text-green-500' : 'text-red-500'} />
                            </div>
                        </div>
                        <h3 className={`text-2xl font-bold mb-1 ${(user?.budget - monthlyStats.total) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ₹{(user?.budget - monthlyStats.total).toLocaleString()}
                        </h3>
                        <p className="text-xs text-[var(--text-muted)]">
                            {(user?.budget - monthlyStats.total) >= 0 ? '✓ Within budget' : '⚠ Over budget'}
                        </p>
                    </motion.div>

                    {/* Total Expenses Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="group relative rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-6 hover:border-[var(--primary)]/50 transition-all duration-300 hover:shadow-xl"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-sm font-medium text-[var(--text-muted)]">This Month's Total</p>
                            <div className="p-2 rounded-xl bg-[var(--primary)]/10">
                                <TrendingUp size={18} className="text-[var(--primary)]" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--text-main)] mb-1">₹{monthlyStats.total.toLocaleString()}</h3>
                        <p className="text-xs text-[var(--text-muted)]">{monthlyStats.count} transactions</p>
                    </motion.div>

                    {/* Highest Spending Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="group relative rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-6 hover:border-[var(--primary)]/50 transition-all duration-300 hover:shadow-xl"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-sm font-medium text-[var(--text-muted)]">Highest Spending</p>
                            <div className="p-2 rounded-xl bg-yellow-500/10">
                                <PieChart size={18} className="text-yellow-500" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--text-main)] mb-1">{monthlyStats.highestCategory}</h3>
                        <p className="text-xs text-[var(--text-muted)]">₹{monthlyStats.highestCategoryAmount.toLocaleString()} spent</p>
                    </motion.div>

                    {/* Budget Status Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        onClick={() => {
                            setIsBudgetModalOpen(true);
                            setNewBudget(user?.budget || '');
                            setUseRule(user?.budgetRule || false);
                        }}
                        className="group relative rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-6 hover:border-[var(--primary)]/50 transition-all duration-300 hover:shadow-xl cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <p className="text-sm font-medium text-[var(--text-muted)]">Budget Status</p>
                            <div className="p-2 rounded-xl bg-[var(--primary)]/10">
                                <Target size={18} className="text-[var(--primary)]" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2" style={{ color: budgetAnalysis.color }}>
                            {budgetAnalysis.status}
                        </h3>
                        {user?.budget > 0 && (
                            <>
                                <div className="w-full h-2 bg-[var(--border-color)] rounded-full overflow-hidden mt-2">
                                    <div 
                                        className="h-full transition-all duration-500 rounded-full"
                                        style={{ width: `${Math.min(budgetAnalysis.percent, 100)}%`, backgroundColor: budgetAnalysis.color }}
                                    />
                                </div>
                                <p className="text-xs text-[var(--text-muted)] mt-2">
                                    {budgetAnalysis.percent}% of ₹{user?.budget?.toLocaleString()}
                                </p>
                            </>
                        )}
                        {!user?.budget && (
                            <p className="text-xs text-[var(--text-muted)] mt-2">Tap to set budget</p>
                        )}
                    </motion.div>
                </div>

                {/* 50/30/20 Rule Section */}
                {user?.budgetRule && user?.budget > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-8 rounded-2xl bg-gradient-to-r from-[var(--card-bg)] to-[var(--element-bg)] border border-[var(--border-color)] p-6"
                    >
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Wallet size={20} className="text-[var(--primary)]" />
                            50/30/20 Rule Breakdown
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Needs */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold text-[var(--text-main)]">Needs (50%)</span>
                                    <span className="text-[var(--text-muted)]">₹{budgetAnalysis.needsAnalysis.budget?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className={budgetAnalysis.needsAnalysis.remaining >= 0 ? 'text-green-500' : 'text-red-500'}>
                                        {budgetAnalysis.needsAnalysis.remaining >= 0 ? 'Remaining:' : 'Overspent:'} ₹{Math.abs(budgetAnalysis.needsAnalysis.remaining || 0).toLocaleString()}
                                    </span>
                                    <span style={{ color: budgetAnalysis.needsAnalysis.color }}>
                                        {budgetAnalysis.needsAnalysis.percent?.toFixed(0) || 0}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                                    <div 
                                        className="h-full transition-all duration-500 rounded-full"
                                        style={{ width: `${Math.min(budgetAnalysis.needsAnalysis.percent || 0, 100)}%`, backgroundColor: budgetAnalysis.needsAnalysis.color }}
                                    />
                                </div>
                            </div>

                            {/* Wants */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold text-[var(--text-main)]">Wants (30%)</span>
                                    <span className="text-[var(--text-muted)]">₹{budgetAnalysis.wantsAnalysis.budget?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className={budgetAnalysis.wantsAnalysis.remaining >= 0 ? 'text-green-500' : 'text-red-500'}>
                                        {budgetAnalysis.wantsAnalysis.remaining >= 0 ? 'Remaining:' : 'Overspent:'} ₹{Math.abs(budgetAnalysis.wantsAnalysis.remaining || 0).toLocaleString()}
                                    </span>
                                    <span style={{ color: budgetAnalysis.wantsAnalysis.color }}>
                                        {budgetAnalysis.wantsAnalysis.percent?.toFixed(0) || 0}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                                    <div 
                                        className="h-full transition-all duration-500 rounded-full"
                                        style={{ width: `${Math.min(budgetAnalysis.wantsAnalysis.percent || 0, 100)}%`, backgroundColor: budgetAnalysis.wantsAnalysis.color }}
                                    />
                                </div>
                            </div>

                            {/* Savings */}
                            <div className="space-y-2 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold text-green-500">Savings (20%)</span>
                                    <span className="text-green-400">Target: ₹{budgetAnalysis.savingsBudget?.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-[var(--text-muted)]">
                                    Save 20% of your income for future goals
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Savings Trend Chart */}
                {user?.budget > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mb-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-6"
                    >
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-[var(--primary)]" />
                            Savings Trend (6 Months)
                        </h3>
                        <div style={{ height: '280px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={savingsTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#5eead4" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#5eead4" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false}
                                        tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false}
                                        tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                                        tickFormatter={val => `₹${val / 1000}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{ 
                                            backgroundColor: 'var(--card-bg)', 
                                            border: '1px solid var(--border-color)', 
                                            borderRadius: '12px',
                                            color: 'var(--text-main)'
                                        }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="savings" 
                                        stroke="#5eead4" 
                                        fillOpacity={1} 
                                        fill="url(#colorSavings)" 
                                        strokeWidth={2} 
                                        name="Savings" 
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="expenses" 
                                        stroke="#ff7c7c" 
                                        fillOpacity={0} 
                                        strokeWidth={2} 
                                        name="Expenses" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}

                {/* Monthly Breakdown */}
                {monthlyStats.breakdown.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mb-8"
                    >
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <PieChart size={20} className="text-[var(--primary)]" />
                            Monthly Breakdown
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {monthlyStats.breakdown.map((item, index) => (
                                <div key={item.category} className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)]">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-[var(--text-main)]">{item.category}</span>
                                        <span className="text-sm font-bold text-[var(--primary)]">{item.percentage}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-[var(--border-color)] rounded-full overflow-hidden mb-2">
                                        <div 
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ width: `${item.percentage}%`, backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                                        />
                                    </div>
                                    <p className="text-sm text-[var(--text-muted)]">₹{item.amount.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Expenses Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Wallet size={20} className="text-[var(--primary)]" />
                        Recent Expenses
                    </h3>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <div className="flex-1 min-w-[200px] relative">
                            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" />
                            <input
                                type="text"
                                placeholder="Search expenses..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none transition-all"
                                value={filters.keyword}
                                onChange={(e) => updateFilters({ keyword: e.target.value })}
                            />
                        </div>
                        <select
                            className="px-4 py-2 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none"
                            value={filters.category}
                            onChange={(e) => updateFilters({ category: e.target.value })}
                        >
                            <option value="">All Categories</option>
                            <option value="Food">Food</option>
                            <option value="Travel">Travel</option>
                            <option value="Bills">Bills</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Medical">Medical</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Other">Other</option>
                        </select>
                        <input
                            type="date"
                            className="px-4 py-2 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none"
                            value={filters.startDate}
                            onChange={(e) => updateFilters({ startDate: e.target.value })}
                        />
                    </div>

                    {/* Expenses List */}
                    <div className="space-y-3">
                        <AnimatePresence>
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[var(--primary)] border-t-transparent" />
                                </div>
                            ) : expenses.length === 0 ? (
                                <div className="text-center py-12">
                                    <Wallet size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
                                    <p className="text-[var(--text-muted)]">No expenses found. Start by adding one!</p>
                                </div>
                            ) : (
                                expenses.map((expense) => (
                                    <motion.div
                                        key={expense._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        layout
                                        className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--primary)]/50 transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-3 flex-1 min-w-[200px]">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-sm">
                                                {expense.category.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-[var(--text-main)]">{expense.title}</h4>
                                                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)] mt-1">
                                                    <Calendar size={12} />
                                                    <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                                                    <span>•</span>
                                                    <span>{expense.category}</span>
                                                    <span>•</span>
                                                    <span>{expense.paymentMethod}</span>
                                                </div>
                                                {expense.notes && (
                                                    <p className="text-xs text-[var(--text-muted)] mt-1">{expense.notes}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                            <span className="text-lg font-bold text-[var(--text-main)]">
                                                -₹{expense.amount.toLocaleString()}
                                            </span>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleEdit(expense)} 
                                                    className="p-2 rounded-lg bg-[var(--element-bg)] hover:bg-[var(--primary)]/10 transition-all"
                                                >
                                                    <Edit2 size={16} className="text-[var(--text-muted)] hover:text-[var(--primary)]" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(expense._id)} 
                                                    className="p-2 rounded-lg bg-[var(--element-bg)] hover:bg-red-500/10 transition-all"
                                                >
                                                    <Trash2 size={16} className="text-[var(--text-muted)] hover:text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Modals */}
                <Modal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={editExpense ? 'Edit Expense' : 'Add Expense'}
                >
                    <ExpenseForm existingExpense={editExpense} onClose={handleCloseModal} />
                </Modal>

                <Modal
                    isOpen={isBudgetModalOpen}
                    onClose={() => setIsBudgetModalOpen(false)}
                    title="Set Monthly Budget"
                >
                    <form onSubmit={saveBudget} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                                Monthly Budget Limit (₹)
                            </label>
                            <input
                                type="number"
                                value={newBudget}
                                onChange={(e) => setNewBudget(e.target.value)}
                                placeholder="e.g., 50000"
                                className="w-full px-4 py-2 rounded-xl bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] focus:border-[var(--primary)] focus:outline-none"
                                autoFocus
                                min="0"
                            />
                        </div>
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="rule503020"
                                checked={useRule}
                                onChange={(e) => setUseRule(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-[var(--border-color)] text-[var(--primary)] focus:ring-[var(--primary)]"
                            />
                            <div>
                                <label htmlFor="rule503020" className="text-sm font-medium text-[var(--text-main)] cursor-pointer">
                                    Enable 50/30/20 Rule Analysis
                                </label>
                                <p className="text-xs text-[var(--text-muted)] mt-1">
                                    50% Needs • 30% Wants • 20% Savings
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button 
                                type="button" 
                                onClick={() => setIsBudgetModalOpen(false)} 
                                className="px-4 py-2 rounded-full bg-[var(--element-bg)] text-[var(--text-muted)] hover:bg-[var(--border-color)] transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="px-4 py-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold hover:scale-105 transition-all"
                            >
                                Save Budget
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

export default Dashboard;