import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RiskAnalysis from './pages/RiskAnalysis';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

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
                    <Route path="profile" element={<Profile />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                </Route>

                {/* Fallback for unknown routes */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
