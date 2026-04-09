import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
    ArrowLeft, Building2, User, Briefcase, Globe, 
    Phone, Mail, Target, Loader2, Sparkles, AlertCircle 
} from 'lucide-react';

const EditLead = () => {
    const { leadId } = useParams();
    const navigate = useNavigate();
    const apiBaseUrl = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState({
        companyName: '',
        clientName: '',
        designation: '',
        socialMediaUrl: '',
        phone: '',
        emailAddress: '',
        niche: '',
        status: ''
    });

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // --- FETCH DATA AND POPULATE FORM ---
    useEffect(() => {
        const fetchLead = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${apiBaseUrl}api/lead/my-leads`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.success) {
                    // Lead find karna array se
                    const lead = res.data.data.find(l => l._id === leadId);
                    if (lead) {
                        setFormData({
                            companyName: lead.companyName || '',
                            clientName: lead.clientName || '',
                            designation: lead.designation || '',
                            socialMediaUrl: lead.socialMediaUrl || '',
                            phone: lead.phone || '',
                            emailAddress: lead.emailAddress || '',
                            niche: lead.niche || '',
                            status: lead.status || 'New'
                        });
                    }
                }
            } catch (err) {
                setError("Data load nahi ho saka.");
            } finally {
                setLoading(false);
            }
        };
        fetchLead();
    }, [leadId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${apiBaseUrl}api/lead/edit-lead/${leadId}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/my-leads');
        } catch (err) {
            setIsSubmitting(false);
            setError("Update fail ho gaya.");
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button onClick={() => window.history.back()} className="mb-6 flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-all cursor-pointer">
                    <ArrowLeft size={20} /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Heading Section */}
                    <div className="lg:col-span-4">
                        <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-xl">
                            <h1 className="text-3xl font-black italic">Edit <br/> Lead Data</h1>
                            <p className="mt-4 text-indigo-100 text-sm opacity-80 font-medium">
                                Updating details for: <br/>
                                <span className="text-white text-lg font-bold underline underline-offset-4">
                                    {formData.clientName || "Unknown Client"}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="lg:col-span-8">
                        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <EditInputField label="Company Name" icon={<Building2 size={18}/>} value={formData.companyName} onChange={(val) => setFormData({...formData, companyName: val})} />
                                <EditInputField label="Client Name" icon={<User size={18}/>} value={formData.clientName} onChange={(val) => setFormData({...formData, clientName: val})} />
                                <EditInputField label="Designation" icon={<Briefcase size={18}/>} value={formData.designation} onChange={(val) => setFormData({...formData, designation: val})} />
                                <EditInputField label="Email" icon={<Mail size={18}/>} value={formData.emailAddress} onChange={(val) => setFormData({...formData, emailAddress: val})} />
                                <EditInputField label="Phone" icon={<Phone size={18}/>} value={formData.phone} onChange={(val) => setFormData({...formData, phone: val})} />
                                <EditInputField label="Social URL" icon={<Globe size={18}/>} value={formData.socialMediaUrl} onChange={(val) => setFormData({...formData, socialMediaUrl: val})} />
                                <div className="md:col-span-2">
                                    <EditInputField label="Business Niche" icon={<Target size={18}/>} value={formData.niche} onChange={(val) => setFormData({...formData, niche: val})} />
                                </div>
                            </div>

                            {/* Status Section */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Status</label>
                                <div className="flex flex-wrap gap-2">
                                    {['New', 'InProgress', 'Rejected', 'Confirm'].map((s) => (
                                        <button 
                                            key={s} type="button" 
                                            onClick={() => setFormData({...formData, status: s})}
                                            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer
                                            ${formData.status === s ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-indigo-200'}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3">
                                <Sparkles size={20} /> Update Lead Now
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            
            {/* Full Screen Submit Loader */}
            {isSubmitting && (
                <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[200] flex flex-col items-center justify-center text-white">
                    <Loader2 className="animate-spin text-indigo-500 mb-4" size={50} />
                    <h2 className="text-xl font-bold">Saving Changes...</h2>
                </div>
            )}
        </div>
    );
};

// Simplified Input for better visibility of fetched data
const EditInputField = ({ label, icon, value, onChange }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                {icon}
            </div>
            <input 
                type="text"
                value={value} // Controlled component (Data will show up here)
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-800 font-bold text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
            />
        </div>
    </div>
);

export default EditLead;