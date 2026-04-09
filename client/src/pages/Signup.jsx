import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, UserPlus, ShieldCheck, Zap, Globe, User } from 'lucide-react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const apiBaseUrl = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        // Frontend Validations
        if (formData.username.length < 3) return setError("Username is too short");
        if (formData.password.length < 8) return setError("Password must be 8+ characters");
        if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");

        setLoading(true);
        try {
            const res = await axios.post(`${apiBaseUrl}api/user/signup`, {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            
            if (res.data.success) {
                // Signup successful, redirect to login
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed. Try again.");
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
                        <p className="mt-4 font-bold tracking-widest text-indigo-600 animate-pulse select-none">CREATING ACCOUNT...</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- LEFT SIDE: BRANDING (Visible on Desktop) --- */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative flex-col justify-start gap-12 p-16 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]" />
                
                <div className="relative z-10 flex items-center gap-2 text-white font-black text-2xl tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white italic text-xl">B</div>
                    BTS CRM
                </div>

                <div className="relative z-10">
                    <motion.h2 
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="text-5xl font-bold text-white leading-tight"
                    >
                        Join the <br /> 
                        <span className="text-indigo-400">Winning Team.</span>
                    </motion.h2>
                    <p className="text-slate-400 mt-6 text-lg max-w-md leading-relaxed">
                        Create your account today and start managing your sales pipeline with the world's most intuitive CRM.
                    </p>

                    <div className="mt-12 space-y-6">
                        <SignupFeature icon={<Zap size={20}/>} title="Zero Latency" desc="Built on the latest tech stack for speed." />
                        <SignupFeature icon={<ShieldCheck size={20}/>} title="Data Privacy" desc="Compliance with global security standards." />
                        <SignupFeature icon={<Globe size={20}/>} title="Global Access" desc="Work from anywhere, anytime." />
                    </div>
                </div>

                <div className="relative z-10 text-slate-500 text-sm">
                    Empowering sales teams worldwide.
                </div>
            </div>

            {/* --- RIGHT SIDE: SIGNUP FORM --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-slate-50/50 overflow-y-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 my-10"
                >
                    <div className="mb-8">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h3>
                        <p className="text-slate-500 font-medium mt-2 text-sm">Fill in your details to get started</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        {/* Username Field */}
                        <div className="group">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <User size={14} /> Full Name
                            </label>
                            <input 
                                type="text" required
                                placeholder="Muhammad Shahzaib"
                                className="w-full mt-2 bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                            />
                        </div>

                        {/* Email Field */}
                        <div className="group">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input 
                                type="email" required
                                placeholder="name@company.com"
                                className="w-full mt-2 bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="group relative">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Create Password</label>
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
                                {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
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
                                {showConfirmPass ? <EyeOff size={18}/> : <Eye size={18}/>}
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
                            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl shadow-xl shadow-slate-200 flex items-center justify-center gap-2 transition-all mt-2"
                        >
                            Create Account
                            <UserPlus size={18} />
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            Already have an account? {' '}
                            <button 
                                onClick={() => navigate('/login')}
                                className="text-indigo-600 font-bold hover:underline underline-offset-4 cursor-pointer"
                            >
                                Login here
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const SignupFeature = ({ icon, title, desc }) => (
    <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-indigo-400 border border-white/10">
            {icon}
        </div>
        <div>
            <h4 className="text-white font-bold text-sm tracking-tight">{title}</h4>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default Signup;