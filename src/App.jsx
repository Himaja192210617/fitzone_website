import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import SplashScreen from './pages/SplashScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import HomeScreen from './pages/HomeScreen';
import BookSlotScreen from './pages/BookSlotScreen';
import BookingHistoryScreen from './pages/BookingHistoryScreen';
import GymOwnerDashboardScreen from './pages/GymOwnerDashboardScreen';
import ProfileScreen from './pages/ProfileScreen';
import EditProfileScreen from './pages/EditProfileScreen';
import ForgotPasswordScreen from './pages/ForgotPasswordScreen';
import BMICalculatorScreen from './pages/BMICalculatorScreen';
import WorkoutCategoriesScreen from './pages/WorkoutCategoriesScreen';
import GymSetupScreen from './pages/GymSetupScreen';
import ConfigureHoursScreen from './pages/ConfigureHoursScreen';
import UploadDataScreen from './pages/UploadDataScreen';
import SetCapacityScreen from './pages/SetCapacityScreen';
import GymSelectionScreen from './pages/GymSelectionScreen';


const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute><HomeScreen /></PrivateRoute>
          } />
          <Route path="/book-slot" element={
            <PrivateRoute><BookSlotScreen /></PrivateRoute>
          } />
          <Route path="/history" element={
            <PrivateRoute><BookingHistoryScreen /></PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute><ProfileScreen /></PrivateRoute>
          } />
          <Route path="/edit-profile" element={
            <PrivateRoute><EditProfileScreen /></PrivateRoute>
          } />
          <Route path="/bmi" element={
            <PrivateRoute><BMICalculatorScreen /></PrivateRoute>
          } />
          <Route path="/workout-guide" element={
            <PrivateRoute><WorkoutCategoriesScreen /></PrivateRoute>
          } />
          <Route path="/select-gym" element={
            <PrivateRoute><GymSelectionScreen /></PrivateRoute>
          } />

          {/* Admin Setup Flow */}
          <Route path="/setup-gym" element={
            <PrivateRoute><GymSetupScreen /></PrivateRoute>
          } />
          <Route path="/configure-hours" element={
            <PrivateRoute><ConfigureHoursScreen /></PrivateRoute>
          } />
          <Route path="/upload-data" element={
            <PrivateRoute><UploadDataScreen /></PrivateRoute>
          } />
          <Route path="/set-capacity" element={
            <PrivateRoute><SetCapacityScreen /></PrivateRoute>
          } />

          {/* Admin Dashboards */}
          <Route path="/admin-dashboard" element={
            <PrivateRoute><GymOwnerDashboardScreen /></PrivateRoute>
          } />


          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
