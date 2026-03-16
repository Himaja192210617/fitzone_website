import React, { useState } from 'react';
import {
    Heart,
    Dumbbell,
    Circle,
    Flame,
    Home as HomeIcon,
    Calendar,
    Activity,
    History,
    User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import WebLayout from '../components/WebLayout';

const WorkoutCategoriesScreen = () => {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState("Cardio");
    const tabs = ["Cardio", "Strength", "Functional", "HIIT"];

    const cardioExercises = [
        { name: "Treadmill", level: "Beginner", duration: "20-30 min", calories: "200-300" },
        { name: "Cycling", level: "Beginner", duration: "30-45 min", calories: "250-400" },
        { name: "Rowing", level: "Intermediate", duration: "15-25 min", calories: "180-280" },
        { name: "Stair Climber", level: "Intermediate", duration: "15-20 min", calories: "150-250" },
        { name: "Skipping", level: "Beginner", duration: "10-15 min", calories: "120-200" }
    ];

    const strengthExercises = {
        "Chest": [
            { name: "Bench Press", level: "Intermediate", sets: "3-4", reps: "8-12" },
            { name: "Pec Deck", level: "Beginner", sets: "3", reps: "10-15" },
            { name: "Incline Press", level: "Intermediate", sets: "3-4", reps: "8-12" }
        ],
        "Shoulders": [
            { name: "Shoulder Press", level: "Intermediate", sets: "3-4", reps: "8-12" },
            { name: "Lateral Raise", level: "Beginner", sets: "3", reps: "12-15" },
            { name: "Arnold Press", level: "Advanced", sets: "3", reps: "10-12" }
        ],
        "Triceps": [
            { name: "Pushdown", level: "Beginner", sets: "3", reps: "12-15" },
            { name: "Skull Crushers", level: "Intermediate", sets: "3", reps: "10-12" }
        ],
        "Back": [
            { name: "Lat Pulldown", level: "Beginner", sets: "3-4", reps: "10-12" },
            { name: "Deadlift", level: "Advanced", sets: "3-4", reps: "6-8" }
        ],
        "Biceps": [
            { name: "Barbell Curl", level: "Beginner", sets: "3", reps: "10-12" },
            { name: "Hammer Curl", level: "Beginner", sets: "3", reps: "12-15" }
        ],
        "Legs": [
            { name: "Squats", level: "Intermediate", sets: "4", reps: "8-12" },
            { name: "Leg Press", level: "Beginner", sets: "3-4", reps: "10-15" }
        ]
    };

    const functionalExercises = [
        { name: "Kettlebell Swings", level: "Intermediate", sets: "3-4", reps: "15-20" },
        { name: "Battle Ropes", level: "Advanced", sets: "3-4", duration: "20-30 sec" },
        { name: "TRX Rows", level: "Intermediate", sets: "3", reps: "12-15" },
        { name: "Box Jumps", level: "Advanced", sets: "3", reps: "10-12" }
    ];

    const hiitExercises = [
        { name: "Burpees", level: "Advanced", work: "30 sec", rest: "15 sec" },
        { name: "Mountain Climbers", level: "Intermediate", work: "30 sec", rest: "15 sec" },
        { name: "Jump Squats", level: "Intermediate", work: "30 sec", rest: "15 sec" },
        { name: "High Knees", level: "Beginner", work: "30 sec", rest: "15 sec" }
    ];

    const getHeaderConfig = () => {
        switch (selectedTab) {
            case "Cardio": return { bg: "#FFF1F1", icon: <Heart color="red" />, title: "Cardio Exercises", desc: null };
            case "Strength": return { bg: "#E3F2FD", icon: <Dumbbell color="#1976D2" />, title: "Strength Training", desc: null };
            case "Functional": return { bg: "#F3E5F5", icon: <Circle color="#7B1FA2" />, title: "Functional Training", desc: null };
            case "HIIT": return { bg: "#FFF7F0", icon: <Flame color="#E65100" />, title: "HIIT Workouts", desc: "High-Intensity Interval Training - Short bursts of intense exercise followed by rest" };
            default: return {};
        }
    };

    const config = getHeaderConfig();

    return (
        <WebLayout>
            <div className="main-viewport">
                {/* Header */}
                <header className="app-header-premium">
                    <div className="header-content">
                        <span className="header-tag">FitGuide</span>
                        <h1 className="header-title-premium">Workouts</h1>
                        <p className="header-subtitle-premium">Complete exercise library</p>
                    </div>
                </header>

                <main className="content-area-premium">
                    <div className="spacer-24"></div>

                    {/* Tab Bar */}
                    <div className="section-px">
                        <div className="category-chips">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    className={`chip-btn ${selectedTab === tab ? 'active' : ''}`}
                                    onClick={() => setSelectedTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="spacer-24"></div>

                    {/* Section Description Card */}
                    <div className="section-px">
                        <div className="hero-category-card" style={{ background: config.bg }}>
                            <div className="hero-cat-flex">
                                <div className="hero-cat-icon-box">
                                    {config.icon}
                                </div>
                                <div className="hero-cat-texts">
                                    <h3 className="hero-cat-title">{config.title}</h3>
                                    {config.desc && <p className="hero-cat-desc">{config.desc}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="spacer-24"></div>

                    {/* Exercise Lists */}
                    <div className="section-px">
                        <div className="workout-layout-web">
                            <div className="exercise-list-grid">
                                {selectedTab === "Cardio" && cardioExercises.map((ex, i) => (
                                    <ExerciseCard key={i} name={ex.name} level={ex.level} stats={[
                                        { label: "Duration", val: ex.duration },
                                        { label: "Calories", val: ex.calories }
                                    ]} />
                                ))}

                                {selectedTab === "Strength" && Object.entries(strengthExercises).map(([cat, exs], i) => (
                                    <div key={i} className="mb-24">
                                        <h3 className="group-title-modern">{cat}</h3>
                                        <div className="exercise-list-grid">
                                            {exs.map((ex, j) => (
                                                <ExerciseCard key={j} name={ex.name} level={ex.level} stats={[
                                                    { label: "Sets", val: ex.sets },
                                                    { label: "Reps", val: ex.reps }
                                                ]} />
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {selectedTab === "Functional" && functionalExercises.map((ex, i) => (
                                    <ExerciseCard key={i} name={ex.name} level={ex.level} stats={[
                                        { label: "Sets", val: ex.sets },
                                        ex.reps ? { label: "Reps", val: ex.reps } : { label: "Time", val: ex.duration }
                                    ]} />
                                ))}

                                {selectedTab === "HIIT" && hiitExercises.map((ex, i) => (
                                    <ExerciseCard key={i} name={ex.name} level={ex.level} stats={[
                                        { label: "Work", val: ex.work },
                                        { label: "Rest", val: ex.rest }
                                    ]} />
                                ))}
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
                <BottomNavItem icon={<Dumbbell size={24} />} label="Workout" active />
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
            .exercise-list-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
            .mobile-only { display: none !important; }
            .section-px { padding: 0 !important; }
        }

        .header-tag { font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1.5px; }
        
        .content-area-premium { padding: 0; }
        .section-px { padding: 0 20px; }
        
        .category-chips { display: flex; gap: 8px; overflow-x: auto; padding: 4px; scrollbar-width: none; }
        .category-chips::-webkit-scrollbar { display: none; }
        
        .chip-btn { 
          white-space: nowrap; padding: 10px 24px; border-radius: 100px; 
          background: white; border: 1.5px solid #F3F4F6; font-size: 14px; 
          font-weight: 700; color: #6B7280; transition: all 0.2s; cursor: pointer;
        }
        .chip-btn.active { background: #1BB85B; border-color: #1BB85B; color: white; box-shadow: 0 4px 12px rgba(27, 184, 91, 0.2); }

        .hero-category-card { border-radius: 24px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
        .hero-cat-flex { display: flex; gap: 20px; align-items: flex-start; }
        .hero-cat-icon-box { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; }
        .hero-cat-title { font-size: 20px; font-weight: 800; color: #111; margin: 0; }
        .hero-cat-desc { font-size: 13px; color: #444; margin-top: 6px; line-height: 1.5; font-weight: 500; }

        .exercise-list-grid { display: flex; flex-direction: column; gap: 16px; }
        .group-title-modern { font-size: 18px; font-weight: 800; color: #111; margin-bottom: 16px; padding-left: 4px; border-left: 4px solid #1BB85B; padding-left: 12px; }
        .grid-gap-16 { display: flex; flex-direction: column; gap: 16px; }

        .mb-24 { margin-bottom: 24px; }
      `}</style>
        </WebLayout>
    );
};

const ExerciseCard = ({ name, level, stats }) => (
    <div className="section-card no-margin">
        <div className="flex-between items-center mb-16">
            <h4 className="ex-name">{name}</h4>
            <LevelBadge level={level} />
        </div>
        <div className="ex-stats-row">
            {stats.map((s, i) => (
                <div key={i} className="ex-stat-col">
                    <span className="label-gray">{s.label}</span>
                    <span className="ex-stat-val">{s.val}</span>
                </div>
            ))}
        </div>
        <style jsx>{`
      .no-margin { margin: 0; }
      .ex-name { font-size: 20px; font-weight: 700; margin: 0; }
      .ex-stats-row { display: flex; }
      .ex-stat-col { flex: 1; display: flex; flex-direction: column; }
      .ex-stat-val { font-size: 16px; font-weight: 500; margin-top: 4px; }
    `}</style>
    </div>
);

const LevelBadge = ({ level }) => {
    const colors = {
        Beginner: { bg: "#E8F5E9", text: "#2E7D32" },
        Intermediate: { bg: "#FFF9C4", text: "#F9A825" },
        Advanced: { bg: "#FFEBEE", text: "#C62828" }
    };
    const c = colors[level] || { bg: "#ECEFF1", text: "#455A64" };
    return (
        <div className="badge" style={{ backgroundColor: c.bg, color: c.text }}>
            {level}
            <style jsx>{`
        .badge { padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; }
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

export default WorkoutCategoriesScreen;
