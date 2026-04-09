import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Zap, BarChart3 } from 'lucide-react'; // npm i lucide-react
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const apiBaseUrl = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password.length < 8) return setError("Password must be 8+ characters");
        if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");

        setLoading(true);
        try {
            const res = await axios.post(`${apiBaseUrl}api/user/login`, {
                email: formData.email,
                password: formData.password
            });
            if (res.data.success) {
                localStorage.setItem('token', res.data.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.data.user));
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        } finally {
            setTimeout(() => setLoading(false), 1200);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white font-sans overflow-hidden">
            <AnimatePresence>
                {loading && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
                    >
                        <motion.div 
                            animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
                        />
                        <p className="mt-4 font-bold tracking-widest text-indigo-600 animate-pulse select-none">VERIFY USER...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- LEFT SIDE: BRANDING & FEATURES (Hidden on Mobile) --- */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative flex-col justify-between p-16 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-white font-black text-2xl tracking-tighter">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">B</div>
                        BTS CRM
                    </div>
                </div>

                <div className="relative z-10">
                    <motion.h2 
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="text-5xl font-bold text-white leading-tight"
                    >
                        The next generation <br /> 
                        <span className="text-indigo-400">Lead Management.</span>
                    </motion.h2>
                    <p className="text-slate-400 mt-6 text-lg max-w-md">
                        Stop juggling spreadsheets. Start closing deals with our high-performance portal designed for champions.
                    </p>

                    <div className="mt-12 space-y-6">
                        <FeatureItem icon={<Zap size={20}/>} title="Lightning Fast" desc="Real-time updates and analytics." />
                        <FeatureItem icon={<ShieldCheck size={20}/>} title="Enterprise Security" desc="Your data is encrypted and safe." />
                        <FeatureItem icon={<BarChart3 size={20}/>} title="Deep Insights" desc="Know your customers better." />
                    </div>
                </div>

                <div className="relative z-10 text-slate-500 text-sm italic">
                    © 2026 BTS CRM Portal. All rights reserved.
                </div>
            </div>

            {/* --- RIGHT SIDE: LOGIN FORM --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-slate-50/50">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100"
                >
                    <div className="mb-10">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Login</h3>
                        <p className="text-slate-500 font-medium mt-2">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <div className="group">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                            <input 
                                type="email" required
                                placeholder="name@gmail.com"
                                className="w-full mt-2 bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="group relative">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <input 
                                type={showPass ? "text" : "password"} required
                                placeholder="••••••••"
                                className="w-full mt-2 bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            <button 
                                type="button" onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-[46px] text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                                {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                            </button>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="group relative">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                            <input 
                                type={showConfirmPass ? "text" : "password"} required
                                placeholder="••••••••"
                                className="w-full mt-2 bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            />
                            <button 
                                type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                                className="absolute right-4 top-[46px] text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                                {showConfirmPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                            </button>
                        </div>

                        {/* Error Handling */}
                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2"
                                >
                                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button 
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                            Login
                            <ArrowRight size={18} />
                        </motion.button>
                    </form>
                    <div className="mt-8 text-center ">
                        <p className="text-slate-500 text-sm font-medium">
                            Don't have an Account {' '}
                            <button 
                                onClick={() => navigate('/signup')}
                                className="text-indigo-600 font-bold hover:underline underline-offset-4 cursor-pointer"
                            >
                                Signup here
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const FeatureItem = ({ icon, title, desc }) => (
    <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-indigo-400 border border-white/10">
            {icon}
        </div>
        <div>
            <h4 className="text-white font-bold text-sm">{title}</h4>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default Login;