import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const SplashScreen = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const duration = 8000; // 8 seconds
        const interval = 50; 
        const step = (interval / duration) * 100;

        const progressTimer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressTimer);
                    return 100;
                }
                return prev + step;
            });
        }, interval);

        const navigateTimer = setTimeout(() => {
            // After splash, navigate to login or dashboard
            // For now, consistent with user request to "start" with splash
            navigate('/login');
        }, duration);

        return () => {
            clearInterval(progressTimer);
            clearTimeout(navigateTimer);
        };
    }, [navigate]);

    return (
        <div className="fitzone-splash-container">
            {/* Animated Background Blobs */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1.2 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
                className="splash-blob splash-blob-1"
            ></motion.div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.1, scale: 1.2 }}
                transition={{ duration: 5, delay: 1, repeat: Infinity, repeatType: "mirror" }}
                className="splash-blob splash-blob-2"
            ></motion.div>

            <div className="splash-content-wrapper">
                {/* Logo Section */}
                <motion.div 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="splash-logo-box"
                >
                    <div className="logo-inner pulse-premium">
                        <span className="logo-icon-emoji">💪</span>
                    </div>
                </motion.div>

                {/* Brand Section */}
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="splash-brand-info"
                >
                    <h1 className="fitzone-title-main">FitZone</h1>
                    <div className="fitzone-underline-accent"></div>
                    <p className="fitzone-tagline-premium">Elevate Your Fitness Experience</p>
                </motion.div>

                {/* Progress Section */}
                <div className="splash-progress-host">
                    <div className="fitzone-progress-track">
                        <motion.div 
                            className="fitzone-progress-fill" 
                            style={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                        ></motion.div>
                    </div>
                    <div className="fitzone-loading-meta">
                        <span className="loading-text-anim">Initializing System...</span>
                        <span className="loading-perc">{Math.round(progress)}%</span>
                    </div>
                </div>

                {/* Glassmorphic Features */}
                <motion.div 
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="fitzone-features-glass"
                >
                    <div className="glass-feature-item">
                        <span className="feature-emoji-icon">🤖</span>
                        <span className="feature-label-text">AI Predictions</span>
                    </div>
                    <div className="glass-feature-sep"></div>
                    <div className="glass-feature-item">
                        <span className="feature-emoji-icon">📅</span>
                        <span className="feature-label-text">Smart Slots</span>
                    </div>
                </motion.div>
            </div>

            {/* Footer Branding */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="fitzone-splash-footer"
            >
                <p>powered by <span className="simats-brand">SIMATS ENGINEERING</span></p>
            </motion.div>
        </div>
    );
};

export default SplashScreen;
