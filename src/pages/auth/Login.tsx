import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Login = () => {
    const navigate = useNavigate();
    const { signIn, user, loading: authLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await signIn(email, password);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign in');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-[80vh] flex items-center justify-center py-16">
            <div className="w-full max-w-md px-6">
                <div className="text-center mb-8">
                    <h1
                        className="text-4xl font-bold text-[#2C2420] tracking-wider"
                        style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}
                    >
                        KĀNGI
                    </h1>
                    <div className="w-12 h-0.5 bg-[#6B5D4F] mx-auto mt-4" />
                    <p className="text-[#8A8378] mt-4">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        type="email"
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        disabled={isLoading || authLoading}
                    />

                    <Input
                        type="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        disabled={isLoading || authLoading}
                    />

                    <div className="flex items-center justify-between text-sm">
                        <Link
                            to="/forgot-password"
                            className="text-[#6B5D4F] hover:opacity-80 transition-opacity"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        fullWidth
                        isLoading={isLoading || authLoading}
                        disabled={isLoading || authLoading}
                    >
                        Sign In
                    </Button>

                    <p className="text-center text-sm text-[#8A8378]">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-[#6B5D4F] font-medium hover:opacity-80 transition-opacity"
                        >
                            Create one
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
};