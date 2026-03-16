import React, { useState } from 'react';
import {
    Calculator,
    Info,
    TrendingUp,
    Home as HomeIcon,
    Calendar,
    Dumbbell,
    Activity,
    History,
    User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import WebLayout from '../components/WebLayout';

const BMICalculatorScreen = () => {
    const navigate = useNavigate();
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [bmiResult, setBmiResult] = useState(null);

    const calculateBMI = () => {
        const h = parseFloat(height);
        const w = parseFloat(weight);
        if (h > 0 && w > 0) {
            const bmi = w / ((h / 100) * (h / 100));
            setBmiResult(bmi);
        }
    };

    const getCategory = (bmi) => {
        if (bmi < 18.5) return { label: "Underweight", color: "#1976D2", bg: "#E3F2FD", advice: "Focus on nutrient-dense foods and strength training to build healthy muscle mass." };
        if (bmi < 25) return { label: "Normal Weight", color: "#2E7D32", bg: "#E8F5E9", advice: "Great job! Maintain your current balanced diet and regular exercise routine." };
        if (bmi < 30) return { label: "Overweight", color: "#B8860B", bg: "#FFF9C4", advice: "Increase cardio exercises and focus on a balanced diet with portion control." };
        return { label: "Obese", color: "#C62828", bg: "#FFEBEE", advice: "Consult with a nutritionist for a tailored weight management plan and increase daily activity levels." };
    };

    return (
        <WebLayout>
            <div className="main-viewport">
                {/* Header */}
                <header className="app-header-premium">
                    <div className="header-content">
                        <span className="header-tag">Health Metrics</span>
                        <h1 className="header-title-premium">BMI Calculator</h1>
                        <p className="header-subtitle-premium">Track your Body Mass Index</p>
                    </div>
                </header>

                <main className="content-area-premium">
                    <div className="spacer-24"></div>

                    <div className="bmi-grid-web">
                        <div className="bmi-main-col">
                            {/* Calculator Card */}
                            <div className="section-px">
                                <div className="card-premium">
                                    <div className="flex-items-center mb-20">
                                        <Activity size={20} color="#1BB85B" />
                                        <h3 className="section-title-modern ml-12">New Calculation</h3>
                                    </div>

                                    <div className="input-field-container">
                                        <label className="input-label-premium">Height (cm)</label>
                                        <input
                                            type="number"
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                            placeholder="e.g. 175"
                                            className="input-modern-premium"
                                        />
                                    </div>

                                    <div className="spacer-20"></div>

                                    <div className="input-field-container">
                                        <label className="input-label-premium">Weight (kg)</label>
                                        <input
                                            type="number"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                            placeholder="e.g. 70"
                                            className="input-modern-premium"
                                        />
                                    </div>

                                    <div className="spacer-32"></div>

                                    <button className="btn btn-primary btn-xl w-full" onClick={calculateBMI}>
                                        Analyze My BMI
                                    </button>
                                </div>
                            </div>

                            {bmiResult && (
                                <div className="animate-in">
                                    <div className="spacer-24"></div>
                                    <div className="section-px">
                                        <BMIResultCard bmi={bmiResult} config={getCategory(bmiResult)} />
                                        <div className="spacer-20"></div>
                                        <RecommendationCard config={getCategory(bmiResult)} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bmi-side-col">
                            {/* Categories Info */}
                            <div className="section-px">
                                <h3 className="section-title-small">Reference Ranges</h3>
                                <div className="spacer-12"></div>
                                <div className="card-premium no-padding overflow-hidden">
                                    <CategoryRow label="Underweight" range="< 18.5" bg="#eff6ff" color="#1d4ed8" />
                                    <div className="divider-light"></div>
                                    <CategoryRow label="Normal Weight" range="18.5 - 24.9" bg="#ecfdf5" color="#059669" />
                                    <div className="divider-light"></div>
                                    <CategoryRow label="Overweight" range="25 - 29.9" bg="#fffbeb" color="#d97706" />
                                    <div className="divider-light"></div>
                                    <CategoryRow label="Obese" range="≥ 30" bg="#fef2f2" color="#dc2626" />
                                </div>
                            </div>

                            <div className="spacer-32"></div>

                            <div className="section-px">
                                <div className="disclaimer-note">
                                    <Info size={14} className="mr-8" />
                                    <p>BMI is a general screening tool and not a medical diagnosis. Consult a professional for clinical assessments.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="spacer-40"></div>
                </main>
            </div>

            {/* Bottom Navigation (Mobile Only) */}
            <nav className="bottom-navbar-premium">
                <BottomNavItem icon={<HomeIcon size={24} />} label="Home" onClick={() => navigate('/dashboard')} />
                <BottomNavItem icon={<Calendar size={24} />} label="Book" onClick={() => navigate('/book-slot')} />
                <BottomNavItem icon={<Dumbbell size={24} />} label="Workout" onClick={() => navigate('/workout-guide')} />
                <BottomNavItem icon={<Activity size={24} />} label="BMI" active />
                <BottomNavItem icon={<History size={24} />} label="History" onClick={() => navigate('/history')} />
                <BottomNavItem icon={<User size={24} />} label="Profile" onClick={() => navigate('/profile')} />
            </nav>


            <style jsx>{`
        .main-viewport { flex: 1; overflow-y: auto; padding-bottom: 90px; background-color: #F9FAFB; }
        
        @media (min-width: 1024px) {
            .main-viewport { padding-bottom: 40px; background-color: transparent; }
            .content-area-premium { max-width: 1200px; margin: 0 auto; width: 100%; padding: 0 48px; }
            .app-header-premium { padding: 60px 48px 40px !important; border-bottom-left-radius: 40px !important; border-bottom-right-radius: 40px !important; margin-bottom: 24px; }
            .bmi-grid-web { display: grid; grid-template-columns: 1fr 380px; gap: 32px; align-items: start; }
            .mobile-only { display: none !important; }
            .section-px { padding: 0 !important; }
        }

        .header-tag { font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1.5px; }
        
        .section-px { padding: 0 20px; }
        .section-title-modern { font-size: 18px; font-weight: 800; color: #111; margin: 0; }
        .section-title-small { font-size: 14px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; }

        .input-field-container { display: flex; flex-direction: column; gap: 8px; }
        .input-label-premium { font-size: 14px; font-weight: 600; color: #444; }
        .input-modern-premium { width: 100%; height: 50px; padding: 0 16px; background: #F3F4F6; border: 1.5px solid transparent; border-radius: 12px; font-size: 15px; transition: all 0.2s; }
        .input-modern-premium:focus { background: white; border-color: var(--primary); outline: none; box-shadow: 0 0 0 4px rgba(27, 184, 91, 0.1); }

        .disclaimer-note { display: flex; align-items: flex-start; background: #F3F4F6; padding: 16px; border-radius: 16px; }
        .disclaimer-note p { font-size: 12px; color: #666; margin: 0; line-height: 1.5; font-weight: 500; }

        .btn-xl { height: 56px; border-radius: 16px; font-size: 16px; font-weight: 700; }
        .divider-light { height: 1px; background: #F0F0F0; width: 100%; }

        .animate-in { animation: slideUp 0.4s ease-out; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
        </WebLayout>
    );
};

const BMIResultCard = ({ bmi, config }) => (
    <div className="section-card text-center border-green">
        <span className="label-gray">Your BMI</span>
        <h2 className="bmi-val" style={{ color: config.color }}>{bmi.toFixed(1)}</h2>
        <div className="category-badge" style={{ backgroundColor: config.bg, color: config.color, borderColor: config.color + '88' }}>
            {config.label}
        </div>
        <style jsx>{`
      .border-green { border: 1px solid #E8F5E9; }
      .bmi-val { font-size: 48px; font-weight: 800; margin: 8px 0; }
      .category-badge { display: inline-block; padding: 8px 24px; border-radius: 8px; font-size: 16px; font-weight: 700; border: 1px solid transparent; }
    `}</style>
    </div>
);

const RecommendationCard = ({ config }) => (
    <div className="rec-card">
        <div className="flex-items-center gap-16">
            <div className="rec-icon">
                <TrendingUp size={24} color="#1976D2" />
            </div>
            <div className="rec-text-col">
                <h4 className="rec-title">Personalized Recommendation</h4>
                <p className="rec-body">{config.advice}</p>
            </div>
        </div>
        <style jsx>{`
      .rec-card { background-color: #F1F8FF; border-radius: 12px; padding: 16px; }
      .rec-icon { width: 40px; height: 40px; min-width: 40px; border-radius: 50%; background: #D0E8FF; display: flex; align-items: center; justify-content: center; }
      .rec-title { font-size: 16px; font-weight: 700; color: #0D47A1; margin: 0 0 4px; }
      .rec-body { font-size: 14px; color: #1976D2; margin: 0; line-height: 1.4; }
    `}</style>
    </div>
);

const CategoryRow = ({ label, range, bg, color }) => (
    <div className="cat-row" style={{ backgroundColor: bg, color: color, borderColor: color + '55' }}>
        <span className="cat-lbl">{label}</span>
        <span className="cat-rng">{range}</span>
        <style jsx>{`
      .cat-row { display: flex; justify-content: space-between; padding: 12px 16px; border-radius: 8px; border: 1px solid; font-weight: 700; font-size: 16px; }
    `}</style>
    </div>
);

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

export default BMICalculatorScreen;
