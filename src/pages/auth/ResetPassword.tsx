import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ResetPassword = () => {
    const navigate = useNavigate();
    const { updatePassword, user, loading: authLoading } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await updatePassword(password);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update password');
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
                        VRIL COUTURE.
                    </h1>
                    <div className="w-12 h-0.5 bg-[#6B5D4F] mx-auto mt-4" />
                    <p className="text-[#8A8378] mt-4">Choose a new password</p>
                </div>

                {!authLoading && !user ? (
                    <p className="text-center text-sm text-[#8A8378]">
                        This reset link is invalid or has expired.{' '}
                        <Link
                            to="/forgot-password"
                            className="text-[#6B5D4F] font-medium hover:opacity-80 transition-opacity"
                        >
                            Request a new one
                        </Link>
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            type="password"
                            label="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading || authLoading}
                        />

                        <Input
                            type="password"
                            label="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            Update Password
                        </Button>
                    </form>
                )}
            </div>
        </main>
    );
};
