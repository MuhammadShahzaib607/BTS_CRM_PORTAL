import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, Filter, Calendar, Building2, User, Phone, 
    Globe, Mail, MessageSquare, ChevronDown, ChevronUp,
    BarChart3, Hash, Briefcase, ExternalLink, Loader2
} from 'lucide-react';
import Navbar from '../components/Navbar';

const UserLead = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [expandedLead, setExpandedLead] = useState(null);

    const apiBaseUrl = "https://bts-crm-portal-backend.vercel.app/";

    useEffect(() => {
        const fetchUserLeads = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                // Hum saari leads fetch karenge phir userId se filter karenge
                const res = await axios.get(`${apiBaseUrl}api/lead/all-leads`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.success) {
                    const filtered = res.data.data.filter(lead => lead.createdBy === userId);
                    setLeads(filtered);
                }
            } catch (error) {
                console.error("Error fetching leads:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserLeads();
    }, [userId]);

    // --- ANALYTICS LOGIC ---
    const stats = useMemo(() => {
        const categories = ["New", "InProgress", "Rejected", "Confirm"];
        const counts = { All: leads.length };
        categories.forEach(cat => {
            counts[cat] = leads.filter(l => l.status === cat).length;
        });
        return counts;
    }, [leads]);

    // --- FILTERED LEADS ---
    const filteredLeads = useMemo(() => {
        if (activeFilter === 'All') return leads;
        return leads.filter(l => l.status === activeFilter);
    }, [leads, activeFilter]);

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
            <p className="text-slate-400 font-black tracking-widest text-[10px] uppercase italic">Filtering User Assets...</p>
        </div>
    );

    return (
       <>
       <Navbar />
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10">
            <div className="max-w-6xl mx-auto">
                
                {/* Header & Back Button */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-5">
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:text-indigo-600 transition-all cursor-pointer"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">User Leads</h1>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                                <Hash size={12}/> {userId}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white px-6 py-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Leads</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{stats.All}</p>
                    </div>
                </div>

                {/* Stats & Quick Filters */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
                    {['All', 'New', 'InProgress', 'Confirm', 'Rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setActiveFilter(status)}
                            className={`p-4 rounded-[1.5rem] border transition-all duration-300 cursor-pointer text-left relative overflow-hidden group
                            ${activeFilter === status ? 'bg-slate-900 border-slate-900 shadow-xl' : 'bg-white border-slate-100 shadow-sm hover:border-indigo-200'}`}
                        >
                            <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${activeFilter === status ? 'text-slate-400' : 'text-slate-400'}`}>
                                {status}
                            </p>
                            <p className={`text-xl font-black ${activeFilter === status ? 'text-white' : 'text-slate-800'}`}>
                                {stats[status] || 0}
                            </p>
                            {activeFilter === status && (
                                <motion.div layoutId="activeInd" className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500">
                                    <Filter size={20} />
                                </motion.div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Leads List */}
                <div className="space-y-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredLeads.map((lead) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                key={lead._id}
                                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
                            >
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col lg:flex-row gap-8">
                                        
                                        {/* Basic Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                                        <Building2 size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-black text-slate-800 leading-tight">{lead.clientName}</h3>
                                                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{lead.companyName}</p>
                                                    </div>
                                                </div>
                                                <StatusBadge status={lead.status} />
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                <LeadInfo icon={<Briefcase size={14}/>} label="Designation" value={lead.designation} />
                                                <LeadInfo icon={<Phone size={14}/>} label="Contact" value={lead.phone} />
                                                <LeadInfo icon={<Mail size={14}/>} label="Email" value={lead.emailAddress} />
                                                <LeadInfo icon={<Globe size={14}/>} label="Niche" value={lead.niche} />
                                                <LeadInfo icon={<Calendar size={14}/>} label="Date" value={lead.date} />
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Social</p>
                                                        {
                                                            lead?.socialMediaUrl ?
                                                            <a href={lead?.socialMediaUrl} target="_blank" className="text-xs font-black text-indigo-600 flex items-center gap-1 hover:underline">
                                                        View Profile <ExternalLink size={12}/>
                                                    </a> :
                                       <span className="text-xs font-bold truncate">Not Provided</span>
                                                        }
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="lg:w-48 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-50 pt-6 lg:pt-0 lg:pl-8">
                                            <button 
                                                onClick={() => setExpandedLead(expandedLead === lead._id ? null : lead._id)}
                                                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-lg
                                                ${expandedLead === lead._id ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-slate-900 text-white shadow-slate-100'}`}
                                            >
                                                <MessageSquare size={16} /> {lead.followUp?.length || 0} Logs
                                                {expandedLead === lead._id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Followups Dropdown */}
                                <AnimatePresence>
                                    {expandedLead === lead._id && (
                                        <motion.div 
                                            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                                            className="bg-slate-50/50 border-t border-slate-100 overflow-hidden"
                                        >
                                            <div className="p-6 md:p-8 space-y-4">
                                                {lead.followUp?.length > 0 ? lead.followUp.map((fup, idx) => (
                                                    <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                                                        <div className="flex gap-4">
                                                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${fup.responseType === 'Positive' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-700 italic">"{fup.lastSentMessage}"</p>
                                                                <div className="flex items-center gap-3 mt-2">
                                                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter bg-indigo-50 px-2 py-0.5 rounded">{fup.responseType}</span>
                                                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Calendar size={10}/> {fup.lastContactDate}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <p className="text-center py-4 text-slate-400 text-xs font-bold uppercase tracking-widest">No activity recorded</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredLeads.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                            <Briefcase size={40} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No {activeFilter} leads found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
       </>
    );
};

// --- SUB-COMPONENTS ---
const StatusBadge = ({ status }) => {
    const styles = {
        Confirm: "bg-emerald-50 text-emerald-600 border-emerald-100",
        Rejected: "bg-rose-50 text-rose-600 border-rose-100",
        InProgress: "bg-amber-50 text-amber-600 border-amber-100",
        New: "bg-indigo-50 text-indigo-600 border-indigo-100"
    };
    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.New}`}>
            {status}
        </span>
    );
};

const LeadInfo = ({ icon, label, value }) => (
    <div className="space-y-1">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
            {icon} {label}
        </p>
        <p className="text-xs font-black text-slate-700 truncate">{value || 'N/A'}</p>
    </div>
);

export default UserLead;