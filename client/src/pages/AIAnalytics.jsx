import { useState, useEffect, useContext, useRef } from 'react';
import { IoSend } from "react-icons/io5";
import {
    Brain, Sparkles, TrendingUp, AlertTriangle, Lightbulb, MessageSquare,
    Send, LayoutDashboard, Target, Zap, Shield, Award, RefreshCw,
    ChevronDown, ChevronUp, Copy, CheckCircle, Bot, User
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';

const AIAnalytics = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState(null);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isCoachLoading, setIsCoachLoading] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        anomalies: true,
        subscriptions: true,
        tips: true,
        budget: true
    });
    const [copiedTip, setCopiedTip] = useState(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        fetchAnalysis();
    }, []);

    useEffect(() => {
        // Auto-scroll to bottom of chat
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isCoachLoading]);

    const fetchAnalysis = async () => {
        try {
            const { data } = await api.get('/ai/analyze');
            setAnalysis(data);
        } catch (err) {
            console.error("Analysis failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;

        const userMsg = { role: 'user', content: chatMessage, timestamp: new Date() };
        setChatHistory(prev => [...prev, userMsg]);
        setChatMessage('');
        setIsCoachLoading(true);

        try {
            const { data } = await api.post('/ai/coach', { message: chatMessage });
            const botMsg = { role: 'bot', content: data.message, timestamp: new Date() };
            setChatHistory(prev => [...prev, botMsg]);
        } catch (err) {
            setChatHistory(prev => [...prev, { 
                role: 'bot', 
                content: "Sorry, I'm having trouble thinking right now. Try again later.",
                timestamp: new Date(),
                isError: true 
            }]);
        } finally {
            setIsCoachLoading(false);
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const copyToClipboard = (text, tipId) => {
        navigator.clipboard.writeText(text);
        setCopiedTip(tipId);
        setTimeout(() => setCopiedTip(null), 2000);
    };

    const suggestedQuestions = [
        "How can I save more money?",
        "Analyze my spending patterns",
        "Give me investment advice",
        "How to reduce food expenses?",
        "Create a savings plan for me"
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] animate-pulse" />
                        <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" size={32} />
                    </div>
                    <h2 className="text-xl font-bold mt-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                        Analyzing your finances...
                    </h2>
                    <p className="text-[var(--text-muted)] mt-2">Crunching numbers with LLaMA 3.3 AI</p>
                    <div className="flex gap-1 justify-center mt-4">
                        <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-color)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
                                <Brain className="text-[var(--primary)]" size={36} />
                                AI Financial Intelligence
                            </h1>
                            <p className="text-[var(--text-muted)] mt-2">
                                Personalized insights powered by <span className="font-semibold text-[var(--primary)]">Groq & LLaMA 3.3</span>
                            </p>
                        </div>
                        <button
                            onClick={fetchAnalysis}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all duration-300"
                        >
                            <RefreshCw size={16} />
                            Refresh Insights
                        </button>
                    </div>
                </motion.div>

                {/* Stats Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-2xl bg-gradient-to-br from-[var(--card-bg)] to-[var(--element-bg)] border border-[var(--border-color)] p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <Zap size={20} className="text-yellow-500" />
                            <span className="text-xs text-[var(--text-muted)]">AI Score</span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--text-main)]">85<span className="text-sm">/100</span></p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">Financial Health</p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-2xl bg-gradient-to-br from-[var(--card-bg)] to-[var(--element-bg)] border border-[var(--border-color)] p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <AlertTriangle size={20} className="text-red-500" />
                            <span className="text-xs text-[var(--text-muted)]">Anomalies</span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--text-main)]">{analysis?.anomalies?.length || 0}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">Unusual transactions</p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-2xl bg-gradient-to-br from-[var(--card-bg)] to-[var(--element-bg)] border border-[var(--border-color)] p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <LayoutDashboard size={20} className="text-blue-500" />
                            <span className="text-xs text-[var(--text-muted)]">Subscriptions</span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--text-main)]">{analysis?.potentialSubscriptions?.length || 0}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">Recurring payments</p>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-2xl bg-gradient-to-br from-[var(--card-bg)] to-[var(--element-bg)] border border-[var(--border-color)] p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <Target size={20} className="text-green-500" />
                            <span className="text-xs text-[var(--text-muted)]">Savings Tips</span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--text-main)]">{analysis?.savingsTips?.length || 0}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">Money-saving ideas</p>
                    </motion.div>
                </div>

                {/* Main Insights Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    
                    {/* Anomaly Detection */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden hover:border-red-500/30 transition-all duration-300"
                    >
                        <div 
                            onClick={() => toggleSection('anomalies')}
                            className="flex items-center justify-between p-5 cursor-pointer bg-gradient-to-r from-red-500/5 to-transparent"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-red-500/10">
                                    <AlertTriangle className="text-red-500" size={20} />
                                </div>
                                <h3 className="font-bold text-[var(--text-main)]">Anomaly Detection</h3>
                            </div>
                            {expandedSections.anomalies ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                        <AnimatePresence>
                            {expandedSections.anomalies && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="p-5 pt-0 space-y-3"
                                >
                                    {analysis?.anomalies?.length > 0 ? (
                                        analysis.anomalies.map((item, idx) => (
                                            <motion.div 
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-all"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold text-[var(--text-main)]">{item.title}</p>
                                                        <p className="text-xs text-[var(--text-muted)] mt-1">{item.reason}</p>
                                                    </div>
                                                    <span className="font-bold text-red-500">₹{item.amount.toLocaleString()}</span>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6">
                                            <Shield size={40} className="mx-auto mb-2 text-green-500 opacity-50" />
                                            <p className="text-[var(--text-muted)]">No unusual spending detected</p>
                                            <p className="text-xs text-[var(--text-muted)]">Your spending patterns look normal</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Subscriptions */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden hover:border-blue-500/30 transition-all duration-300"
                    >
                        <div 
                            onClick={() => toggleSection('subscriptions')}
                            className="flex items-center justify-between p-5 cursor-pointer bg-gradient-to-r from-blue-500/5 to-transparent"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-500/10">
                                    <LayoutDashboard className="text-blue-500" size={20} />
                                </div>
                                <h3 className="font-bold text-[var(--text-main)]">Recurring Subscriptions</h3>
                            </div>
                            {expandedSections.subscriptions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                        <AnimatePresence>
                            {expandedSections.subscriptions && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="p-5 pt-0 space-y-3"
                                >
                                    {analysis?.potentialSubscriptions?.length > 0 ? (
                                        analysis.potentialSubscriptions.map((sub, idx) => (
                                            <motion.div 
                                                key={idx}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="flex justify-between items-center p-3 rounded-xl bg-blue-500/5 border border-blue-500/20"
                                            >
                                                <div>
                                                    <p className="font-semibold text-[var(--text-main)]">{sub.service}</p>
                                                    <p className="text-xs text-[var(--text-muted)]">{sub.frequency}</p>
                                                </div>
                                                <span className="font-bold text-[var(--text-main)]">₹{sub.amount.toLocaleString()}</span>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6">
                                            <Award size={40} className="mx-auto mb-2 text-blue-500 opacity-50" />
                                            <p className="text-[var(--text-muted)]">No subscriptions detected</p>
                                            <p className="text-xs text-[var(--text-muted)]">Great control over recurring payments!</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Savings Tips */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden hover:border-green-500/30 transition-all duration-300"
                    >
                        <div 
                            onClick={() => toggleSection('tips')}
                            className="flex items-center justify-between p-5 cursor-pointer bg-gradient-to-r from-green-500/5 to-transparent"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-green-500/10">
                                    <Lightbulb className="text-green-500" size={20} />
                                </div>
                                <h3 className="font-bold text-[var(--text-main)]">Smart Savings Tips</h3>
                            </div>
                            {expandedSections.tips ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                        <AnimatePresence>
                            {expandedSections.tips && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="p-5 pt-0 space-y-3"
                                >
                                    {analysis?.savingsTips?.map((tip, idx) => (
                                        <motion.div 
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="group p-3 rounded-xl bg-green-500/5 border border-green-500/20 hover:bg-green-500/10 transition-all"
                                        >
                                            <div className="flex gap-2 items-start">
                                                <Lightbulb size={16} className="text-green-500 shrink-0 mt-0.5" />
                                                <p className="text-sm text-[var(--text-main)] flex-1">{tip}</p>
                                                <button
                                                    onClick={() => copyToClipboard(tip, `tip-${idx}`)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[var(--element-bg)] rounded"
                                                >
                                                    {copiedTip === `tip-${idx}` ? 
                                                        <CheckCircle size={14} className="text-green-500" /> : 
                                                        <Copy size={14} className="text-[var(--text-muted)]" />
                                                    }
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* AI Suggested Budget */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden hover:border-purple-500/30 transition-all duration-300"
                    >
                        <div 
                            onClick={() => toggleSection('budget')}
                            className="flex items-center justify-between p-5 cursor-pointer bg-gradient-to-r from-purple-500/5 to-transparent"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-purple-500/10">
                                    <TrendingUp className="text-purple-500" size={20} />
                                </div>
                                <h3 className="font-bold text-[var(--text-main)]">AI Suggested Budget</h3>
                            </div>
                            {expandedSections.budget ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                        <AnimatePresence>
                            {expandedSections.budget && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="p-5 pt-0"
                                >
                                    <p className="text-xs text-[var(--text-muted)] mb-4">
                                        Based on your spending habits, here is a recommended monthly allocation:
                                    </p>
                                    <div className="space-y-3">
                                        {Object.entries(analysis?.suggestedBudget || {}).map(([cat, limit], idx) => (
                                            <motion.div 
                                                key={cat}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                            >
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-[var(--text-main)]">{cat}</span>
                                                    <span className="font-bold text-[var(--primary)]">₹{limit.toLocaleString()}</span>
                                                </div>
                                                <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                                                        style={{ width: `${Math.min((limit / 50000) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* AI Financial Coach - Chat Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden"
                >
                    <div className="p-5 border-b border-[var(--border-color)] bg-gradient-to-r from-[var(--primary)]/5 to-[var(--secondary)]/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[var(--text-main)]">AI Financial Coach</h3>
                                <p className="text-xs text-[var(--text-muted)]">Your personal finance advisor, powered by LLaMA 3.3</p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="h-[400px] overflow-y-auto p-5 space-y-4 custom-scrollbar">
                        {chatHistory.length === 0 && (
                            <div className="text-center py-8">
                                <Bot size={48} className="mx-auto mb-3 text-[var(--primary)] opacity-50" />
                                <p className="text-[var(--text-muted)]">Ask me anything about your finances!</p>
                                <div className="flex flex-wrap gap-2 justify-center mt-4">
                                    {suggestedQuestions.map((question, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setChatMessage(question);
                                                setTimeout(() => handleChatSubmit(new Event('submit')), 100);
                                            }}
                                            className="px-3 py-1.5 rounded-full bg-[var(--element-bg)] text-xs text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] border border-[var(--border-color)] transition-all"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <AnimatePresence>
                            {chatHistory.map((msg, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                            msg.role === 'user' 
                                                ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]' 
                                                : 'bg-[var(--element-bg)] border border-[var(--border-color)]'
                                        }`}>
                                            {msg.role === 'user' ? 
                                                <User size={14} className="text-white" /> : 
                                                <Bot size={14} className="text-[var(--primary)]" />
                                            }
                                        </div>
                                        <div className={`p-3 rounded-2xl ${
                                            msg.role === 'user'
                                                ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white'
                                                : msg.isError 
                                                    ? 'bg-red-500/10 border border-red-500/20 text-red-500'
                                                    : 'bg-[var(--element-bg)] border border-[var(--border-color)] text-[var(--text-main)]'
                                        }`}>
                                            <ReactMarkdown 
                                                className="prose prose-sm max-w-none"
                                                components={{
                                                    p: ({ node, ...props }) => <p className="text-sm leading-relaxed" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mt-1" {...props} />,
                                                    li: ({ node, ...props }) => <li className="text-xs" {...props} />
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                            <p className="text-[10px] opacity-50 mt-2">
                                                {msg.timestamp?.toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        
                        {isCoachLoading && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-[var(--element-bg)] border border-[var(--border-color)] flex items-center justify-center">
                                        <Bot size={14} className="text-[var(--primary)]" />
                                    </div>
                                    <div className="p-3 rounded-2xl bg-[var(--element-bg)] border border-[var(--border-color)]">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '0s' }} />
                                            <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '0.2s' }} />
                                            <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '0.4s' }} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleChatSubmit} className="p-4 border-t border-[var(--border-color)] bg-[var(--element-bg)]/50">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none transition-all"
                                placeholder="Ask your AI coach anything..."
                                value={chatMessage}
                                onChange={e => setChatMessage(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={isCoachLoading || !chatMessage.trim()}
                                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AIAnalytics;