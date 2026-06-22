import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const [fullName, setFullName] = useState(user?.full_name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

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
        </main>
    );
}