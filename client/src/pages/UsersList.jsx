import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, ShieldCheck, Mail, Hash, Briefcase, 
    ChevronRight, Loader2, ArrowLeft, Search, RefreshCw 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const UsersList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
const user = JSON.parse(localStorage.getItem("user"))

    const apiBaseUrl = "https://bts-crm-portal-backend.vercel.app/";

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Dono APIs ko parallel fetch karna for better performance
            const [usersRes, leadsRes] = await Promise.all([
                axios.get(`${apiBaseUrl}api/user/all-users/${user._id}`, { headers }), // Assuming all-users endpoint
                axios.get(`${apiBaseUrl}api/lead/all-leads`, { headers })
            ]);

            setUsers(usersRes.data.data || []);
            setLeads(leadsRes.data.data || []);
        } catch (error) {
            console.error("Data Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Helper: Har user ki leads count nikalna
    const getUserLeadsCount = (userId) => {
        return leads.filter(lead => lead.createdBy === userId).length;
    };

    const filteredUsers = users.filter(user => 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#FDFDFF]">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
            <p className="text-slate-400 font-black tracking-widest text-[10px] uppercase">Decrypting User Database...</p>
        </div>
    );

    return (
        <>
        <Navbar />
        <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="flex items-center gap-5">
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:text-indigo-600 transition-all cursor-pointer"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic">SYSTEM USERS</h1>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">Cross-Reference Personnel & Leads</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                                type="text"
                                placeholder="Search identity..."
                                className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-[250px] font-bold text-slate-600"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button onClick={fetchData} className="p-3 bg-indigo-600 text-white rounded-2xl hover:rotate-180 transition-all duration-500 cursor-pointer shadow-lg shadow-indigo-100">
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>

                {/* Users Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredUsers.map((user, index) => {
                            const leadCount = getUserLeadsCount(user._id);
                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={user._id}
                                    className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 overflow-hidden"
                                >
                                    {/* Admin Badge */}
                                    {user.isAdmin && (
                                        <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full border border-emerald-100">
                                            <ShieldCheck size={12} fill="currentColor" className="fill-emerald-100"/>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Admin</span>
                                        </div>
                                    )}

                                    {/* User Identity */}
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                                            <Users size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800 leading-tight truncate w-40">{user.username}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {user._id.slice(-8)}...</p>
                                        </div>
                                    </div>

                                    {/* Info Rows */}
                                    <div className="space-y-4 mb-8">
                                        <InfoRow icon={<Mail size={14}/>} label="Email Address" value={user.email} />
                                        <InfoRow icon={<Hash size={14}/>} label="Security Token" value="**********" />
                                        <InfoRow 
                                            icon={<Briefcase size={14}/>} 
                                            label="Contribution" 
                                            value={`${leadCount} Leads Created`} 
                                            highlight={leadCount > 0}
                                        />
                                    </div>

                                    {/* Progress Bar for Leads (Visual Aid) */}
                                    <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden mb-6">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(leadCount * 10, 100)}%` }}
                                            className="h-full bg-indigo-500 rounded-full"
                                        />
                                    </div>

                                    <button className="w-full py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors cursor-pointer group-hover:shadow-lg group-hover:shadow-indigo-200"
                                    onClick={()=> navigate(`/user-lead/${user._id}`)}
                                    >
                                        View Leads Data <ChevronRight size={14}/>
                                    </button>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
        </>
    );
};

const InfoRow = ({ icon, label, value, highlight }) => (
    <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400">
            {icon}
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <span className={`text-xs font-bold truncate max-w-[150px] ${highlight ? 'text-indigo-600' : 'text-slate-600'}`}>
            {value}
        </span>
    </div>
);

export default UsersList;