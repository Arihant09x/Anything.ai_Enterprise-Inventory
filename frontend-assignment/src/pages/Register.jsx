import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { UserPlus } from 'lucide-react';
import Card from '../components/ui/Card';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminSecret, setAdminSecret] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const containerRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        )
            .fromTo(formRef.current,
                { x: 50, opacity: 0 }, // Slide in from right for Register
                { x: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
                "-=0.3"
            );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const payload = {
            username,
            email,
            password,
            ...(adminSecret && { adminSecret }) // Only include if truthy
        };

        const result = await register(payload);
        setLoading(false);
        if (!result.success) {
            setError(result.message);
            // Shake animation on error
            gsap.fromTo(formRef.current,
                { x: -10 },
                { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: "power1.inOut", onComplete: () => gsap.set(formRef.current, { x: 0 }) }
            );
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div ref={formRef} className="w-full max-w-md">
                <Card className="hover:shadow-xl transition-shadow duration-300">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-800">Create Account</h1>
                        <p className="text-slate-500 mt-2">Join us today!</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Username"
                            id="username"
                            placeholder="John Doe"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="relative">
                            <Input
                                label="Admin Secret Key (Optional)"
                                type="password"
                                id="adminSecret"
                                placeholder="Enter secret for Admin access"
                                value={adminSecret}
                                onChange={(e) => setAdminSecret(e.target.value)}
                            />
                            <p className="text-xs text-slate-400 absolute top-0 right-0 mt-1 mr-1">For Admins Only</p>
                        </div>


                        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                        <Button
                            type="submit"
                            className="w-full mt-4"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : (
                                <>
                                    <span>Register</span>
                                    <UserPlus size={18} />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
                            Sign In
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Register;
