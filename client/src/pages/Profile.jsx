import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Mail, Shield, Phone, Building2, 
    PlusCircle, LayoutList, Loader2, TrendingUp, 
    CheckCircle2, XCircle, Info, ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Profile = () => {
    const navigate = useNavigate();
    const apiBaseUrl = import.meta.env.VITE_API_URL;
    
    const [user, setUser] = useState(null);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ New: 0, InProgress: 0, Rejected: 0, Confirm: 0 });

    useEffect(() => {
        // LocalStorage se user get karna
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);

        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${apiBaseUrl}api/lead/my-leads`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.success) {
                    const data = res.data.data;
                    setLeads(data);
                    
                    // Stats calculate karna
                    const counts = data.reduce((acc, lead) => {
                        acc[lead.status] = (acc[lead.status] || 0) + 1;
                        return acc;
                    }, { New: 0, InProgress: 0, Rejected: 0, Confirm: 0 });
                    
                    setStats(counts);
                }
            } catch (err) {
                console.error("Error fetching profile data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiBaseUrl]);

    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={50} />
                <h2 className="text-xl font-black text-slate-800 tracking-tighter">LOADING {user?.username?.toUpperCase()} DATA...</h2>
            </div>
        );
    }

    return (
        <>
        <Navbar />
        <div className="min-h-screen bg-[#F8FAFC] pb-20 mt-2">
            {/* Top Banner (Static Design) */}
            <div className="h-48 bg-indigo-700 w-full relative overflow-hidden rounded-t-[25px]">
                <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT: User Profile Card */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-8">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-lg mb-4">
                                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">{user?.username || "Premium User"}</h2>
                                
                                <div className="w-full mt-8 space-y-4 text-left">
                                    <ProfileInfoItem icon={<Mail size={16}/>} label="Email" value={user?.email} />
                                    <ProfileInfoItem icon={<Shield size={16}/>} label="Role" value={user?.isAdmin ? "Administrator" : "Lead Manager"} />
                                    <ProfileInfoItem icon={<Shield size={16}/>} label="Total Leads" value={leads?.length} />
                                </div>

                                <div className="mt-8 flex gap-3 w-full">
                                    <button onClick={() => navigate('/create-lead')} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl text-[11px] font-black uppercase tracking-tighter flex items-center justify-center gap-2 transition-all cursor-pointer">
                                        <PlusCircle size={16}/> Create
                                    </button>
                                    <button onClick={() => navigate('/my-leads')} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl text-[11px] font-black uppercase tracking-tighter flex items-center justify-center gap-2 transition-all cursor-pointer">
                                        <LayoutList size={16}/> All Leads
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Static Info Card */}
                        {/* <div className="bg-slate-900 rounded-[2rem] p-6 text-white overflow-hidden relative">
                            <TrendingUp className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32" />
                            <h4 className="font-bold text-indigo-400 text-xs uppercase tracking-widest mb-2">Performance Tip</h4>
                            <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                "Responding to a lead within <span className="text-white font-bold">5 minutes</span> increases conversion rates by 9x."
                            </p>
                        </div> */}
                    </div>

                    {/* RIGHT: Stats and List */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Status Cards Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="New" count={stats.New} color="blue" icon={<Info size={20}/>} />
                            <StatCard label="In Progress" count={stats.InProgress} color="amber" icon={<clock size={20}/>} />
                            <StatCard label="Rejected" count={stats.Rejected} color="rose" icon={<XCircle size={20}/>} />
                            <StatCard label="Confirmed" count={stats.Confirm} color="emerald" icon={<CheckCircle2 size={20}/>} />
                        </div>

                        {/* Leads List Preview */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Activity</h3>
                                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Live Updates</span>
                            </div>

                            <div className="space-y-4">
                                {leads.slice(0, 5).map((lead) => (
                                    <div key={lead._id} className="group flex items-center justify-between p-4 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                                                <Building2 size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{lead.clientName}</h4>
                                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">{lead.companyName}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-6">
                                            <div className="hidden md:block text-right">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-end gap-1">
                                                    <Phone size={10}/> Contact
                                                </p>
                                                <p className="text-xs font-black text-slate-700">{lead.phone}</p>
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest
                                                ${lead.status === 'Confirm' ? 'bg-emerald-100 text-emerald-600' : 
                                                  lead.status === 'Rejected' ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-600'}`}>
                                                {lead.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {leads.length === 0 && (
                                    <p className="text-center py-10 text-slate-400 font-bold italic">No leads found in your profile.</p>
                                )}
                            </div>

                            <button onClick={() => navigate('/my-leads')} className="w-full mt-8 py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs font-bold hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-500 transition-all flex items-center justify-center gap-2 cursor-pointer">
                                View Full Directory <ArrowRight size={16}/>
                            </button>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
        </>
    );
};

// Reusable Components
const ProfileInfoItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
        <div className="text-indigo-600">{icon}</div>
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">{label}</p>
            <p className="text-sm font-bold text-slate-700">{value || "Not Set"}</p>
        </div>
    </div>
);

const StatCard = ({ label, count, color, icon }) => {
    const colors = {
        blue: 'text-blue-600 bg-blue-50 border-blue-100',
        amber: 'text-amber-600 bg-amber-50 border-amber-100',
        rose: 'text-rose-600 bg-rose-50 border-rose-100',
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100'
      };
    return (
        <div className={`p-5 rounded-[2rem] border ${colors[color]} flex flex-col items-center text-center group hover:scale-105 transition-transform duration-300`}>
            <div className="mb-2 opacity-60">{icon}</div>
            <p className="text-2xl font-black">{count}</p>
            <p className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-70">{label}</p>
        </div>
    );
};

export default Profile;