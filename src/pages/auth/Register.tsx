import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Register = () => {
    const navigate = useNavigate();
    const { signUp, user, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            await signUp(formData.email, formData.password, {
                full_name: formData.fullName,
            });
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-[80vh] flex items-center justify-center py-16">
            <div className="w-full max-w-md px-6">
                <div className="text-center mb-8">
                    <h1 className="font-display text-3xl font-black uppercase tracking-tight text-black">
                        Vril Couture
                    </h1>
                    <p className="text-gray-500 mt-3 text-sm">Create your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        type="text"
                        name="fullName"
                        label="Full Name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                        disabled={isLoading || authLoading}
                    />

                    <Input
                        type="email"
                        name="email"
                        label="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        required
                        disabled={isLoading || authLoading}
                    />

                    <Input
                        type="password"
                        name="password"
                        label="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Min 6 characters"
                        required
                        disabled={isLoading || authLoading}
                    />

                    <Input
                        type="password"
                        name="confirmPassword"
                        label="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        required
                        disabled={isLoading || authLoading}
                    />

                    <Button
                        type="submit"
                        size="lg"
                        fullWidth
                        isLoading={isLoading || authLoading}
                        disabled={isLoading || authLoading}
                    >
                        Create Account
                    </Button>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-black font-medium hover:opacity-60 transition-opacity">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
};