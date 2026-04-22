import { useContext, useMemo, useState, useCallback } from 'react';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer, AreaChart, Area, LineChart, Line
} from 'recharts';
import { Download, Filter, Calendar, TrendingUp, PieChart as PieChartIcon, BarChart3, AlertCircle, DollarSign } from 'lucide-react';
import ExpenseContext from '../context/ExpenseContext';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic colors based on theme
const getChartColors = () => ({
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    success: '#5eead4',
    warning: '#d8b5ff',
    danger: '#ff7c7c',
    accent1: '#7fc9ff',
    accent2: '#7f81ff',
    accent3: '#9a8cff',
    accent4: '#5eead4',
    accent5: '#d8b5ff',
});

const CustomTooltip = ({ active, payload, label, type = 'default' }) => {
    if (active && payload && payload.length) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl p-3 min-w-[180px]"
            >
                <p className="font-semibold text-[var(--text-main)] mb-2 text-sm border-b border-[var(--border-color)] pb-1">
                    {label}
                </p>
                {payload.map((pld, index) => (
                    <div key={index} className="flex justify-between items-center gap-4 text-xs mt-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.color || 'var(--primary)' }} />
                            <span className="text-[var(--text-muted)]">{pld.name}:</span>
                        </div>
                        <span className="font-bold text-[var(--text-main)]">₹{pld.value.toLocaleString()}</span>
                    </div>
                ))}
                {type === 'percentage' && payload[0] && (
                    <div className="mt-2 pt-2 border-t border-[var(--border-color)]">
                        <div className="flex justify-between text-xs">
                            <span className="text-[var(--text-muted)]">Percentage:</span>
                            <span className="font-bold text-[var(--primary)]">
                                {((payload[0].value / payload.reduce((acc, p) => acc + p.value, 0)) * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                )}
            </motion.div>
        );
    }
    return null;
};

const Reports = () => {
    const { expenses } = useContext(ExpenseContext);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [chartType, setChartType] = useState('area'); // area, line

    // Filter expenses based on date range and category
    const filteredExpenses = useMemo(() => {
        let filtered = [...expenses];
        
        if (dateRange.start) {
            filtered = filtered.filter(e => e.date >= dateRange.start);
        }
        if (dateRange.end) {
            filtered = filtered.filter(e => e.date <= dateRange.end);
        }
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(e => e.category === selectedCategory);
        }
        
        return filtered;
    }, [expenses, dateRange, selectedCategory]);

    // Category data for pie chart
    const categoryData = useMemo(() => {
        const colors = getChartColors();
        const colorArray = [colors.accent1, colors.accent2, colors.accent3, colors.accent4, colors.accent5, colors.warning, colors.danger];
        
        const data = filteredExpenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});
        
        const result = Object.keys(data).map((name, index) => ({
            name,
            value: data[name],
            color: colorArray[index % colorArray.length]
        }));
        
        return result.sort((a, b) => b.value - a.value);
    }, [filteredExpenses]);

    // Monthly data for bar chart
    const monthlyData = useMemo(() => {
        const data = filteredExpenses.reduce((acc, curr) => {
            const month = curr.date.substring(0, 7);
            acc[month] = (acc[month] || 0) + curr.amount;
            return acc;
        }, {});
        
        return Object.keys(data)
            .sort()
            .map(month => ({
                month: new Date(month + '-01').toLocaleString('default', { month: 'short', year: 'numeric' }),
                amount: data[month]
            }));
    }, [filteredExpenses]);

    // Daily trend data
    const trendData = useMemo(() => {
        const sorted = [...filteredExpenses].sort((a, b) => new Date(a.date) - new Date(b.date));
        const grouped = sorted.reduce((acc, curr) => {
            const date = curr.date.substring(0, 10);
            acc[date] = (acc[date] || 0) + curr.amount;
            return acc;
        }, {});
        
        return Object.keys(grouped).map(date => ({ 
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: date,
            amount: grouped[date] 
        }));
    }, [filteredExpenses]);

    // Summary statistics
    const summary = useMemo(() => {
        const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
        const average = total / (filteredExpenses.length || 1);
        const highest = Math.max(...filteredExpenses.map(e => e.amount), 0);
        const categories = new Set(filteredExpenses.map(e => e.category)).size;
        
        return { total, average, highest, categories, count: filteredExpenses.length };
    }, [filteredExpenses]);

    // Download CSV
    const downloadCSV = useCallback(() => {
        if (!filteredExpenses || filteredExpenses.length === 0) {
            alert("No expenses to download in the selected range.");
            return;
        }

        const headers = ["Title", "Amount", "Category", "Date", "Payment Method", "Notes"];
        const csvContent = [
            headers.join(","),
            ...filteredExpenses.map(e => {
                const row = [
                    `"${e.title.replace(/"/g, '""')}"`,
                    e.amount,
                    e.category,
                    new Date(e.date).toLocaleDateString(),
                    e.paymentMethod,
                    `"${(e.notes || '').replace(/"/g, '""')}"`
                ];
                return row.join(",");
            })
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `expenses_report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [filteredExpenses]);

    // Reset filters
    const resetFilters = () => {
        setDateRange({ start: '', end: '' });
        setSelectedCategory('all');
    };

    // Get unique categories for filter
    const categories = useMemo(() => {
        const cats = new Set(expenses.map(e => e.category));
        return ['all', ...Array.from(cats)];
    }, [expenses]);

    const colors = getChartColors();

    return (
        <div className="min-h-screen bg-[var(--bg-color)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                            Financial Analytics
                        </h1>
                        <p className="text-[var(--text-muted)] mt-1">
                            Track your spending patterns and insights
                        </p>
                    </div>
                    <button
                        onClick={downloadCSV}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        <Download size={18} />
                        Export Report
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-4"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign size={16} className="text-[var(--primary)]" />
                            <p className="text-xs text-[var(--text-muted)]">Total Expenses</p>
                        </div>
                        <p className="text-2xl font-bold text-[var(--text-main)]">₹{summary.total.toLocaleString()}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">{summary.count} transactions</p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-4"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={16} className="text-[var(--warning)]" />
                            <p className="text-xs text-[var(--text-muted)]">Average Expense</p>
                        </div>
                        <p className="text-2xl font-bold text-[var(--text-main)]">₹{summary.average.toLocaleString()}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">per transaction</p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-4"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <BarChart3 size={16} className="text-[var(--danger)]" />
                            <p className="text-xs text-[var(--text-muted)]">Highest Expense</p>
                        </div>
                        <p className="text-2xl font-bold text-[var(--text-main)]">₹{summary.highest.toLocaleString()}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">single transaction</p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-4"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <PieChartIcon size={16} className="text-[var(--success)]" />
                            <p className="text-xs text-[var(--text-muted)]">Categories</p>
                        </div>
                        <p className="text-2xl font-bold text-[var(--text-main)]">{summary.categories}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">different types</p>
                    </motion.div>
                </div>

                {/* Filters Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5"
                >
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-[var(--primary)]" />
                            <span className="text-sm font-semibold text-[var(--text-main)]">Filters</span>
                        </div>
                        
                        <div className="flex-1 flex flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-[var(--text-muted)]" />
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                    className="px-3 py-1.5 rounded-lg bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] text-sm focus:border-[var(--primary)] focus:outline-none"
                                    placeholder="Start Date"
                                />
                            </div>
                            <span className="text-[var(--text-muted)]">to</span>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                className="px-3 py-1.5 rounded-lg bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] text-sm focus:border-[var(--primary)] focus:outline-none"
                                placeholder="End Date"
                            />
                            
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-3 py-1.5 rounded-lg bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)] text-sm focus:border-[var(--primary)] focus:outline-none"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat === 'all' ? 'All Categories' : cat}
                                    </option>
                                ))}
                            </select>
                            
                            {(dateRange.start || dateRange.end || selectedCategory !== 'all') && (
                                <button
                                    onClick={resetFilters}
                                    className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-sm hover:bg-red-500/20 transition-all"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Charts Grid */}
                {filteredExpenses.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)]"
                    >
                        <AlertCircle size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
                        <p className="text-[var(--text-muted)]">No expenses found in the selected range</p>
                        <button
                            onClick={resetFilters}
                            className="mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white text-sm"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Pie Chart - Category Breakdown */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5 hover:border-[var(--primary)]/50 transition-all duration-300"
                            >
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <PieChartIcon size={20} className="text-[var(--primary)]" />
                                    Expense Breakdown by Category
                                </h3>
                                <div style={{ height: '350px', width: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="45%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={3}
                                                dataKey="value"
                                                stroke="var(--bg-color)"
                                                strokeWidth={2}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                labelLine={{ stroke: 'var(--text-muted)', strokeWidth: 1 }}
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip type="percentage" />} />
                                            <Legend 
                                                verticalAlign="bottom" 
                                                height={36}
                                                iconType="circle"
                                                formatter={(value) => <span className="text-[var(--text-muted)] text-xs">{value}</span>}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            {/* Bar Chart - Monthly Spending */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 }}
                                className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5 hover:border-[var(--primary)]/50 transition-all duration-300"
                            >
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <BarChart3 size={20} className="text-[var(--primary)]" />
                                    Monthly Spending Trend
                                </h3>
                                <div style={{ height: '350px', width: '100%' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                            <defs>
                                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={colors.primary} stopOpacity={1} />
                                                    <stop offset="100%" stopColor={colors.primary} stopOpacity={0.6} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                            <XAxis 
                                                dataKey="month" 
                                                stroke="var(--text-muted)"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                                angle={-25}
                                                textAnchor="end"
                                                height={60}
                                            />
                                            <YAxis 
                                                stroke="var(--text-muted)"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                            <Bar 
                                                dataKey="amount" 
                                                fill="url(#barGradient)" 
                                                radius={[8, 8, 0, 0]} 
                                                name="Expenses"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        </div>

                        {/* Trend Chart - Daily/Monthly */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5 hover:border-[var(--primary)]/50 transition-all duration-300"
                        >
                            <div className="flex flex-wrap justify-between items-center mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <TrendingUp size={20} className="text-[var(--primary)]" />
                                    Expense Trend Analysis
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setChartType('area')}
                                        className={`px-3 py-1 rounded-lg text-sm transition-all ${chartType === 'area' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--element-bg)] text-[var(--text-muted)]'}`}
                                    >
                                        Area
                                    </button>
                                    <button
                                        onClick={() => setChartType('line')}
                                        className={`px-3 py-1 rounded-lg text-sm transition-all ${chartType === 'line' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--element-bg)] text-[var(--text-muted)]'}`}
                                    >
                                        Line
                                    </button>
                                </div>
                            </div>
                            <div style={{ height: '380px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    {chartType === 'area' ? (
                                        <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                            <defs>
                                                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                            <XAxis 
                                                dataKey="date" 
                                                stroke="var(--text-muted)"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                                angle={-45}
                                                textAnchor="end"
                                                height={70}
                                                interval="preserveStartEnd"
                                            />
                                            <YAxis 
                                                stroke="var(--text-muted)"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `₹${value}`}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area 
                                                type="monotone" 
                                                dataKey="amount" 
                                                stroke={colors.primary}
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#trendGradient)"
                                                name="Daily Expenses"
                                            />
                                        </AreaChart>
                                    ) : (
                                        <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                            <XAxis 
                                                dataKey="date" 
                                                stroke="var(--text-muted)"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                                angle={-45}
                                                textAnchor="end"
                                                height={70}
                                                interval="preserveStartEnd"
                                            />
                                            <YAxis 
                                                stroke="var(--text-muted)"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `₹${value}`}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Line 
                                                type="monotone" 
                                                dataKey="amount" 
                                                stroke={colors.primary}
                                                strokeWidth={3}
                                                dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                                                activeDot={{ r: 6 }}
                                                name="Daily Expenses"
                                            />
                                        </LineChart>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Insights Section */}
                        {categoryData.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 border border-[var(--primary)]/30"
                            >
                                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-[var(--primary)]" />
                                    Key Insights
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-[var(--text-muted)]">Highest Spending Category</p>
                                        <p className="text-xl font-bold text-[var(--primary)]">
                                            {categoryData[0]?.name || 'N/A'} 
                                            <span className="text-sm text-[var(--text-muted)] ml-2">
                                                (₹{categoryData[0]?.value?.toLocaleString() || 0})
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--text-muted)]">Top Category Percentage</p>
                                        <p className="text-xl font-bold text-[var(--success)]">
                                            {categoryData[0] ? ((categoryData[0].value / summary.total) * 100).toFixed(1) : 0}%
                                            <span className="text-sm text-[var(--text-muted)] ml-2">of total spending</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Reports;