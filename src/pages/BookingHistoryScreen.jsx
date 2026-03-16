import React, { useState, useEffect } from 'react';
import {
    Clock,
    CircleX,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Calendar as CalendarIcon,
    CalendarX,
    Home as HomeIcon,
    Calendar,
    Dumbbell,
    Activity,
    History as HistoryIcon,
    User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

import WebLayout from '../components/WebLayout';

const BookingHistoryScreen = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);

    const fetchHistory = async () => {
        if (!user?.user_id) return;
        setLoading(true);
        try {
            const response = await api.get(`/history/${user.user_id}`);
            setHistory(response.data);
        } catch (err) {
            console.error('Error fetching history:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user]);

    const handleCancelClick = (booking) => {
        setBookingToCancel(booking);
        setShowCancelDialog(true);
    };

    const confirmCancel = async () => {
        try {
            await api.post('/cancel-booking', { user_id: user.user_id, booking_id: bookingToCancel.booking_id });
            setHistory(prev => prev.map(b => b.booking_id === bookingToCancel.booking_id ? { ...b, status: 'cancelled', cancel_allowed: false } : b));
            setShowCancelDialog(false);
        } catch (err) {
            alert(err.response?.data?.message || 'Cancellation failed');
        }
    };

    return (
        <WebLayout>
            <div className="main-viewport">
                {/* Header */}
                <header className="app-header-premium">
                    <div className="header-content">
                        <span className="header-tag">Activity Log</span>
                        <h1 className="header-title-premium">Booking History</h1>
                        <p className="header-subtitle-premium">Your past and upcoming sessions</p>
                    </div>
                </header>

                <main className="content-area-premium">
                    <div className="spacer-24"></div>

                    {loading ? (
                        <div className="flex-center py-40">
                            <div className="loading-spinner-modern"></div>
                            <span className="ml-12 font-600 text-gray">Refining results...</span>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="empty-state-card section-px">
                            <div className="empty-state-inner">
                                <CalendarX size={48} className="text-muted-icon" />
                                <h3 className="empty-title">No Activity Yet</h3>
                                <p className="empty-desc">When you book sessions, they'll appear here for your track record.</p>
                                <button className="btn btn-primary mt-20" onClick={() => navigate('/book-slot')}>
                                    Start Booking
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="section-px">
                            <div className="history-list-grid">
                                {history.map((booking, i) => (
                                    <HistoryCard
                                        key={i}
                                        booking={booking}
                                        onCancel={() => handleCancelClick(booking)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="spacer-40"></div>
                </main>
            </div>

            {/* Cancel Dialog */}
            {showCancelDialog && (
                <div className="dialog-overlay-premium">
                    <div className="dialog-card-premium animate-pop">
                        <div className="dialog-icon-danger">
                            <CircleX size={32} />
                        </div>
                        <h3 className="dialog-title">Cancel Session?</h3>
                        <p className="dialog-desc">Are you sure you want to cancel this booking? This action cannot be undone.</p>
                        <div className="dialog-actions-premium">
                            <button onClick={() => setShowCancelDialog(false)} className="dialog-btn secondary">Keep It</button>
                            <button onClick={confirmCancel} className="dialog-btn danger">Confirm Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation (Mobile Only) */}
            <nav className="bottom-navbar-premium">
                <BottomNavItem icon={<HomeIcon size={24} />} label="Home" onClick={() => navigate('/dashboard')} />
                <BottomNavItem icon={<Calendar size={24} />} label="Book" onClick={() => navigate('/book-slot')} />
                <BottomNavItem icon={<Dumbbell size={24} />} label="Workout" onClick={() => navigate('/workout-guide')} />
                <BottomNavItem icon={<Activity size={24} />} label="BMI" onClick={() => navigate('/bmi')} />
                <BottomNavItem icon={<HistoryIcon size={24} />} label="History" active />
                <BottomNavItem icon={<User size={24} />} label="Profile" onClick={() => navigate('/profile')} />
            </nav>


            <style jsx>{`
        .main-viewport { flex: 1; overflow-y: auto; padding-bottom: 90px; background-color: #F9FAFB; }
        
        @media (min-width: 1024px) {
            .main-viewport { padding-bottom: 40px; background-color: transparent; }
            .content-area-premium { max-width: 1200px; margin: 0 auto; width: 100%; padding: 0 48px; }
            .app-header-premium { padding: 60px 48px 40px !important; border-bottom-left-radius: 40px !important; border-bottom-right-radius: 40px !important; margin-bottom: 24px; }
            .history-list-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
            .mobile-only { display: none !important; }
            .section-px { padding: 0 !important; }
        }

        .header-tag { font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1.5px; }
        
        .section-px { padding: 0 20px; }
        .history-list-grid { display: flex; flex-direction: column; gap: 16px; }

        /* Empty State */
        .empty-state-card { text-align: center; }
        .empty-state-inner { background: white; border-radius: 24px; padding: 48px 24px; border: 1.5px dashed #E5E7EB; }
        .text-muted-icon { color: #D1D5DB; margin-bottom: 16px; }
        .empty-title { font-size: 18px; font-weight: 800; color: #111; margin: 0; }
        .empty-desc { font-size: 14px; color: #6B7280; margin: 8px 0 0; line-height: 1.5; }

        /* Dialogs */
        .dialog-overlay-premium { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 24px; backdrop-filter: blur(4px); }
        .dialog-card-premium { background: white; border-radius: 28px; padding: 32px; width: 100%; max-width: 340px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .dialog-icon-danger { width: 64px; height: 64px; background: #FEF2F2; color: #EF4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .dialog-title { font-size: 20px; font-weight: 800; color: #111; margin: 0; }
        .dialog-desc { font-size: 14px; color: #6B7280; margin: 12px 0 24px; line-height: 1.5; }
        .dialog-actions-premium { display: flex; flex-direction: column; gap: 12px; }
        .dialog-btn { height: 48px; border-radius: 12px; border: none; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .dialog-btn.danger { background: #EF4444; color: white; }
        .dialog-btn.secondary { background: #F3F4F6; color: #4B5563; }
        
        .animate-pop { animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes pop { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }

        .loading-spinner-modern { width: 30px; height: 30px; border: 3px solid #F3F4F6; border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </WebLayout>
    );
};

const HistoryCard = ({ booking, onCancel }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="card history-card" onClick={() => setExpanded(!expanded)}>
            <div className="card-top-row">
                <div className="card-info">
                    <h3 className="booking-date">{booking.date}</h3>
                    <div className="booking-meta">
                        <Clock size={16} color="gray" />
                        <span>{booking.slot} ({booking.duration_minutes} min)</span>
                    </div>
                </div>
                <div className={`status-pill ${booking.status}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
            </div>

            <div className="divider"></div>

            <div className="workout-summary">
                <span className="label">Workout Focus:</span>
                <span className="value">{booking.summary}</span>
            </div>

            {expanded && (
                <div className="detailed-breakdown animate-in">
                    <div className="divider"></div>
                    <span className="label">Detailed Breakdown:</span>
                    {booking.details.split(' | ').map((segment, i) => {
                        const parts = segment.split(' : ');
                        return (
                            <p key={i} className="detail-item">
                                {parts.length === 2 ? (
                                    <>
                                        <strong className="cat-text">{parts[0]}</strong> : {parts[1]}
                                    </>
                                ) : segment}
                            </p>
                        );
                    })}
                </div>
            )}

            {!expanded && <p className="tap-text">Tap to view full details</p>}

            {booking.cancel_allowed && (
                <button
                    className="cancel-btn"
                    onClick={(e) => { e.stopPropagation(); onCancel(); }}
                >
                    <CircleX size={18} /> Cancel Booking
                </button>
            )}

            <style jsx>{`
        .history-card { background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); cursor: pointer; }
        .card-top-row { display: flex; justify-content: space-between; align-items: center; }
        .booking-date { font-size: 18px; font-weight: 700; margin: 0; }
        .booking-meta { display: flex; align-items: center; gap: 4px; color: gray; font-size: 14px; margin-top: 4px; }
        
        .status-pill { padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; }
        .status-pill.active { background: #E8F5E9; color: #2E7D32; }
        .status-pill.cancelled { background: #FFEBEE; color: #C62828; }
        
        .divider { height: 1px; background: #EEEEEE; margin: 12px 0; }
        
        .workout-summary { display: flex; flex-direction: column; }
        .label { font-size: 12px; font-weight: 600; color: gray; margin-bottom: 2px; }
        .value { font-size: 15px; font-weight: 500; color: #333333; }
        
        .detailed-breakdown { padding-top: 4px; }
        .detail-item { font-size: 14px; margin: 4px 0; }
        .cat-text { color: #2E7D32; }
        
        .tap-text { font-size: 11px; color: var(--primary); margin: 8px 0 0; }
        
        .cancel-btn { width: 100%; border: 1px solid #C62828; background: none; color: #C62828; padding: 10px; border-radius: 8px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 16px; cursor: pointer; }
        
        .animate-in { animation: expand 0.3s ease-out; }
        @keyframes expand { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 500px; } }
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

export default BookingHistoryScreen;
