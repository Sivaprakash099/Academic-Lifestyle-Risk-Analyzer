import React, { useState } from 'react';
import { User, Mail, BookOpen, Clock, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';

export default function Profile() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API save
        setTimeout(() => {
            localStorage.setItem('user', JSON.stringify(user));
            toast.success("Profile updated successfully!");
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-text-primary">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <Card className="flex flex-col items-center text-center p-8 sticky top-6">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-primary/30 mb-6">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <h2 className="text-xl font-bold text-text-primary">{user.name || 'User Name'}</h2>
                        <p className="text-text-secondary">{user.email || 'user@example.com'}</p>
                        <div className="mt-6 w-full">
                            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                                Student Account
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2">
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-text-primary">Personal Details</h3>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <Input
                                label="Full Name"
                                id="name"
                                name="name"
                                value={user.name || ''}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />
                            <Input
                                label="Email"
                                id="email"
                                name="email"
                                value={user.email || ''}
                                onChange={handleChange}
                                disabled
                                className="bg-gray-50 cursor-not-allowed"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Course"
                                    id="course"
                                    name="course"
                                    placeholder="e.g. Computer Science"
                                    value={user.course || ''}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Year/Semester"
                                    id="year"
                                    name="year"
                                    placeholder="e.g. 3rd Year"
                                    value={user.year || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button type="submit" isLoading={isLoading}>
                                    <Save size={18} className="mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
