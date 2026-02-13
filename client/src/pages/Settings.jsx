import React, { useState } from 'react';
import { Bell, Shield, Moon, Trash2, Key } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { toast } from 'react-hot-toast';

export default function Settings() {
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        weeklyReport: true
    });

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

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

                <form className="space-y-4 max-w-md">
                    <Input
                        label="Current Password"
                        id="current-password"
                        type="password"
                        placeholder="••••••••"
                    />
                    <Input
                        label="New Password"
                        id="new-password"
                        type="password"
                        placeholder="••••••••"
                    />
                    <div className="pt-2">
                        <Button>Change Password</Button>
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
            <Card className="border-red-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 rounded-lg text-red-600">
                        <Trash2 size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
                </div>

                <p className="text-sm text-text-secondary mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>

                <Button variant="danger" onClick={() => toast.error("Account deletion requires confirmation.")}>
                    Delete Account
                </Button>
            </Card>
        </div>
    );
}
