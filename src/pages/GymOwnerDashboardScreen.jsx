import React, { useState, useEffect } from 'react';
import {
    Users,
    Calendar,
    TrendingUp,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    LogOut,
    Settings,
    Grid,
    Upload,
    Save,
    Ban,
    Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

import WebLayout from '../components/WebLayout';

const SlotInsightModal = ({ slot, onClose, insightData, loading }) => {
    if (!slot) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose}>
                <motion.div 
                    className="insight-modal" 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="modal-header-modern">
                        <div className="header-icon-box-green">
                            <Zap size={22} color="white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="modal-title-admin">Insights: {slot}</h3>
                            <p className="modal-subtitle-admin">AI-Powered Slot Analytics</p>
                        </div>
                        <button className="close-modal-btn" onClick={onClose}>&times;</button>
                    </div>

                    <div className="modal-body-premium">
                        {loading ? (
                            <div className="flex-center py-40">
                                <div className="spinner-green"></div>
                            </div>
                        ) : insightData ? (
                            <>
                                <div className="insight-metrics-grid">
                                    <div className="insight-metric-item">
                                        <Users size={18} className="text-primary" />
                                        <span className="ins-val">{insightData.total_bookings || 0}</span>
                                        <span className="ins-lbl">Actual</span>
                                    </div>
                                    <div className="insight-metric-item highlighted">
                                        <Zap size={18} className="text-orange" />
                                        <span className="ins-val text-orange">{insightData.ai_prediction || 0}</span>
                                        <span className="ins-lbl">AI Predict</span>
                                    </div>
                                </div>

                                <div className="spacer-24"></div>

                                {insightData.separate_bookings?.length > 0 && (
                                    <div className="insight-sub-section">
                                        <h4 className="ins-sub-title">Individual Workouts</h4>
                                        <div className="ins-list">
                                            {insightData.separate_bookings.map((b, i) => (
                                                <div key={i} className="ins-list-row">
                                                    <span>{b.workout}</span>
                                                    <span className="font-800">{b.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="spacer-16"></div>

                                {insightData.combo_bookings?.length > 0 && (
                                    <div className="insight-sub-section">
                                        <h4 className="ins-sub-title">Combo Bookings</h4>
                                        <div className="ins-list">
                                            {insightData.combo_bookings.map((b, i) => (
                                                <div key={i} className="ins-list-row">
                                                    <span>{b.combo}</span>
                                                    <span className="font-800">{b.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="spacer-20"></div>

                                <div className={`trend-alert-box ${insightData.trend_message?.includes('increase') ? 'alert-orange' : 'alert-green'}`}>
                                    {insightData.trend_message?.includes('increase') ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                    <p className="ins-trend-text">{insightData.trend_message}</p>
                                </div>
                            </>
                        ) : <p className="text-center py-20 text-gray-400">No insight data available.</p>}
                    </div>
                </motion.div>
            </div>
            <style jsx>{`
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
                .insight-modal { width: 100%; max-width: 400px; background: white; border-radius: 32px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
                .modal-header-modern { display: flex; align-items: center; gap: 16px; padding: 24px; border-bottom: 1px solid #F3F4F6; }
                .header-icon-box-green { width: 44px; height: 44px; background: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .modal-title-admin { font-size: 18px; font-weight: 800; color: #111; margin: 0; }
                .modal-subtitle-admin { font-size: 12px; font-weight: 600; color: #888; margin: 0; }
                .close-modal-btn { background: #F3F4F6; border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 20px; color: #666; cursor: pointer; }
                
                .modal-body-premium { padding: 24px; }
                .insight-metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .insight-metric-item { display: flex; flex-direction: column; align-items: center; padding: 16px; background: #F9FAFB; border-radius: 20px; border: 1px solid #F1F5F9; }
                .insight-metric-item.highlighted { background: #FFF7ED; border-color: #FED7AA; }
                .ins-val { font-size: 24px; font-weight: 800; color: var(--primary); }
                .ins-lbl { font-size: 11px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; margin-top: 4px; }
                
                .ins-sub-title { font-size: 13px; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
                .ins-list { background: #F8FAFC; border-radius: 16px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
                .ins-list-row { display: flex; justify-content: space-between; font-size: 14px; color: #334155; }
                
                .trend-alert-box { display: flex; align-items: center; gap: 12px; padding: 16px; border-radius: 16px; }
                .alert-orange { background: #FFF7ED; color: #C2410C; border: 1px solid #FED7AA; }
                .alert-green { background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; }
                .ins-trend-text { font-size: 13px; font-weight: 600; line-height: 1.4; }
                
                .spinner-green { width: 30px; height: 30px; border: 3px solid #E8F5E9; border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .text-orange { color: #F97316; }
            `}</style>
        </AnimatePresence>
    );
};

const GymOwnerDashboardScreen = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState("analytics");
    const [dashboardData, setDashboardData] = useState(null);
    const [members, setMembers] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [insightData, setInsightData] = useState(null);
    const [insightLoading, setInsightLoading] = useState(false);

    // Form states
    const [memberName, setMemberName] = useState("");
    const [memberId, setMemberId] = useState("");

    const fetchDashboard = async () => {
        if (!user?.user_id) return;
        try {
            const response = await api.post('/gym-dashboard', { admin_user_id: user.user_id });
            setDashboardData(response.data);
            if (response.data.gym_id) {
                fetchSlots(response.data.gym_id);
            }
        } catch (err) {
            console.error('Error fetching dashboard:', err);
        }
    };

    const fetchMembers = async () => {
        if (!user?.user_id) return;
        try {
            const response = await api.post('/get-members', { admin_user_id: user.user_id });
            setMembers(response.data.members || []);
        } catch (err) {
            console.error('Error fetching members:', err);
        }
    };

    const fetchSlots = async (gymId) => {
        const today = new Date().toISOString().split('T')[0];
        try {
            const response = await api.post('/get-slots', { gym_id: gymId, date: today });
            setSlots(response.data);
        } catch (err) {
            console.error('Error fetching slots:', err);
        }
    };

    const fetchInsights = async (slotTime) => {
        if (!dashboardData?.gym_id) return;
        setSelectedSlot(slotTime);
        setInsightLoading(true);
        const today = new Date().toISOString().split('T')[0];
        try {
            const response = await api.post('/get-slot-insights', {
                gym_id: dashboardData.gym_id,
                date: today,
                time_slot: slotTime
            });
            setInsightData(response.data);
        } catch (err) {
            console.error('Error fetching insights:', err);
        } finally {
            setInsightLoading(false);
        }
    };


    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchDashboard(), fetchMembers()]);
            setLoading(false);
        };
        init();
    }, [user]);

    if (loading) return <div className="flex-center h-screen">Loading Admin Panel...</div>;

    const data = dashboardData || {
        total_members: 0,
        todays_bookings: 0,
        total_bookings: 0,
        time_slots: 0,
        admin_name: "Owner",
        gym_name: "Refreshing...",
        city: ""
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!memberName || !memberId) return;
        try {
            await api.post('/add-member', {
                admin_user_id: user.user_id,
                member_id: memberId,
                name: memberName
            });
            setMemberName("");
            setMemberId("");
            fetchMembers();
            fetchDashboard();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add member");
        }
    };

    return (
        <WebLayout>
            <div className="main-viewport">
                <header className="admin-header-premium">
                    <div className="header-row">
                        <div className="header-title-col">
                            <h1 className="owner-name-h1">Hello, {data.admin_name}</h1>
                            <p className="header-subtitle-white">{data.gym_name}, {data.city}</p>
                        </div>
                        <button onClick={() => { logout(); navigate('/login'); }} className="logout-btn-premium">
                            <LogOut size={20} color="white" />
                        </button>
                    </div>
                </header>


                <main className="content-area-premium">
                    <div className="section-px pt-24">
                        <div className="metrics-grid-modern">
                            <MetricCard label="Members" val={data.total_members} icon={<Users size={20} />} accent="#1BB85B" />
                            <MetricCard label="Today" val={data.todays_bookings} icon={<Calendar size={20} />} accent="#3B82F6" />
                            <MetricCard label="Total" val={data.total_bookings} icon={<TrendingUp size={20} />} accent="#8B5CF6" />
                            <MetricCard label="Slots" val={data.time_slots} icon={<Clock size={20} />} accent="#F59E0B" />
                        </div>
                    </div>

                    <div className="spacer-24"></div>

                    <div className="section-px">
                        <div className="tab-control-premium">
                            <TabIcon icon={<TrendingUp size={20} />} active={selectedTab === "analytics"} onClick={() => setSelectedTab("analytics")} label="Data" />
                            <TabIcon icon={<Users size={20} />} active={selectedTab === "members"} onClick={() => setSelectedTab("members")} label="People" />
                            <TabIcon icon={<Settings size={20} />} active={selectedTab === "settings"} onClick={() => setSelectedTab("settings")} label="Setup" />
                            <TabIcon icon={<Grid size={20} />} active={selectedTab === "slots"} onClick={() => setSelectedTab("slots")} label="Slots" />
                            <TabIcon icon={<Upload size={20} />} active={selectedTab === "upload"} onClick={() => setSelectedTab("upload")} label="Sync" />
                        </div>
                    </div>

                    <div className="spacer-24"></div>

                    <div className="section-px">
                        {selectedTab === "analytics" && <AnalyticsContent data={data} onSlotClick={fetchInsights} />}
                        {selectedTab === "members" && (
                            <div className="animate-in">
                                <AddMemberForm name={memberName} setName={setMemberName} id={memberId} setId={setMemberId} onSubmit={handleAddMember} />
                                <div className="spacer-20"></div>
                                <MembersTable members={members} />
                            </div>
                        )}
                        {selectedTab === "settings" && <SettingsContent data={data} navigate={navigate} />}
                        {selectedTab === "slots" && <SlotsContent data={data} slots={slots} onSlotClick={fetchInsights} />}
                        {selectedTab === "upload" && <UploadContent data={data} navigate={navigate} />}
                    </div>

                    <div className="spacer-32"></div>

                    <div className="login-footer">
                        <p>powered by SIMATS ENGINEERING</p>
                    </div>
                </main>

                <SlotInsightModal 
                    slot={selectedSlot} 
                    onClose={() => setSelectedSlot(null)} 
                    insightData={insightData} 
                    loading={insightLoading} 
                />
            </div>

            <style jsx>{`
        .main-viewport { flex: 1; overflow-y: auto; background-color: #F9FAFB; }
        
        @media (min-width: 1024px) {
            .main-viewport { background-color: transparent; }
            .content-area-premium { max-width: 1200px; margin: 0 auto; width: 100%; padding: 0 48px; }
            .admin-header-premium { padding: 60px 48px 40px !important; border-bottom-left-radius: 40px !important; border-bottom-right-radius: 40px !important; margin-bottom: 24px; }
            .metrics-grid-modern { grid-template-columns: repeat(4, 1fr) !important; gap: 24px !important; }
            .mobile-only { display: none !important; }
            .section-px { padding: 0 !important; }
        }

        .admin-header-premium {
          background-color: var(--primary);
          padding: 40px 24px 30px 24px;
          border-bottom: none;
          box-shadow: 0 10px 30px rgba(27, 184, 91, 0.15);
        }

        .header-row { display: flex; justify-content: space-between; align-items: center; }
        .owner-name-h1 { font-size: 24px; font-weight: 800; color: white; margin: 0; letter-spacing: -0.5px; }
        .header-subtitle-white { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.8); margin-top: 2px; }
        
        .logout-btn-premium { width: 44px; height: 44px; background: rgba(255,255,255,0.2); border: none; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        .logout-btn-premium:hover { background: rgba(255,255,255,0.3); }

        .content-area-premium { padding: 0; }
        .section-px { padding: 0 20px; }
        
        .login-footer {
          margin-top: auto;
          padding: 24px 0;
          text-align: center;
          color: #888;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .clickable { cursor: pointer; transition: transform 0.2s; }
        .clickable:hover { transform: translateY(-3px); }
        .clickable:active { transform: scale(0.95); }


        .tab-control-premium {
          display: flex; background: #F3F4F6; padding: 4px; border-radius: 16px;
          justify-content: space-between;
        }

        .pt-24 { padding-top: 24px; }
      `}</style>
        </WebLayout>
    );
};

const MetricCard = ({ label, val, icon, accent }) => (
    <div className="metric-card-premium">
        <div className="metric-icon-sphere" style={{ color: accent, background: `${accent}15` }}>
            {icon}
        </div>
        <div className="spacer-12"></div>
        <div className="metric-info">
            <span className="metric-label">{label}</span>
            <span className="metric-value">{val}</span>
        </div>
        <style jsx>{`
      .metric-card-premium { background: white; padding: 20px; border-radius: 20px; border: 1px solid #F3F4F6; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
      .metric-icon-sphere { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
      .metric-label { font-size: 13px; font-weight: 600; color: #9CA3AF; display: block; }
      .metric-value { font-size: 24px; font-weight: 800; color: #111827; display: block; }
    `}</style>
    </div>
);

const TabIcon = ({ icon, active, onClick, label }) => (
    <div className={`tab-pill ${active ? 'active' : ''}`} onClick={onClick}>
        {icon}
        {active && <span className="tab-label-text">{label}</span>}
        <style jsx>{`
      .tab-pill { padding: 8px 16px; border-radius: 12px; display: flex; align-items: center; gap: 8px; cursor: pointer; color: #6B7280; transition: all 0.2s; }
      .tab-pill.active { background: white; color: var(--primary); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
      .tab-label-text { font-size: 13px; font-weight: 700; }
    `}</style>
    </div>
);

const AnalyticsContent = ({ data, onSlotClick }) => (
    <div className="animate-in">
        <div className="section-card">
            <h3 className="section-title">Peak Hours Analysis</h3>
            <p className="text-11 text-primary font-700 mb-12">Tap a bar to see AI insights</p>
            {data.peak_hours?.length > 0 ? (
                <div className="chart-container">
                    <div className="bars-row">
                        {data.peak_hours.map((peak, i) => (
                            <div
                                key={i}
                                className="chart-bar clickable"
                                style={{ height: `${peak.weight * 100}%` }}
                                title={peak.time_slot}
                                onClick={() => onSlotClick(peak.time_slot)}
                            ></div>
                        ))}
                    </div>
                    <div className="labels-row">
                        {data.peak_hours.map((peak, i) => (
                            <span key={i} className="chart-label">{peak.time_slot.split(':')[0]}h</span>
                        ))}
                    </div>
                </div>
            ) : <p>No peak data available.</p>}
        </div>

        <div className="spacer-16"></div>

        <div className="section-card">
            <h3 className="section-title">Booking Trends</h3>
            <div className="trend-row-3">
                <TrendItem label="Weekly" val={data.weekly_growth} up={data.weekly_growth?.startsWith('+')} />
                <TrendItem label="Monthly" val={data.monthly_growth} up={data.monthly_growth?.startsWith('+')} />
                <TrendItem label="Peak Slot" val={data.peak_time} info />
            </div>
        </div>

        <div className="spacer-16"></div>

        <div className="section-card">
            <h3 className="section-title">Popular Workouts</h3>
            <div className="work-list">
                {data.popular_workouts?.map((w, i) => (
                    <div key={i} className="work-item">
                        <span className="work-name-s">{w.workout}</span>
                        <div className="progress-bg"><div className="progress-fill" style={{ width: w.percentage }}></div></div>
                        <span className="perc-text">{w.percentage}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const TrendItem = ({ label, val, up, info }) => (
    <div className="trend-item-card">
        <span className="trend-label">{label}</span>
        <div className="trend-val-row">
            {info ? <Clock size={14} color="gray" /> : up ? <ArrowUpRight size={14} color="green" /> : <ArrowDownRight size={14} color="red" />}
            <span className="trend-val" style={{ color: info ? 'black' : up ? 'green' : 'red' }}>{val}</span>
        </div>
    </div>
);

const AddMemberForm = ({ name, setName, id, setId, onSubmit }) => (
    <form className="section-card" onSubmit={onSubmit}>
        <h3 className="section-title">Add New Member</h3>
        <input type="text" placeholder="Member Name" className="custom-input mb-12" value={name} onChange={e => setName(e.target.value)} />
        <input type="text" placeholder="Member ID (e.g. M001)" className="custom-input mb-16" value={id} onChange={e => setId(e.target.value)} />
        <button type="submit" className="btn btn-primary w-full h-48">Add Member</button>
    </form>
);

const MembersTable = ({ members }) => (
    <div className="section-card-white shadow-sm overflow-hidden">
        <div className="p-20 border-b">
            <h3 className="section-title">Member List ({members.length})</h3>
        </div>
        <div className="table-container-modern">
            {members.length > 0 ? members.map((m, i) => (
                <div key={i} className="member-row-premium">
                    <div className="m-avatar-premium" style={{ background: `hsl(${i * 45}, 70%, 90%)`, color: `hsl(${i * 45}, 70%, 40%)` }}>
                        {m.name?.charAt(0)}
                    </div>
                    <div className="m-info">
                        <span className="m-name">{m.name}</span>
                        <span className="m-id-pill">{m.member_id}</span>
                    </div>
                    <div className="m-status-active">Active</div>
                </div>
            )) : <p className="p-24 text-center text-gray-500">No members found.</p>}
        </div>
        <style jsx>{`
            .section-card-white { background: white; border-radius: 20px; border: 1px solid #F3F4F6; }
            .border-b { border-bottom: 1px solid #F3F4F6; }
            .p-20 { padding: 20px; }
            .member-row-premium { display: flex; align-items: center; padding: 16px 20px; border-bottom: 1px solid #F9FAFB; transition: background 0.2s; }
            .member-row-premium:hover { background: #F9FAFB; }
            .m-avatar-premium { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; margin-right: 16px; }
            .m-info { flex: 1; display: flex; flex-direction: column; }
            .m-name { font-size: 15px; font-weight: 700; color: #111827; }
            .m-id-pill { font-size: 11px; background: #F3F4F6; color: #6B7280; padding: 2px 8px; border-radius: 6px; width: fit-content; margin-top: 2px; font-weight: 500; }
            .m-status-active { font-size: 12px; font-weight: 700; color: #10B981; background: #ECFDF5; padding: 4px 10px; border-radius: 20px; }
        `}</style>
    </div>
);

const SlotsContent = ({ data, slots, onSlotClick }) => (
    <div className="animate-in">
        <div className="section-card">
            <h3 className="section-title font-800">Gym Information</h3>
            <div className="spacer-20"></div>
            <div className="info-field-admin">
                <span className="info-label-admin">Gym Name</span>
                <div className="info-value-box">{data.gym_name}</div>
            </div>
            <div className="spacer-16"></div>
            <div className="info-field-admin">
                <span className="info-label-admin">Gym ID</span>
                <div className="info-value-box">{data.gym_id}</div>
            </div>
            <div className="spacer-16"></div>
            <div className="info-field-admin">
                <span className="info-label-admin">Location (Address)</span>
                <div className="info-value-box">{data.location || 'N/A'}</div>
            </div>
            <div className="spacer-16"></div>
            <div className="info-field-admin">
                <span className="info-label-admin">City</span>
                <div className="info-value-box">{data.city || 'N/A'}</div>
            </div>
            <div className="spacer-16"></div>
            <div className="info-field-admin">
                <span className="info-label-admin">Contact Info (Phone/Email)</span>
                <div className="info-value-box">{data.phone || 'N/A'} | {data.email || 'N/A'}</div>
            </div>
            <div className="spacer-16"></div>
            <div className="info-field-admin">
                <span className="info-label-admin">Description</span>
                <div className="info-value-box" style={{ fontSize: '13px', lineHeight: '1.4' }}>{data.description || 'No description provided.'}</div>
            </div>
            <div className="spacer-16"></div>
            <div className="info-field-admin">
                <span className="info-label-admin">Registration Status</span>
                <div className="status-badge-active">active</div>
            </div>
        </div>

        <div className="spacer-24"></div>

        <div className="section-card">
            <h3 className="section-title font-800">Today's Slots & Insights</h3>
            <p className="text-12 text-gray-500 mb-20">Tap a slot to see detailed booking breakdown and AI predictions.</p>
            <div className="slots-flow">
                {slots.map((s, i) => (
                    <div 
                        key={i} 
                        className="slot-chip-admin clickable" 
                        onClick={() => onSlotClick(s.slot)}
                        style={{ 
                            borderColor: `${s.color === 'red' ? '#F44336' : s.color === 'yellow' ? '#FFC107' : '#4CAF50'}44`, 
                            background: s.color === 'green' ? '#E8F5E9' : s.color === 'yellow' ? '#FFF9C4' : '#FFEBEE' 
                        }}
                    >
                        <span className="slot-t" style={{ color: s.color === 'green' ? '#2E7D32' : s.color === 'yellow' ? '#FBC02D' : '#C62828' }}>{s.slot}</span>
                        <span className="slot-b" style={{ color: s.color === 'green' ? '#2E7D32' : s.color === 'yellow' ? '#FBC02D' : '#C62828' }}>Now: {s.booked}/{s.capacity}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="spacer-24"></div>

        <div className="section-card">
            <h3 className="section-title font-800">Available Equipment</h3>
            <div className="spacer-20"></div>
            <div className="equip-grid-admin">
                {['Treadmill', 'Cycling', 'Bench Press', 'Lat Pulldown', 'Leg Press', 'Dumbbells'].map((e, idx) => (
                    <div key={idx} className="equip-chip-admin">{e}</div>
                ))}
            </div>
        </div>

        <style jsx>{`
            .info-field-admin { display: flex; flex-direction: column; gap: 8px; }
            .info-label-admin { font-size: 13px; font-weight: 700; color: #94A3B8; }
            .info-value-box { background: #F8FAFC; border: 1.5px solid #F1F5F9; border-radius: 12px; padding: 14px 16px; font-size: 15px; font-weight: 600; color: #1E293B; }
            .status-badge-active { background: #ECFDF5; color: #10B981; padding: 6px 16px; border-radius: 8px; font-size: 13px; font-weight: 800; width: fit-content; }
            .equip-grid-admin { display: flex; flex-wrap: wrap; gap: 10px; }
            .equip-chip-admin { background: white; border: 1.5px solid #F1F5F9; border-radius: 12px; padding: 10px 18px; font-size: 14px; font-weight: 700; color: #64748B; }
            
            .slot-chip-admin {
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                padding: 12px 16px; border-radius: 16px; border: 1.5px solid transparent; min-width: 90px;
            }
            .slot-t { font-size: 15px; font-weight: 800; margin-bottom: 2px; }
            .slot-b { font-size: 11px; font-weight: 700; opacity: 0.8; }
            .slots-flow { display: flex; flex-wrap: wrap; gap: 12px; }
            .font-800 { font-weight: 800; }
        `}</style>
    </div>
);

const SettingsContent = ({ data, navigate }) => (
    <div className="animate-in">
        <div className="section-card">
            <h3 className="section-title font-800">Gym Information</h3>
            <p className="text-14 label-gray mb-16 px-4">Update your gym's name, location, and contact details.</p>
            <button className="btn btn-outline w-full rounded-xl" onClick={() => navigate('/setup-gym', { state: { gymId: data?.gym_id } })}><Settings size={18} /> Manage Information</button>
        </div>
        
        <div className="spacer-16"></div>
        
        <div className="section-card">
            <h3 className="section-title font-800">Gym Opening Hours</h3>
            <div className="spacer-12"></div>
            {data.sessions?.length > 0 ? (
                <div className="sessions-list-admin">
                    {data.sessions.map((s, idx) => (
                        <div key={idx} className={`session-info-badge ${s.session_name}`}>
                            <span className="sess-n">{s.session_name}:</span>
                            <span className="sess-t">{s.opening_time} - {s.closing_time}</span>
                        </div>
                    ))}
                </div>
            ) : <p className="text-13 text-gray-400">No hours configured.</p>}
            <button className="btn btn-primary w-full mt-20 h-48 rounded-xl" onClick={() => navigate('/configure-hours', { state: { gymId: data?.gym_id } })}><Save size={18} /> Update Hours</button>
        </div>

        <div className="spacer-16"></div>

        <div className="section-card">
            <h3 className="section-title font-800">Operational Overrides</h3>
            <div className="overrides-grid">
                <div className="override-box">
                    <span className="over-label">Public Holidays</span>
                    <span className="over-val">{data.public_holidays?.length || 0} days</span>
                </div>
                <div className="override-box">
                    <span className="over-label">Morning-Only</span>
                    <span className="over-val">{data.morning_only_days?.length || 0} days</span>
                </div>
            </div>
            <div className="spacer-16"></div>
            <div className="flex gap-12">
                <button className="btn btn-outline flex-1 text-red rounded-xl h-44" onClick={() => navigate('/set-capacity', { state: { gymId: data?.gym_id } })}><Zap size={18} /> Capacity</button>
                <button className="btn btn-outline flex-1 rounded-xl h-44"><Ban size={18} /> Add Holiday</button>
            </div>
        </div>

        <style jsx>{`
            .sessions-list-admin { display: flex; flex-direction: column; gap: 10px; }
            .session-info-badge { padding: 12px 16px; border-radius: 12px; display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; }
            .session-info-badge.morning { background: #FFF7ED; color: #C2410C; border: 1px solid #FFEDD5; }
            .session-info-badge.afternoon { background: #EFF6FF; color: #1D4ED8; border: 1px solid #DBEAFE; }
            .session-info-badge.evening { background: #F5F3FF; color: #6D28D9; border: 1px solid #EDE9FE; }
            .sess-n { text-transform: capitalize; }
            
            .overrides-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            .override-box { background: #F8FAFC; border: 1.5px solid #F1F5F9; border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 4px; }
            .over-label { font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; }
            .over-val { font-size: 16px; font-weight: 800; color: #1E293B; }
            .rounded-xl { border-radius: 14px !important; }
        `}</style>
    </div>
);


const UploadContent = ({ data, navigate }) => (
    <div className="animate-in">
        <div className="section-card text-center">
            <h3 className="section-title">Upload Past Data</h3>
            <div className="upload-dropzone" onClick={() => navigate('/upload-data', { state: { gymId: data?.gym_id } })}>
                <Upload size={32} color="#1BB85B" />
                <p className="mt-8">Tap to Upload Excel</p>
            </div>
            <div className="spacer-16"></div>
            <button className="btn btn-primary w-full" onClick={() => navigate('/upload-data', { state: { gymId: data?.gym_id } })}>Update Analytics</button>
        </div>
    </div>
);

export default GymOwnerDashboardScreen;
