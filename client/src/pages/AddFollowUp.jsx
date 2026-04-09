import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
    ArrowLeft, Send, Calendar, MessageSquare, 
    CheckCircle2, AlertCircle, Sparkles 
} from 'lucide-react';

const AddFollowUp = () => {
    const { leadId } = useParams();
    const navigate = useNavigate();
    const apiBaseUrl = import.meta.env.VITE_API_URL;

    // States
    const [formData, setFormData] = useState({
        lastSentMessage: '',
        responseType: '', // Positive, Natural, NoResponse
        lastContactDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const responseOptions = [
        { label: 'Positive', color: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-600' },
        { label: 'Natural', color: 'bg-amber-500', light: 'bg-amber-50 text-amber-600' },
        { label: 'NoResponse', color: 'bg-rose-500', light: 'bg-rose-50 text-rose-600' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.lastSentMessage || !formData.responseType || !formData.lastContactDate) {
            setError('Please fill all fields to continue.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${apiBaseUrl}api/lead/add-followup/${leadId}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                navigate('/my-leads');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center p-4 md:p-8">
            {/* Top Navigation */}
            <div className="w-full max-w-2xl flex items-center justify-between mb-8">
                <motion.button 
                    whileHover={{ x: -5 }}
                    onClick={() => navigate('/my-leads')}
                    className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-600 cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </motion.button>
                <div className="text-right">
                    <h1 className="text-xl font-black text-slate-900 leading-none">Add Follow-up</h1>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Update lead progress</p>
                </div>
            </div>

            {/* Main Form Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden"
            >
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Sparkles size={120} className="text-indigo-600" />
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                    
                    {/* Message Field */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-black text-slate-700 ml-1">
                            <MessageSquare size={16} className="text-indigo-500" /> Last Message Sent
                        </label>
                        <textarea 
                            value={formData.lastSentMessage}
                            onChange={(e) => setFormData({...formData, lastSentMessage: e.target.value})}
                            placeholder="What was your last interaction? (e.g., Sent proposal via WhatsApp)"
                            className="w-full min-h-[120px] p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] text-slate-700 font-medium transition-all outline-none resize-none"
                        />
                    </div>

                    {/* Response Type (Custom Radio Buttons) */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-black text-slate-700 ml-1">
                            <CheckCircle2 size={16} className="text-indigo-500" /> Response Sentiment
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {responseOptions.map((opt) => (
                                <button
                                    key={opt.label}
                                    type="button"
                                    onClick={() => setFormData({...formData, responseType: opt.label})}
                                    className={`py-4 rounded-2xl font-black text-sm transition-all cursor-pointer border-2 
                                        ${formData.responseType === opt.label 
                                            ? `${opt.light} border-indigo-200 scale-105 shadow-lg shadow-indigo-50` 
                                            : 'bg-slate-50 border-transparent text-slate-400 opacity-60 hover:opacity-100'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-black text-slate-700 ml-1">
                            <Calendar size={16} className="text-indigo-500" /> Contact Date
                        </label>
                        <input 
                            type="date"
                            value={formData.lastContactDate}
                            onChange={(e) => setFormData({...formData, lastContactDate: e.target.value})}
                            className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl text-slate-700 font-bold transition-all outline-none cursor-pointer"
                        />
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 text-rose-500 bg-rose-50 p-4 rounded-2xl text-xs font-bold border border-rose-100"
                            >
                                <AlertCircle size={14} /> {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className={`w-full py-5 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xl
                            ${loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-indigo-600 shadow-indigo-100'}`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send size={18} /> Log Follow-up
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default AddFollowUp;