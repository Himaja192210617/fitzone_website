import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    Dumbbell,
    Users,
    TrendingUp,
    ShieldCheck,
    Zap,
    Activity,
    ArrowRight,
    ChevronDown,
    Facebook,
    Twitter,
    Instagram,
    Mail,
    Phone,
    LayoutDashboard,
    ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const WebLanding = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { scrollY } = useScroll();
    const navBackground = useTransform(scrollY, [0, 50], ["rgba(255,255,255,0)", "rgba(255,255,255,0.95)"]);
    const navShadow = useTransform(scrollY, [0, 50], ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 20px rgba(0,0,0,0.05)"]);

    const features = [
        {
            icon: <Zap className="text-primary" size={32} />,
            title: "Real-time AI Slots",
            desc: "Predict crowd levels and book your perfect workout time without the wait."
        },
        {
            icon: <LayoutDashboard className="text-blue-500" size={32} />,
            title: "Smart Dashboard",
            desc: "Track your attendance, upcoming bookings, and fitness progress in one place."
        },
        {
            icon: <Activity className="text-red-500" size={32} />,
            title: "Health Analytics",
            desc: "In-built BMI calculator and personalized workout guides for your goals."
        },
        {
            icon: <ShieldAlert className="text-orange-500" size={32} />,
            title: "Admin Control",
            desc: "Powerful management tools for gym owners to optimize operations."
        }
    ];

    const stats = [
        { val: "10k+", label: "Active Members" },
        { val: "500+", label: "Premium Gyms" },
        { val: "98%", label: "Satisfaction Rate" },
        { val: "24/7", label: "Support" }
    ];

    return (
        <div className="landing-container bg-white font-outfit">
            {/* Navigation */}
            <motion.nav
                style={{ backgroundColor: navBackground, boxShadow: navShadow }}
                className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-sm transition-all"
            >
                <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-primary w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Dumbbell color="white" size={24} />
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight text-slate-900">FitZone</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-slate-600 hover:text-primary font-medium transition-colors">Features</a>
                        <a href="#stats" className="text-slate-600 hover:text-primary font-medium transition-colors">Growth</a>
                        <a href="#about" className="text-slate-600 hover:text-primary font-medium transition-colors">About Us</a>
                        {user ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-primary text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                Go to Dashboard <ArrowRight size={18} />
                            </button>
                        ) : (
                            <div className="flex items-center gap-4">
                                <button onClick={() => navigate('/login')} className="text-slate-900 font-bold hover:text-primary">Login</button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-slate-800 transition-all"
                                >
                                    Start Free Trial
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-green-50 text-primary px-4 py-2 rounded-full text-sm font-bold mb-8 border border-green-100"
                    >
                        <Zap size={16} /> The #1 Gym Management Platform in 2024
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8"
                    >
                        Master Your Fitness <br />
                        <span className="text-primary italic">In The Digital Zone.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed"
                    >
                        Empowering gyms and athletes with real-time slot management,
                        AI-driven crowd tracking, and professional growth analytics.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-4"
                    >
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-primary text-white text-lg px-8 py-4 rounded-2xl font-extrabold shadow-xl shadow-primary/40 hover:translate-y-[-4px] active:translate-y-0 transition-all flex items-center gap-3"
                        >
                            Get Started for Free <ArrowRight size={22} />
                        </button>
                        <button className="bg-white text-slate-900 text-lg px-8 py-4 rounded-2xl font-bold border-2 border-slate-100 hover:bg-slate-50 transition-all">
                            View Live Demo
                        </button>
                    </motion.div>

                    {/* Dashboard Preview Graphic */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, type: 'spring', damping: 15 }}
                        className="mt-20 relative w-full max-w-5xl"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full -z-10 opacity-30"></div>
                        <img
                            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200"
                            alt="Fitness"
                            className="rounded-3xl shadow-2xl border-[8px] border-white object-cover aspect-[21/9] w-full"
                        />

                        {/* Float cards */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -top-10 -left-10 bg-white p-6 rounded-2xl shadow-xl hidden md:block"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-green-100 p-3 rounded-xl text-primary"><TrendingUp size={24} /></div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold">LIVE CROWD</p>
                                    <p className="text-xl font-bold text-slate-900">12% Busy</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Designed For Performance</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Everything you need to manage your gym or track your fitness journey in one sleek interface.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50"
                            >
                                <div className="mb-6">{f.icon}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{f.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="py-24 px-6 bg-primary overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {stats.map((s, i) => (
                            <div key={i} className="text-center text-white">
                                <p className="text-5xl md:text-6xl font-black mb-2">{s.val}</p>
                                <p className="text-white/80 font-bold uppercase tracking-wider text-sm">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800"
                            alt="About FitZone"
                            className="rounded-3xl shadow-xl w-full"
                        />
                    </div>
                    <div className="lg:w-1/2">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8">Empowering the Future of Fitness</h2>
                        <p className="text-slate-500 text-lg leading-relaxed mb-8">
                            FitZone was built on the belief that fitness should be seamless.
                            No more waiting for equipment, no more manual scheduling. We bring
                            the power of AI and real-time data to your fingertips.
                        </p>
                        <ul className="space-y-4 mb-10">
                            {[
                                "Automated Slot Scheduling",
                                "Admin & Member Portals",
                                "AI-Powered Crowd Forecasting",
                                "Comprehensive Member Analytics"
                            ].map((item, id) => (
                                <li key={id} className="flex items-center gap-3 font-bold text-slate-700">
                                    <div className="bg-primary/20 text-primary p-1 rounded-full"><Zap size={14} /></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="text-primary font-black flex items-center gap-2 text-lg hover:underline decoration-4">
                            Learn more about our mission <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 pt-20 pb-10 px-6 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center font-bold">F</div>
                                <span className="text-xl font-bold">FitZone</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                Redefining the gym experience through smart technology and data-driven insights.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-primary transition-colors"><Instagram size={18} /></a>
                                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-primary transition-colors"><Twitter size={18} /></a>
                                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-primary transition-colors"><Facebook size={18} /></a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6 text-primary">Platform</h4>
                            <ul className="space-y-4 text-slate-400 text-sm">
                                <li><a href="#" className="hover:text-white">Slot Booking</a></li>
                                <li><a href="#" className="hover:text-white">Admin Dashboard</a></li>
                                <li><a href="#" className="hover:text-white">Gym Finder</a></li>
                                <li><a href="#" className="hover:text-white">Workouts</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6 text-primary">Company</h4>
                            <ul className="space-y-4 text-slate-400 text-sm">
                                <li><a href="#" className="hover:text-white">About Us</a></li>
                                <li><a href="#" className="hover:text-white">Careers</a></li>
                                <li><a href="#" className="hover:text-white">Contact</a></li>
                                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6 text-primary">Contact Us</h4>
                            <div className="space-y-4 text-slate-400 text-sm">
                                <div className="flex items-center gap-3"><Mail size={16} /> support@fitzone.com</div>
                                <div className="flex items-center gap-3"><Phone size={16} /> +1 (800) FIT-ZONE</div>
                                <div className="mt-8">
                                    <p className="font-bold text-white mb-2">Subscribe to News</p>
                                    <div className="flex bg-slate-800 rounded-xl overflow-hidden p-1">
                                        <input type="email" placeholder="Email addr" className="bg-transparent border-none px-4 py-2 text-sm outline-none flex-1" />
                                        <button className="bg-primary px-4 py-2 rounded-lg font-bold">Join</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-10 text-center text-slate-500 text-sm">
                        <p>© 2024 FitZone Systems Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                .font-outfit { font-family: 'Outfit', sans-serif; }
                .text-primary { color: #1BB85B; }
                .bg-primary { background-color: #1BB85B; }
                .shadow-primary\/20 { shadow-color: rgba(27, 184, 91, 0.2); }
                .shadow-primary\/30 { shadow-color: rgba(27, 184, 91, 0.3); }
                .shadow-primary\/40 { shadow-color: rgba(27, 184, 91, 0.4); }
                
                @media (max-width: 640px) {
                    .text-5xl { font-size: 3rem; }
                }
            `}</style>
        </div >
    );
};

export default WebLanding;
