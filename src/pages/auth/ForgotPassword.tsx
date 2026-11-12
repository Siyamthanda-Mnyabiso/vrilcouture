import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ForgotPassword = () => {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await resetPassword(email);
            setSent(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send reset email');
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
                    <p className="text-[#8A8378] mt-4">Reset your password</p>
                </div>

                {sent ? (
                    <p className="text-center text-sm text-green-700">
                        If an account exists for {email}, a reset link is on its way. Check your inbox.
                    </p>
                ) : (
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
                            disabled={isLoading}
                        />

                        <Button
                            type="submit"
                            size="lg"
                            fullWidth
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            Send Reset Link
                        </Button>
                    </form>
                )}

                <p className="text-center text-sm text-[#8A8378] mt-6">
                    <Link
                        to="/login"
                        className="text-[#6B5D4F] font-medium hover:opacity-80 transition-opacity"
                    >
                        Back to sign in
                    </Link>
                </p>
            </div>
        </main>
    );
};
