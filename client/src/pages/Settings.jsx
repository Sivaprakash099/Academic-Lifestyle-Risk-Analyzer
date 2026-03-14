import React, { useState } from 'react';
import { Bell, Shield, Moon, Trash2, Key, AlertTriangle, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { toast } from 'react-hot-toast';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        weeklyReport: true
    });

    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleNotification = React.useCallback((key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const handlePasswordChange = React.useCallback((e) => {
        setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const handlePasswordUpdate = React.useCallback(async (e) => {
        e.preventDefault();
        
        // Validation
        if (passwordData.newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters long.");
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("Passwords do not match.");
        }

        setIsPasswordLoading(true);
        try {
            await API.put('/auth/password', {
                password: passwordData.newPassword
            });
            toast.success("Password updated successfully.");
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update password");
        } finally {
            setIsPasswordLoading(false);
        }
    }, [passwordData]);

    const handleDeleteAccount = React.useCallback(async () => {
        setIsDeleting(true);
        try {
            await API.delete('/auth/delete');
            
            // Clear local storage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            
            toast.success("Account deleted successfully.");
            setIsDeleteModalOpen(false);
            
            // Redirect to login/signup
            navigate('/login');
        } catch (error) {
            console.error("Delete Account Error:", error);
            toast.error(error.response?.data?.message || "Failed to delete account");
        } finally {
            setIsDeleting(false);
        }
    }, [navigate]);

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-text-primary">Settings</h1>

            {/* Account Security */}
            <Card>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Shield size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-text-primary">Security</h2>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                    <Input
                        label="New Password"
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                    />
                    <Input
                        label="Confirm New Password"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                    />
                    <div className="pt-2">
                        <Button type="submit" isLoading={isPasswordLoading}>Update Password</Button>
                    </div>
                </form>
            </Card>

            {/* Notifications */}
            <Card>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                        <Bell size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-text-primary">Notifications</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div>
                            <p className="font-medium text-text-primary">Email Notifications</p>
                            <p className="text-sm text-text-secondary">Receive analysis results via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notifications.email}
                                onChange={() => toggleNotification('email')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div>
                            <p className="font-medium text-text-primary">Weekly Report</p>
                            <p className="text-sm text-text-secondary">Get a summary of your performance every week</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notifications.weeklyReport}
                                onChange={() => toggleNotification('weeklyReport')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-100 bg-red-50/30">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 rounded-lg text-red-600">
                        <Trash2 size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
                </div>

                <p className="text-sm text-text-secondary mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>

                <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
                    Delete Account
                </Button>
            </Card>

            {/* Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <Card className="max-w-md w-full p-6 shadow-2xl animate-scale-in">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3 text-red-600">
                                <AlertTriangle size={24} />
                                <h3 className="text-xl font-bold">Confirm Account Deletion</h3>
                            </div>
                            <button 
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="text-text-secondary hover:text-text-primary p-1 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <p className="text-text-secondary mb-8 leading-relaxed">
                            Are you sure you want to delete your account? This action cannot be undone. All your data, including risk history and profile information, will be permanently removed.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="danger" 
                                onClick={handleDeleteAccount}
                                isLoading={isDeleting}
                            >
                                Delete Permanently
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
