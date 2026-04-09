import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    ArrowLeft, Building2, User, Briefcase, Globe, 
    Phone, Mail, Target, ShieldCheck, Loader2, Sparkles 
} from 'lucide-react';
import Navbar from '../components/Navbar';

const CreateLead = () => {
    const navigate = useNavigate();
    const apiBaseUrl = import.meta.env.VITE_API_URL;

    // States
    const [formData, setFormData] = useState({
        companyName: '',
        clientName: '',
        designation: '',
        socialMediaUrl: '',
        phone: '',
        emailAddress: '',
        niche: '',
        status: 'New'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const statusOptions = [
        { label: 'New', color: 'bg-blue-500' },
        { label: 'InProgress', color: 'bg-amber-500' },
        { label: 'Rejected', color: 'bg-rose-500' },
        { label: 'Confirm', color: 'bg-emerald-500' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${apiBaseUrl}api/lead/add-lead`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                // Thora delay taake loader feel ho
                setTimeout(() => navigate('/my-leads'), 1500);
            }
        } catch (err) {
            setIsSubmitting(false);
            setError(err.response?.data?.message || 'Failed to create lead');
        }
    };

    // Full Screen Loader
    if (isSubmitting) {
        return (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center text-white"
            >
                <Loader2 className="w-16 h-16 animate-spin text-indigo-500 mb-4" />
                <motion.h2 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-black tracking-tight"
                >
                    Securing Lead Data...
                </motion.h2>
                <p className="text-slate-400 text-sm mt-2">Connecting to CRM engine</p>
            </motion.div>
        );
    }

    return (
        <>
        <Navbar />
        <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center">
            {/* Header Area */}
            <div className="w-full max-w-6xl px-6 py-8 flex justify-between items-center">
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600 font-bold text-sm cursor-pointer"
                >
                    <ArrowLeft size={18} />
                </motion.button>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <Sparkles size={20} />
                    </div>
                    <span className="font-black text-slate-800 tracking-tighter text-xl italic underline decoration-indigo-500">BTS-CRM</span>
                </div>
            </div>

            <main className="w-full max-w-6xl px-6 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: Static Content & Info */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-indigo-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black leading-tight">Create <br/>New Prospect</h2>
                            <p className="mt-4 text-indigo-100 text-sm leading-relaxed opacity-80">
                                Fill in the details to initiate a new lead in your pipeline. All fields are optional, so you can start with minimal info and update later.
                            </p>
                        </div>
                        <div className="absolute -bottom-10 -right-10 opacity-10">
                            <Building2 size={200} />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                        <h4 className="font-black text-slate-800 text-sm mb-4 uppercase tracking-widest">Quick Tips</h4>
                        <ul className="space-y-4">
                            {[
                                { icon: <Globe size={16}/>, text: "Add Social URLs for better context." },
                                { icon: <ShieldCheck size={16}/>, text: "Status helps in sales forecasting." },
                                { icon: <Target size={16}/>, text: "Niche targeting improves conversion." }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                    <span className="text-indigo-500">{item.icon}</span> {item.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right: Modern Form Section */}
                <div className="lg:col-span-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200 border border-white p-8 md:p-10"
                    >
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Company Name */}
                                <InputField 
                                    label="Company Name" 
                                    icon={<Building2 size={18}/>}
                                    placeholder="e.g. Acme Corp"
                                    value={formData.companyName}
                                    onChange={(val) => setFormData({...formData, companyName: val})}
                                />
                                {/* Client Name */}
                                <InputField 
                                    label="Client Name" 
                                    icon={<User size={18}/>}
                                    placeholder="e.g. Muhammad Shahzaib"
                                    value={formData.clientName}
                                    onChange={(val) => setFormData({...formData, clientName: val})}
                                />
                                {/* Designation */}
                                <InputField 
                                    label="Designation" 
                                    icon={<Briefcase size={18}/>}
                                    placeholder="e.g. CEO / Marketing Head"
                                    value={formData.designation}
                                    onChange={(val) => setFormData({...formData, designation: val})}
                                />
                                {/* Email Address */}
                                <InputField 
                                    label="Email Address" 
                                    icon={<Mail size={18}/>}
                                    placeholder="client@company.com"
                                    value={formData.emailAddress}
                                    onChange={(val) => setFormData({...formData, emailAddress: val})}
                                />
                                {/* Phone Number */}
                                <InputField 
                                    label="Phone Number" 
                                    icon={<Phone size={18}/>}
                                    placeholder="+92 3xx xxxxxxx"
                                    value={formData.phone}
                                    onChange={(val) => setFormData({...formData, phone: val})}
                                />
                                {/* Social Media URL */}
                                <InputField 
                                    label="Social Media URL" 
                                    icon={<Globe size={18}/>}
                                    placeholder="linkedin.com/in/username"
                                    value={formData.socialMediaUrl}
                                    onChange={(val) => setFormData({...formData, socialMediaUrl: val})}
                                />
                                {/* Niche */}
                                <div className="md:col-span-2">
                                    <InputField 
                                        label="Business Niche" 
                                        icon={<Target size={18}/>}
                                        placeholder="e.g. Real Estate, E-commerce, SaaS"
                                        value={formData.niche}
                                        onChange={(val) => setFormData({...formData, niche: val})}
                                    />
                                </div>
                            </div>

                            {/* Status Selector */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-sm font-black text-slate-700 ml-1 uppercase tracking-tighter">
                                    Current Lead Status
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {statusOptions.map((opt) => (
                                        <button
                                            key={opt.label}
                                            type="button"
                                            onClick={() => setFormData({...formData, status: opt.label})}
                                            className={`px-6 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer border-2 cursor-pointer
                                                ${formData.status === opt.label 
                                                    ? 'bg-slate-900 text-white border-slate-900 scale-105 shadow-lg shadow-slate-200' 
                                                    : 'bg-white text-slate-400 border-slate-100 hover:border-indigo-200'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && <p className="text-rose-500 text-xs font-bold bg-rose-50 p-4 rounded-2xl border border-rose-100 italic">⚠️ {error}</p>}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all cursor-pointer"
                            >
                                <Sparkles size={20} /> Generate New Lead
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </main>
        </div>
        </>
    );
};

// Reusable Input Component for Clean Code
const InputField = ({ label, icon, placeholder, value, onChange }) => (
    <div className="space-y-2">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
            {label}
        </label>
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                {icon}
            </div>
            <input 
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl text-slate-700 font-bold text-sm outline-none transition-all placeholder:text-slate-300 shadow-inner"
                autoComplete='off'
            />
        </div>
    </div>
);

export default CreateLead;