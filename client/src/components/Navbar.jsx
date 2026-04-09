import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Home, PlusCircle, LayoutList, UserCircle, 
    LogOut, Sparkles, Globe, Users
} from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [hoveredTab, setHoveredTab] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Check Admin Status from LocalStorage
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                setIsAdmin(user.isAdmin === true);
            } catch (error) {
                console.error("Error parsing user data:", error);
                setIsAdmin(false);
            }
        }
    }, []);

    // Base Navigation Items
    const navItems = [
        { id: 'home', path: '/', icon: <Home size={22} />, label: 'Home' },
        { id: 'create', path: '/create-lead', icon: <PlusCircle size={22} />, label: 'Create Lead' },
        { id: 'leads', path: '/my-leads', icon: <LayoutList size={22} />, label: 'View Leads' },
    ];

    // Admin Specific Items (Add only if isAdmin is true)
    if (isAdmin) {
        navItems.push(
            { id: 'all-leads', path: '/all-leads', icon: <Globe size={22} />, label: 'All Leads' },
            { id: 'all-users', path: '/all-users', icon: <Users size={22} />, label: 'All Users' }
        );
    }

    // Account always at the end
    navItems.push({ id: 'profile', path: '/profile', icon: <UserCircle size={22} />, label: 'Account' });

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="z-[80] px-4 py-3">
            <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[1.5rem] px-6 py-3 flex items-center justify-between">
                
                {/* Logo Section */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
                        <Sparkles size={18} />
                    </div>
                    <span className="font-black text-slate-800 tracking-tighter text-lg hidden lg:block uppercase">BTS_CRM</span>
                </div>

                {/* Navigation Icons (Center) */}
                <div className="flex items-center gap-4 sm:gap-7 p-1.5 rounded-2xl">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <div 
                                key={item.id}
                                className="relative flex flex-col items-center"
                                onMouseEnter={() => setHoveredTab(item.id)}
                                onMouseLeave={() => setHoveredTab(null)}
                            >
                                <button
                                    onClick={() => navigate(item.path)}
                                    className={`p-3 rounded-xl transition-all duration-300 relative cursor-pointer
                                        ${isActive 
                                            ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100' 
                                            : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                                >
                                    {item.icon}
                                    {isActive && (
                                        <motion.div 
                                            layoutId="activeTab"
                                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full"
                                        />
                                    )}
                                </button>

                                {/* Tooltip (Hover Label) */}
                                <AnimatePresence>
                                    {hoveredTab === item.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                            className="absolute top-full mt-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg whitespace-nowrap pointer-events-none shadow-xl z-20"
                                        >
                                            {item.label}
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* Right Side: Logout */}
                <div className="flex items-center gap-3">
                    <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden sm:block" />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="group flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-rose-100"
                    >
                        <LogOut size={20} />
                        <span className="text-xs font-black uppercase tracking-widest hidden sm:block">Logout</span>
                    </motion.button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;