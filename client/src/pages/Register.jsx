import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Full Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // If the server returns an error message, throw it
                throw new Error(data.message || 'Registration failed');
            }

            // Success case
            toast.success('Registration successful! Please login.');

            // Optional: Auto login? For now, redirect to login
            navigate('/login');

        } catch (error) {
            console.error('Registration error:', error);
            // Display the specific error message from the backend
            toast.error(error.message || 'Something went wrong during registration.');
        } finally {
            setIsLoading(false);
        }
    };

    const passwordStrength = (pass) => {
        if (!pass) return 0;
        let score = 0;
        if (pass.length > 5) score += 1;
        if (pass.length > 8) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        return score; // Max 5
    };

    const strength = passwordStrength(formData.password);
    const strengthColor = [
        'bg-gray-200', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'
    ];

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join to start tracking your academic wellbeing"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    icon={User}
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                />

                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    icon={Mail}
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                />

                <div className="relative">
                    <Input
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        icon={Lock}
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />
                    <button
                        type="button"
                        className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                    <div className="flex gap-1 h-1 mt-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className={`h-full flex-1 rounded-full transition-all duration-300 ${strength >= i ? strengthColor[strength] : 'bg-gray-100'}`}
                            />
                        ))}
                    </div>
                )}

                <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    icon={Lock}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                />

                <div className="pt-2">
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={isLoading}
                    >
                        Create Account
                    </Button>
                </div>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-primary hover:text-primary-hover">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
