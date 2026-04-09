import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
    ArrowLeft, Save, Calendar, MessageSquare, 
    CheckCircle2, AlertCircle, Sparkles, Loader2,
    Edit3
} from 'lucide-react';

const EditFollowUp = () => {
    const { leadId, followupId } = useParams();
    const navigate = useNavigate();
    const apiBaseUrl = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState({
        lastSentMessage: '',
        responseType: '',
        lastContactDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');

    const responseOptions = [
        { label: 'Positive', light: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
        { label: 'Natural', light: 'bg-amber-50 text-amber-600 border-amber-200' },
        { label: 'NoResponse', light: 'bg-rose-50 text-rose-600 border-rose-200' }
    ];

    // --- DATE PARSER HELPER ---
    // Converts "09-april-2026" to "2026-04-09" for HTML Input
    const parseDateForInput = (dateStr) => {
        if (!dateStr || !dateStr.includes('-')) return '';
        
        const parts = dateStr.split('-');
        if (parts.length !== 3) return '';

        const day = parts[0];
        const monthStr = parts[1].toLowerCase();
        const year = parts[2];

        const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        const monthIndex = monthNames.indexOf(monthStr);
        
        if (monthIndex === -1) return ''; // Agar month name match na ho

        const month = String(monthIndex + 1).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${apiBaseUrl}api/lead/my-leads`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.success) {
                    const currentLead = res.data.data.find(l => l._id === leadId);
                    if (currentLead) {
                        const fup = currentLead.followUp.find(f => f._id === followupId);
                        if (fup) {
                            setFormData({
                                lastSentMessage: fup.lastSentMessage || '',
                                responseType: fup.responseType || '',
                                // Yahan purani date ko parse kar rahe hain
                                lastContactDate: parseDateForInput(fup.lastContactDate) 
                            });
                        }
                    }
                }
            } catch (err) {
                setError("Failed to load existing data");
            } finally {
                setFetching(false);
            }
        };
        fetchInitialData();
    }, [leadId, followupId, apiBaseUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.lastSentMessage || !formData.responseType || !formData.lastContactDate) {
            setError('All fields are required for a professional update.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${apiBaseUrl}api/lead/edit-followup`, {
                leadId,
                followUpId: followupId,
                ...formData
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                navigate('/my-leads');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center p-4 md:p-8">
            <div className="w-full max-w-2xl flex items-center justify-between mb-8">
                <motion.button 
                    whileHover={{ x: -5 }}
                    onClick={() => window.history.back()}
                    className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-600 cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </motion.button>
                <div className="text-right">
                    <h1 className="text-xl font-black text-slate-900 leading-none">Edit Interaction</h1>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Refine your follow-up data</p>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none rotate-12">
                    <Edit3 size={150} className="text-indigo-600" />
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-black text-slate-700 ml-1">
                            <MessageSquare size={16} className="text-indigo-500" /> Message Sent
                        </label>
                        <textarea 
                            value={formData.lastSentMessage}
                            onChange={(e) => setFormData({...formData, lastSentMessage: e.target.value})}
                            className="w-full min-h-[140px] p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.8rem] text-slate-700 font-medium transition-all outline-none resize-none shadow-inner"
                            placeholder="Update your conversation details..."
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-black text-slate-700 ml-1">
                            <CheckCircle2 size={16} className="text-indigo-500" /> Client Sentiment
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {responseOptions.map((opt) => (
                                <button
                                    key={opt.label}
                                    type="button"
                                    onClick={() => setFormData({...formData, responseType: opt.label})}
                                    className={`py-4 rounded-2xl font-black text-sm transition-all cursor-pointer border-2 
                                        ${formData.responseType === opt.label 
                                            ? `${opt.light} scale-105 shadow-lg shadow-slate-100` 
                                            : 'bg-slate-50 border-transparent text-slate-400 opacity-60 hover:opacity-100'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-black text-slate-700 ml-1">
                            <Calendar size={16} className="text-indigo-500" /> Date of Interaction
                        </label>
                        <input 
                            type="date"
                            value={formData.lastContactDate}
                            onChange={(e) => setFormData({...formData, lastContactDate: e.target.value})}
                            className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl text-slate-700 font-bold transition-all outline-none cursor-pointer"
                        />
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-rose-500 bg-rose-50 p-4 rounded-2xl text-xs font-bold border border-rose-100"
                            >
                                <AlertCircle size={14} /> {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        disabled={loading}
                        className={`w-full py-5 rounded-[1.5rem] font-black text-white text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xl
                            ${loading ? 'bg-slate-300' : 'bg-indigo-600 hover:bg-slate-900 shadow-indigo-100'}`}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Update Follow-up</>}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default EditFollowUp;