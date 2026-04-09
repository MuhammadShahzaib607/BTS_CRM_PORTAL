import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const WelcomeHeader = () => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
  const navigate = useNavigate()
  const userData = JSON.parse(localStorage.getItem("user"))

  return (
    <div className="w-full min-h-[400px] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Custom spring-like curve
        className="max-w-4xl w-full text-center relative"
      >
        {/* Modern Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/[0.03] border border-slate-900/10 mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            BTS_CRM • Good {greeting}
          </span>
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
          Everything you need, <br />
          <span className="inline-block pb-2 text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-500">
            right here, {userData.username}.
          </span>
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10 font-medium">
          Manage leads, track follow-ups, and close deals without the noise. 
          The cleanest CRM experience you've ever had.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold overflow-hidden transition-all shadow-2xl shadow-slate-200 cursor-pointer"
            onClick={()=> navigate("/create-lead")}
          >
            <span className="relative z-10 flex items-center gap-2">
               Create Lead
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(15, 23, 42, 0.05)" }}
            whileTap={{ scale: 0.98 }}
            onClick={()=> navigate("/my-leads")}
            className="px-8 py-4 text-slate-900 rounded-2xl font-semibold border-2 border-slate-200 transition-all cursor-pointer"
          >
            Review Insights
          </motion.button>
        </div>

        {/* Floating Stat Indicators (Visual Polish) */}
        <div className="hidden lg:block">
            <FloatingBadge text="Manage Your Leads" position="top-0 -left-10" delay={0.4} />
            <FloatingBadge text="3 Follow-ups Today" position="bottom-10 -right-10" delay={0.6} />
        </div>
      </motion.div>
    </div>
  );
};

const FloatingBadge = ({ text, position, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    className={`absolute ${position} px-4 py-2 bg-white shadow-xl shadow-slate-100 rounded-xl border border-slate-50 text-xs font-bold text-slate-800 pointer-events-none`}
  >
    {text}
  </motion.div>
)

export default WelcomeHeader;