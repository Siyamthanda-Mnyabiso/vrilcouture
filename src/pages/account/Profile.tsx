import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function Profile() {
    const { user, updateProfile, updatePassword } = useAuth();
    const [fullName, setFullName] = useState(user?.full_name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwSaving, setPwSaving] = useState(false);
    const [pwSuccess, setPwSuccess] = useState(false);
    const [pwError, setPwError] = useState<string | null>(null);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwError(null);
        setPwSuccess(false);

        if (newPassword.length < 6) {
            setPwError('Password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwError('Passwords do not match');
            return;
        }

        setPwSaving(true);
        try {
            await updatePassword(newPassword);
            setPwSuccess(true);
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setPwError(err instanceof Error ? err.message : 'Failed to update password');
        } finally {
            setPwSaving(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);
        try {
            await updateProfile({ full_name: fullName, phone });
            setSuccess(true);
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="max-w-xl mx-auto py-16 px-6">
            <h1 className="font-display text-2xl font-black uppercase mb-8">Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    type="email"
                    label="Email"
                    value={user?.email || ''}
                    disabled
                />

                <Input
                    type="text"
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <Input
                    type="tel"
                    label="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                {success && (
                    <p className="text-sm text-green-700">Profile updated successfully.</p>
                )}

                <Button type="submit" isLoading={saving} disabled={saving}>
                    Save Changes
                </Button>
            </form>

            <h2 className="font-display text-xl font-black uppercase mt-16 mb-8">Change Password</h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <Input
                    type="password"
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />

                <Input
                    type="password"
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                {pwError && <p className="text-sm text-red-600">{pwError}</p>}
                {pwSuccess && (
                    <p className="text-sm text-green-700">Password updated successfully.</p>
                )}

                <Button type="submit" isLoading={pwSaving} disabled={pwSaving}>
                    Update Password
                </Button>
            </form>
        </main>
    );
}