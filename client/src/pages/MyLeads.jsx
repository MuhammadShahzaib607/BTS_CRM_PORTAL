import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Trash2, Edit3, Phone, Mail, Globe, 
    Briefcase, MessageSquare, User, ArrowLeft,
    ChevronDown, ChevronUp, Clock, Calendar, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MyLeads = () => {
    const apiBaseUrl = import.meta.env.VITE_API_URL;
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [confirmModal, setConfirmModal] = useState({ show: false, type: '', data: null });
    const navigate = useNavigate();

    const filters = ['All', 'New', 'InProgress', 'Confirm', 'Rejected'];

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${apiBaseUrl}api/lead/my-leads`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setLeads(res.data.data);
                setFilteredLeads(res.data.data);
                console.log(res.data.data)
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            setTimeout(() => setLoading(false), 800);
        }
    };

    // --- FIX: DELETE FOLLOWUP LOGIC ---
    const handleDeleteFollowUp = async () => {
        const { leadId, followUpId } = confirmModal.data;
        try {
            const token = localStorage.getItem('token');
            // Axios Delete with Body and Headers needs 'data' key in config
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

    useEffect(() => { fetchLeads(); }, []);

    useEffect(() => {
        if (activeFilter === 'All') setFilteredLeads(leads);
        else setFilteredLeads(leads.filter(lead => lead.status === activeFilter));
    }, [activeFilter, leads]);

    return (
       <>
       <Navbar />
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 relative mt-2">
            
            {/* --- CUSTOM DELETE MODAL --- */}
            <AnimatePresence>
                {confirmModal.show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setConfirmModal({ show: false, type: '', data: null })}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center"
                        >
                            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Are you sure?</h3>
                            <p className="text-slate-500 text-sm mt-2 font-medium">This action is permanent and cannot be undone.</p>
                            
                            <div className="flex gap-3 mt-8">
                                <button 
                                    onClick={() => setConfirmModal({ show: false, type: '', data: null })}
                                    className="flex-1 py-3 font-bold text-slate-500 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmModal.type === 'lead' ? handleDeleteLead : handleDeleteFollowUp}
                                    className="flex-1 py-3 font-bold text-white bg-rose-500 rounded-2xl hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <p className="mt-4 font-bold text-slate-400 tracking-widest text-xs uppercase">Fetching Leads...</p>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto">
                        
                        {/* --- TOP NAVIGATION --- */}
                        <div className="flex items-center justify-between mb-8">
                            <button onClick={() => navigate('/')} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                                <ArrowLeft size={20} />
                            </button>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight tracking-tighter flex items-center">
                                 BTS_CRM PORTAL
                            </h2>
                            <div className="text-gray-600 font-bold"> Leads Count: {filteredLeads?.length} </div >
                        </div>

                        {/* --- FILTER BAR --- */}
                        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
                            {filters.map((f) => (
                                <button
                                    key={f} onClick={() => setActiveFilter(f)}
                                    className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-sm cursor-pointer
                                        ${activeFilter === f ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        <motion.div layout className="grid grid-cols-1 gap-6">
                            <AnimatePresence>
                                {filteredLeads.map((lead) => (
                                    <LeadCard 
                                        key={lead._id} 
                                        lead={lead} 
                                        onDelete={() => setConfirmModal({ show: true, type: 'lead', data: lead._id })}
                                        onDeleteFollowUp={(fId) => setConfirmModal({ show: true, type: 'followup', data: { leadId: lead._id, followUpId: fId } })}
                                        navigate={navigate}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
       </>
    );
};

/* --- SUB-COMPONENT: LEAD CARD --- */
const LeadCard = ({ lead, onDelete, onDeleteFollowUp, navigate }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div layout className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600">{lead.status}</span>
                        <span className="text-slate-300 text-xs font-bold flex items-center gap-1"><Clock size={12}/> {lead.date}</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">{lead.companyName || "No Company"}</h3>
                    <p className="text-slate-500 font-bold flex items-center gap-2 mb-4">
                        <User size={16} className="text-indigo-400"/> {lead.clientName} • <span className="font-medium text-slate-400">{lead.designation}</span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <InfoRow icon={<Mail size={14}/>} text={lead.emailAddress} />
                        <InfoRow icon={<Phone size={14}/>} text={lead.phone} />
                        <InfoRow icon={<Briefcase size={14}/>} text={lead.niche} />
                        <InfoRow icon={<Globe size={14}/>} text={lead.socialMediaUrl} isLink />
                    </div>
                </div>

                <div className="flex flex-row lg:flex-col justify-end gap-3 lg:border-l lg:pl-6 border-slate-50">
                    <button onClick={onDelete} className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all cursor-pointer"><Trash2 size={20} /></button>
                    <button onClick={()=> navigate(`/edit-lead/${lead._id}`)} className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer"><Edit3 size={20} /></button>
                    <button onClick={() => navigate(`/add-follow-up/${lead._id}`)} className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all cursor-pointer flex items-center justify-center gap-2 lg:mt-auto font-bold text-xs">
                        <Plus size={18} /> New Followup
                    </button>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50">
                <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center justify-between w-full text-slate-500 font-bold text-sm hover:text-indigo-600 transition-all cursor-pointer">
                    <div className="flex items-center gap-2"><MessageSquare size={18} className="text-indigo-400" /> Follow-ups ({lead.followUp?.length || 0})</div>
                    {isExpanded ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                {lead.followUp?.length > 0 ? lead.followUp.map((fup) => (
                                    <div key={fup._id} className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group relative">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest"><Calendar size={12}/> {fup.lastContactDate}</span>
                                            <div className="flex gap-2">
                                                <button onClick={() => navigate(`/edit-followup/${lead._id}/${fup._id}`)} className="p-1.5 bg-white text-slate-400 hover:text-indigo-600 rounded-lg shadow-sm cursor-pointer transition-colors"><Edit3 size={14}/></button>
                                                <button onClick={() => onDeleteFollowUp(fup._id)} className="p-1.5 bg-white text-slate-400 hover:text-rose-600 rounded-lg shadow-sm cursor-pointer transition-colors"><Trash2 size={14}/></button>
                                            </div>
                                        </div>
                                        <p className="text-slate-700 text-xs font-medium leading-relaxed mb-3">{fup.lastSentMessage}</p>
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${fup.responseType === 'Positive' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>Response: {fup.responseType}</span>
                                    </div>
                                )) : <p className="text-slate-400 text-xs col-span-2 text-center py-4 italic">No follow-ups yet.</p>}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const InfoRow = ({ icon, text, isLink }) => (
    <div className="flex items-center gap-3 text-slate-500 truncate">
        <div className="text-indigo-300 shrink-0">{icon}</div>
        {isLink && text ? <a href={text} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-600 truncate hover:underline">{text}</a> : <span className="text-xs font-bold truncate">{text || "Not provided"}</span>}
    </div>
);

export default MyLeads;