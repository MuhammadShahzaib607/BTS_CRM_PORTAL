import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Search, Trash2, Edit3, MessageSquare, Building2, User, Phone,
    Loader2, ShieldAlert, Globe, Calendar, ChevronDown, ChevronUp,
    X, AlertTriangle, ArrowLeft, Mail, Briefcase, Hash
} from 'lucide-react';
import Navbar from "../components/Navbar"

const AllLeads = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"))
    const [leads, setLeads] = useState([]);
    const [creators, setCreators] = useState({}); // Cache for usernames
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [expandedLead, setExpandedLead] = useState(null);

    // Unified Modal State
    const [confirmModal, setConfirmModal] = useState({ show: false, type: '', data: null });

    const apiBaseUrl = import.meta.env.VITE_API_URL

    // --- FETCH LEADS & USER DATA ---
    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${apiBaseUrl}api/lead/all-leads`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                const fetchedLeads = res.data.data;
                setLeads(fetchedLeads);

                // Fetch creator names for each unique ID
                const uniqueUserIds = [...new Set(fetchedLeads.map(l => l.createdBy))];
                fetchUsernames(uniqueUserIds, token);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    }, [apiBaseUrl]);

    const fetchUsernames = async (ids, token) => {
        const userMap = { ...creators };
        for (const id of ids) {
            if (!userMap[id]) {
                try {
                    const res = await axios.get(`${apiBaseUrl}api/user/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    userMap[id] = res.data.data.username || 'Unknown';
                    // console.log(res.data.data)
                } catch {
                    userMap[id] = 'Ghost User';
                }
            }
        }
        setCreators(userMap);
    };

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    // --- DELETE LOGIC ---
    const handleDeleteLead = async () => {
        const leadId = confirmModal.data;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${apiBaseUrl}api/lead/delete-lead/${leadId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConfirmModal({ show: false, type: '', data: null });
            fetchLeads();
        } catch (error) {
            console.log("Delete Lead Error:", error.message);
        }
    };

    const handleDeleteFollowUp = async () => {
        const { leadId, followUpId } = confirmModal.data;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${apiBaseUrl}api/lead/delete-followup`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { leadId, followUpId }
            });
            setConfirmModal({ show: false, type: '', data: null });
            fetchLeads();
        } catch (error) {
            console.log("Delete Error:", error.response?.data || error.message);
        }
    };

    // --- FILTERING ---
    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.companyName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || lead.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
            <div className="relative">
                <Loader2 className="animate-spin text-indigo-600" size={60} />
                <ShieldAlert className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400" size={20} />
            </div>
            <p className="mt-4 text-slate-500 font-black tracking-widest text-xs uppercase">Authorized Access Only...</p>
        </div>
    );

    return (
    <>
    <Navbar />
       <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-10 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all cursor-pointer">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">MASTER DIRECTORY</h1>
                                <span className="bg-indigo-600 text-white text-[10px] px-3 py-1 rounded-full font-black tracking-widest uppercase shadow-lg shadow-indigo-100">ADMIN</span>
                            </div>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Manage global leads & interactions</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center min-w-[120px]">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Active Leads</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tighter">{leads.length}</p>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-3 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input
                            type="text"
                            placeholder="Search by client, company or niche..."
                            className="w-full pl-14 pr-6 py-4 bg-slate-50/50 rounded-[1.5rem] border-none outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700 placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 p-1 overflow-x-auto no-scrollbar">
                        {['All', 'New', 'InProgress', 'Confirm', 'Rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer
                                ${filterStatus === status ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-50'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Leads Grid */}
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredLeads.map((lead) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={lead._id}
                                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group"
                            >
                                {/* Lead Main Card */}
                                <div className="p-8 flex flex-col lg:flex-row lg:items-center gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                                    <Building2 size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-800 leading-none">{lead.clientName}</h3>
                                                    <p className="text-xs font-bold text-indigo-500 mt-1 uppercase tracking-widest">{lead.companyName}</p>
                                                </div>
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border
                                                ${lead.status === 'Confirm' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    lead.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                        'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                {lead.status}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <InfoItem icon={<User size={14} />} label="USERNAME" value={creators[lead.createdBy] || '...'} color="text-slate-900" />
                                            <InfoItem icon={<Phone size={14} />} label="PHONE" value={lead.phone} />
                                            <InfoItem icon={<Globe size={14} />} label="NICHE" value={lead.niche} />
                                            <InfoItem icon={<Calendar size={14} />} label="CREATED ON" value={lead.date} />
                                        </div>
                                    </div>

                                    <div className="flex lg:flex-col gap-2 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-50 lg:pl-8">
                                        <div className="flex gap-2">
                                            <ActionButton icon={<Edit3 size={18} />} color="hover:bg-indigo-50 text-indigo-500" onClick={() => navigate(`/edit-lead/${lead._id}`)} label="Edit" />
                                            <ActionButton icon={<Trash2 size={18} />} color="hover:bg-rose-50 text-rose-500" onClick={() => setConfirmModal({ show: true, type: 'lead', data: lead._id })} label="Delete" />
                                        </div>
                                        <button
                                            onClick={() => setExpandedLead(expandedLead === lead._id ? null : lead._id)}
                                            className={`flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer px-5
                                            ${expandedLead === lead._id ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-900 text-white shadow-slate-200'} shadow-lg`}
                                        >
                                            <MessageSquare size={16} /> {lead.followUp?.length} Logs
                                            {expandedLead === lead._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Dropdown Follow-ups */}
                                <AnimatePresence>
                                    {expandedLead === lead._id && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 'auto' }}
                                            exit={{ height: 0 }}
                                            className="bg-slate-50/50 border-t border-slate-100 overflow-hidden"
                                        >
                                            <div className="p-8 space-y-4">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <Hash size={12} /> Interaction History
                                                </h4>
                                                {lead.followUp?.length > 0 ? lead.followUp.map((fup, idx) => (
                                                    <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 group/fup shadow-sm">
                                                        <div className="flex items-start gap-4">
                                                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${fup.responseType === 'Positive' ? 'bg-emerald-500' : fup.responseType === 'NoResponse' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-700 italic leading-relaxed">"{fup.lastSentMessage}"</p>
                                                                <div className="flex items-center gap-3 mt-2">
                                                                    <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">{fup.responseType}</span>
                                                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Calendar size={10} /> {fup.lastContactDate}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 shrink-0 md:opacity-0 group-hover/fup:opacity-100 transition-opacity">
                                                            <button onClick={() => navigate(`/edit-followup/${lead._id}/${fup._id}`)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer"><Edit3 size={14} /></button>
                                                            <button onClick={() => setConfirmModal({ show: true, type: 'followup', data: { leadId: lead._id, followUpId: fup._id } })} className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="text-center py-6 text-slate-400 font-bold text-xs uppercase tracking-widest italic">No follow-ups recorded yet.</div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredLeads.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 mt-10">
                        <ShieldAlert className="mx-auto text-slate-200 mb-4" size={60} />
                        <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest leading-none">Accessing Logs...</h2>
                        <p className="text-slate-300 font-bold mt-2">No leads found matching your clearance level.</p>
                    </div>
                )}
            </div>

            {/* Custom Modern Confirmation Modal */}
            <AnimatePresence>
                {confirmModal.show && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setConfirmModal({ show: false, type: '', data: null })}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <AlertTriangle size={120} />
                            </div>
                            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mb-6">
                                <AlertTriangle size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tighter leading-none mb-3 italic">ARE YOU SURE?</h2>
                            <p className="text-slate-500 font-bold text-sm leading-relaxed mb-10 uppercase tracking-tight">
                                This action will permanently erase this {confirmModal.type} from the master database. This cannot be undone.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setConfirmModal({ show: false, type: '', data: null })}
                                    className="flex-1 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all cursor-pointer uppercase tracking-widest text-[10px]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmModal.type === 'lead' ? handleDeleteLead : handleDeleteFollowUp}
                                    className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-100 transition-all cursor-pointer uppercase tracking-widest text-[10px]"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    </> 
    );
};

// --- HELPER COMPONENTS ---
const InfoItem = ({ icon, label, value, color = "text-slate-500" }) => (
    <div className="space-y-1">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
            {icon} {label}
        </p>
        <p className={`text-[11px] font-black truncate ${color}`}>{value || 'N/A'}</p>
    </div>
);

const ActionButton = ({ icon, color, onClick, label }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all cursor-pointer shrink-0 ${color}`}
    >
        {icon}
        <span className="text-[8px] font-black uppercase tracking-tighter">{label}</span>
    </button>
);

export default AllLeads;