import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './layouts/DashboardLayout';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RiskAnalysis = lazy(() => import('./pages/RiskAnalysis'));
const AcademicGoals = lazy(() => import('./pages/AcademicGoals'));
const Profile = lazy(() => import('./pages/Profile'));
const Reports = lazy(() => import('./pages/Reports'));
const AnalysisHistory = lazy(() => import('./pages/AnalysisHistory'));
const Settings = lazy(() => import('./pages/Settings'));

// Mock Auth Service for now - replace with actual service
const authService = {
    getCurrentUser: () => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (e) {
            return null;
        }
    },
};

const ProtectedRoute = ({ children }) => {
    const user = authService.getCurrentUser();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <Toaster position="top-right" toastOptions={{
                duration: 4000,
                style: {
                    background: '#333',
                    color: '#fff',
                },
                success: {
                    style: {
                        background: '#10B981',
                    },
                },
                error: {
                    style: {
                        background: '#EF4444',
                    },
                },
            }} />
            <Suspense fallback={<div className="flex justify-center items-center h-screen bg-light"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div></div>}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes wrapped in DashboardLayout */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="analysis" element={<RiskAnalysis />} />
                        <Route path="academic-goals" element={<AcademicGoals />} />
                        <Route path="analysis-history" element={<AnalysisHistory />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>

                    {/* Fallback for unknown routes */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
