import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    Clock,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Group,
    Merge,
    Award,
    Circle,
    Check,
    Home as HomeIcon,
    Calendar as CalendarIcon,
    Dumbbell,
    Activity,
    History,
    User
} from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

import WebLayout from '../components/WebLayout';

const BookSlotScreen = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [apiDate, setApiDate] = useState(new Date().toISOString().split('T')[0]);
    const [displayDate, setDisplayDate] = useState(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));

    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState("60");
    const [selectedWorkouts, setSelectedWorkouts] = useState([]);
    const [insights, setInsights] = useState(null);

    const [loadingSlots, setLoadingSlots] = useState(false);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const categories = [
        { name: "Cardio", subs: ["Treadmill", "Cycling", "Rowing", "Stair Climber", "Skipping"] },
        { name: "Chest", subs: ["Bench Press", "Pec Deck", "Incline Press"] },
        { name: "Shoulder", subs: ["Shoulder Press", "Lateral Raise", "Arnold Press"] },
        { name: "Triceps", subs: ["Pushdown", "Skull Crushers"] },
        { name: "Back", subs: ["Lat Pulldown", "Deadlift"] },
        { name: "Biceps", subs: ["Barbell Curl", "Hammer Curl"] },
        { name: "Legs", subs: ["Squats", "Leg Press"] },
        { name: "Functional Training", subs: ["Kettlebell Swings", "Battle Ropes", "TRX", "Box Jumps"] },
        { name: "Yoga", subs: ["Yoga Mat"] },
        { name: "HIIT", subs: ["HIIT Zone"] }
    ];

    const fetchSlots = async () => {
        if (!user?.gym_id) return;
        setLoadingSlots(true);
        try {
            const response = await api.post('/get-slots', { gym_id: user.gym_id, date: apiDate });
            setSlots(response.data);
            setSelectedSlot(null);
            setInsights(null);
        } catch (err) {
            console.error('Error fetching slots:', err);
        } finally {
            setLoadingSlots(false);
        }
    };

    const fetchInsights = async (slot) => {
        setLoadingInsights(true);
        try {
            const response = await api.post('/slot-insights', {
                gym_id: user.gym_id,
                date: apiDate,
                slot: slot.slot
            });
            setInsights(response.data);
        } catch (err) {
            console.error('Error fetching insights:', err);
        } finally {
            setLoadingInsights(false);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, [apiDate, user]);

    const handleDateChange = (e) => {
        const val = e.target.value;
        setApiDate(val);
        setDisplayDate(new Date(val).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        fetchInsights(slot);
    };

    const toggleWorkout = (sub) => {
        setSelectedWorkouts(prev =>
            prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
        );
    };

    const handleConfirm = async () => {
        if (!user?.user_id || !selectedSlot) return;
        setSubmitting(true);

        // Group workouts by category
        const workoutMap = {};
        selectedWorkouts.forEach(sub => {
            const cat = categories.find(c => c.subs.includes(sub))?.name || "Other";
            if (!workoutMap[cat]) workoutMap[cat] = [];
            workoutMap[cat].push(sub);
        });

        try {
            await api.post('/confirm-booking', {
                user_id: user.user_id,
                gym_id: user.gym_id,
                booking_date: apiDate,
                time_slot: selectedSlot.slot,
                workouts: workoutMap,
                duration_minutes: parseInt(selectedDuration)
            });
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Booking failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <WebLayout>
            <div className="main-viewport">
                {/* Header */}
                <header className="app-header-premium">
                    <div className="header-content-flex">
                        <button onClick={() => currentPage === 2 ? setCurrentPage(1) : navigate('/dashboard')} className="back-btn-modern">
                            <ArrowLeft size={22} color="white" />
                        </button>
                        <div className="header-text-main">
                            <h1 className="header-title-premium">{currentPage === 1 ? 'Select Slot' : 'Workout Details'}</h1>
                            <p className="header-subtitle-premium">{user?.gym_name || 'fitZone'} • Step {currentPage}/2</p>
                        </div>
                    </div>
                </header>

                <main className="content-area-premium">
                    <div className="spacer-24"></div>

                    {currentPage === 1 ? (
                        <div className="page-one animate-in">
                            <div className="booking-layout-web">
                                <div className="booking-main-col">
                                    {/* Date Selection */}
                                    <div className="section-px">
                                        <div className="card-premium">
                                            <div className="flex-items-center mb-16">
                                                <Calendar size={18} color="#1BB85B" />
                                                <h3 className="section-title-modern ml-12">Select Workout Date</h3>
                                            </div>
                                            <div className="date-picker-modern">
                                                <input type="date" value={apiDate} onChange={handleDateChange} className="native-date-input" />
                                                <div className="display-date-overlay">
                                                    <span className="big-date-text">{displayDate}</span>
                                                    <ChevronDown size={18} color="#888" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="spacer-24"></div>

                                    {/* Slot Selection */}
                                    <div className="section-px">
                                        <h3 className="section-label-tiny">AVAILABLE TIME SLOTS</h3>
                                        <div className="spacer-12"></div>
                                        <div className="slot-grid-modern">
                                            {loadingSlots ? (
                                                <div className="loading-shimmer-list">
                                                    {[1, 2, 3].map(i => <div key={i} className="shimmer-item"></div>)}
                                                </div>
                                            ) : slots.length > 0 ? (
                                                slots.map((slot, i) => (
                                                    <SlotItem
                                                        key={i}
                                                        data={slot}
                                                        isSelected={selectedSlot?.slot === slot.slot}
                                                        onSelect={() => handleSlotSelect(slot)}
                                                    />
                                                ))
                                            ) : (
                                                <div className="empty-slots-box">
                                                    <p className="empty-text">No slots found for this date.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="booking-side-col">
                                    {selectedSlot ? (
                                        <div className="animate-in sticky-insights">
                                            <SlotInsightsCard insights={insights} slotTime={selectedSlot.slot} loading={loadingInsights} />
                                            <div className="spacer-24"></div>
                                            <button
                                                className="btn btn-primary btn-xl w-full"
                                                onClick={() => setCurrentPage(2)}
                                            >
                                                Choose Activities <ArrowRight size={18} className="ml-8" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="select-slot-prompt">
                                            <div className="prompt-icon-box">
                                                <Clock size={32} color="#9CA3AF" />
                                            </div>
                                            <p className="prompt-text">Select a time slot to view live crowd insights and proceed.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="section-px mobile-only sticky-bottom-btn">
                                <button
                                    className="btn btn-primary btn-xl w-full"
                                    disabled={!selectedSlot}
                                    onClick={() => setCurrentPage(2)}
                                >
                                    Choose Activities <ArrowRight size={18} className="ml-8" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="page-two animate-in">
                            <div className="booking-layout-web">
                                <div className="booking-main-col">
                                    {/* Workout Types */}
                                    <div className="section-px">
                                        <div className="card-premium">
                                            <h3 className="section-title-modern mb-20">Select Workout Focus</h3>
                                            <div className="category-list-modern">
                                                {categories.map((cat, i) => (
                                                    <ExpandableCategory
                                                        key={i}
                                                        category={cat}
                                                        selected={selectedWorkouts}
                                                        onToggle={toggleWorkout}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="booking-side-col">
                                    <div className="sticky-insights">
                                        {/* Duration */}
                                        <div className="card-premium">
                                            <h3 className="section-title-modern mb-20">Session Duration</h3>
                                            <div className="duration-grid-modern">
                                                {["30", "60", "90", "120"].map(d => (
                                                    <button
                                                        key={d}
                                                        className={`dur-pill ${selectedDuration === d ? 'active' : ''}`}
                                                        onClick={() => setSelectedDuration(d)}
                                                    >
                                                        <span className="dur-val">{d}</span>
                                                        <span className="dur-min">min</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="spacer-24"></div>
                                        
                                        <div className="card-premium">
                                            <h3 className="section-title-modern mb-12">Summary</h3>
                                            <div className="summary-item">
                                                <span className="summary-label">Date:</span>
                                                <span className="summary-value">{displayDate}</span>
                                            </div>
                                            <div className="summary-item">
                                                <span className="summary-label">Time:</span>
                                                <span className="summary-value">{selectedSlot.slot}</span>
                                            </div>
                                            <div className="summary-item">
                                                <span className="summary-label">Focus:</span>
                                                <span className="summary-value">{selectedWorkouts.length} activities</span>
                                            </div>
                                        </div>

                                        <div className="spacer-24"></div>

                                        <button
                                            className="btn btn-primary btn-xl w-full"
                                            disabled={submitting || selectedWorkouts.length === 0}
                                            onClick={handleConfirm}
                                        >
                                            {submitting ? 'Processing...' : (
                                                <><Check size={20} className="mr-8" /> Confirm Booking</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="section-px mobile-only sticky-bottom-btn">
                                <button
                                    className="btn btn-primary btn-xl w-full"
                                    disabled={submitting || selectedWorkouts.length === 0}
                                    onClick={handleConfirm}
                                >
                                    {submitting ? 'Processing...' : (
                                        <><Check size={20} className="mr-8" /> Confirm Booking</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="spacer-40"></div>
                </main>
            </div>

            {/* Bottom Navigation (Mobile Only) */}
            <nav className="bottom-navbar-premium">
                <BottomNavItem icon={<HomeIcon size={24} />} label="Home" onClick={() => navigate('/dashboard')} />
                <BottomNavItem icon={<CalendarIcon size={24} />} label="Book" active />
                <BottomNavItem icon={<Dumbbell size={24} />} label="Workout" onClick={() => navigate('/workout-guide')} />
                <BottomNavItem icon={<Activity size={24} />} label="BMI" onClick={() => navigate('/bmi')} />
                <BottomNavItem icon={<History size={24} />} label="History" onClick={() => navigate('/history')} />
                <BottomNavItem icon={<User size={24} />} label="Profile" onClick={() => navigate('/profile')} />
            </nav>

            <style jsx>{`
        .main-viewport { flex: 1; overflow-y: auto; padding-bottom: 90px; background-color: #F9FAFB; }
        
        @media (min-width: 1024px) {
            .main-viewport { padding-bottom: 40px; background-color: transparent; }
            .content-area-premium { max-width: 1200px; margin: 0 auto; width: 100%; padding: 0 48px; }
            .app-header-premium { padding: 60px 48px 40px !important; border-bottom-left-radius: 40px !important; border-bottom-right-radius: 40px !important; margin-bottom: 24px; }
            .booking-layout-web { display: grid; grid-template-columns: 1fr 380px; gap: 32px; align-items: start; }
            .sticky-insights { position: sticky; top: 40px; }
            .mobile-only { display: none !important; }
            .section-px { padding: 0 !important; }
        }

        .header-content-flex { display: flex; align-items: center; gap: 16px; }
        .back-btn-modern { background: rgba(255,255,255,0.1); border: none; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .header-text-main { flex: 1; }

        .section-px { padding: 0 20px; }
        .section-title-modern { font-size: 18px; font-weight: 800; color: #111; margin: 0; }
        .section-label-tiny { font-size: 11px; font-weight: 800; color: #9CA3AF; letter-spacing: 1px; }

        .date-picker-modern { position: relative; border-radius: 16px; background: #F3F4F6; margin-top: 12px; }
        .native-date-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; z-index: 2; width: 100%; }
        .display-date-overlay { height: 56px; display: flex; justify-content: space-between; align-items: center; padding: 0 16px; pointer-events: none; }
        .big-date-text { font-size: 15px; font-weight: 700; color: #111; }

        .slot-grid-modern { display: grid; grid-template-columns: 1fr; gap: 12px; }
        
        @media (min-width: 768px) and (max-width: 1023px) {
            .slot-grid-modern { grid-template-columns: 1fr 1fr; }
        }

        .empty-slots-box { background: white; border: 1.5px dashed #E5E7EB; border-radius: 20px; padding: 32px; text-align: center; }

        .duration-grid-modern { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .dur-pill { 
          display: flex; flex-direction: column; align-items: center; justify-content: center; 
          height: 64px; background: #F3F4F6; border: 1.5px solid transparent; border-radius: 16px;
          cursor: pointer; transition: all 0.2s;
        }
        .dur-pill.active { background: white; border-color: var(--primary); color: var(--primary); box-shadow: 0 4px 12px rgba(27, 184, 91, 0.1); }
        .dur-val { font-size: 16px; font-weight: 800; }
        .dur-min { font-size: 10px; font-weight: 600; opacity: 0.7; }

        .summary-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F3F4F6; }
        .summary-label { font-size: 13px; color: #666; font-weight: 500; }
        .summary-value { font-size: 13px; color: #111; font-weight: 700; }

        .select-slot-prompt { padding: 48px 24px; background: white; border-radius: 24px; border: 2px dashed #E5E7EB; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .prompt-icon-box { width: 64px; height: 64px; background: #F8F9FA; border-radius: 20px; display: flex; align-items: center; justify-content: center; }
        .prompt-text { font-size: 14px; color: #9CA3AF; line-height: 1.6; max-width: 200px; font-weight: 500; }

        .btn-xl { height: 56px; border-radius: 16px; font-size: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; }

        .animate-in { animation: slideUp 0.4s ease-out; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .loading-shimmer-list { display: flex; flex-direction: column; gap: 12px; }
        .shimmer-item { height: 64px; background: #F3F4F6; border-radius: 16px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }

        .bottom-navbar-premium { 
          position: fixed; bottom: 0; left: 0; right: 0; height: 80px; background-color: rgba(255,255,255,0.95); 
          display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #F0F0F0; 
          backdrop-filter: blur(10px); z-index: 100;
          padding: 0 10px 10px 10px;
        }
      `}</style>
        </WebLayout>
    );
};


const SlotItem = ({ data, isSelected, onSelect }) => {
    const statusColor = data.color === 'red' ? '#F44336' : data.color === 'yellow' ? '#FFC107' : '#4CAF50';

    return (
        <div
            className={`slot-item ${isSelected ? 'selected' : ''}`}
            onClick={onSelect}
            style={{ borderColor: isSelected ? 'var(--primary)' : `${statusColor}44` }}
        >
            <div className="slot-left">
                <div className="status-dot" style={{ backgroundColor: statusColor }}></div>
                <span className="slot-time-text">{data.slot}</span>
            </div>
            {isSelected ? <CheckCircle size={20} color="#1BB85B" /> : <span className="slot-status-label" style={{ color: statusColor }}>{data.status}</span>}
            <style jsx>{`
        .slot-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 2px solid transparent; border-radius: 12px; cursor: pointer; background: white; transition: all 0.2s; }
        .slot-item.selected { background: #E8F5E9; }
        .slot-left { display: flex; align-items: center; gap: 12px; }
        .status-dot { width: 12px; height: 12px; border-radius: 50%; }
        .slot-time-text { font-size: 16px; font-weight: 700; }
        .slot-status-label { font-size: 12px; font-weight: 500; }
      `}</style>
        </div>
    );
};

const SlotInsightsCard = ({ insights, slotTime, loading }) => (
    <div className="section-card">
        <h3 className="section-title">Slot Insights ({slotTime})</h3>
        {loading ? <p>Loading insights...</p> : insights ? (
            <div className="insights-content">
                <div className="insight-row">
                    <div className="insight-item">
                        <Group size={20} color="#1BB85B" />
                        <span className="val">{insights.total_bookings}</span>
                        <span className="lab">Actual Bookings</span>
                    </div>
                    <div className="insight-item">
                        <Merge size={20} color="#1BB85B" />
                        <span className="val">{insights.combo_bookings.length > 0 ? insights.combo_bookings.reduce((a, b) => a + b.count, 0) : 0}</span>
                        <span className="lab">Combo</span>
                    </div>
                    <div className="insight-item">
                        <Award size={20} color={insights.ai_prediction > insights.total_bookings ? '#E65100' : '#1BB85B'} />
                        <span className="val" style={{ color: insights.ai_prediction > insights.total_bookings ? '#E65100' : '#1BB85B' }}>{insights.ai_prediction}</span>
                        <span className="lab">AI Prediction</span>
                    </div>
                </div>

                <div className="spacer-16"></div>
                <p className="trend-msg">{insights.trend_message}</p>
            </div>
        ) : null}
        <style jsx>{`
      .insight-row { display: flex; justify-content: space-between; text-align: center; }
      .insight-item { display: flex; flex-direction: column; align-items: center; }
      .insight-item .val { font-size: 16px; font-weight: 700; color: #1BB85B; margin: 4px 0; }
      .insight-item .lab { font-size: 10px; color: gray; }
      .trend-msg { font-size: 11px; color: gray; line-height: 1.5; }
    `}</style>
    </div>
);

const ExpandableCategory = ({ category, selected, onToggle }) => {
    const [expanded, setExpanded] = useState(false);
    const selectedCount = category.subs.filter(s => selected.includes(s)).length;

    return (
        <div className="category-item">
            <div className="category-header" onClick={() => setExpanded(!expanded)}>
                <span className="category-name">{category.name} {selectedCount > 0 && `(${selectedCount})`}</span>
                {expanded ? <ChevronUp size={20} color="gray" /> : <ChevronDown size={20} color="gray" />}
            </div>
            {expanded && (
                <div className="sub-list">
                    {category.subs.map((sub, i) => (
                        <div key={i} className="sub-item" onClick={() => onToggle(sub)}>
                            <div className={`checkbox ${selected.includes(sub) ? 'checked' : ''}`}>
                                {selected.includes(sub) && <Check size={14} color="white" />}
                            </div>
                            <span className="sub-name">{sub}</span>
                        </div>
                    ))}
                </div>
            )}
            <style jsx>{`
        .category-item { border-bottom: 1px solid #F0F0F0; }
        .category-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; cursor: pointer; }
        .category-name { font-size: 14px; font-weight: 500; }
        .sub-list { padding: 4px 0 12px 12px; }
        .sub-item { display: flex; align-items: center; gap: 12px; padding: 8px 0; cursor: pointer; }
        .checkbox { width: 20px; height: 20px; border: 2px solid #DDDDDD; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
        .checkbox.checked { background: var(--primary); border-color: var(--primary); }
        .sub-name { font-size: 13px; }
      `}</style>
        </div>
    );
};

const BottomNavItem = ({ icon, label, active, onClick }) => (
    <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
        {icon}
        <span className="nav-label">{label}</span>
        <style jsx>{`
      .nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; color: #AAAAAA; cursor: pointer; width: 50px; }
      .nav-item.active { color: var(--primary); font-weight: 700; }
      .nav-label { font-size: 10px; }
    `}</style>
    </div>
);

export default BookSlotScreen;
