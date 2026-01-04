import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { LogIn } from 'lucide-react';
import Card from '../components/ui/Card';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(containerRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        )
            .fromTo(formRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
                "-=0.3"
            );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
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
                        <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
                        <p className="text-slate-500 mt-2">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Email Address"
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            value={email}
                            className='text-black'
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            className='text-black'
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                        <Button
                            type="submit"
                            className="w-full mt-2"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : (
                                <>
                                    <span>Sign In</span>
                                    <LogIn size={18} />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline">
                            Create Account
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
