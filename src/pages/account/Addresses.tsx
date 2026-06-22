import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function Addresses() {
    const { user, updateProfile } = useAuth();
    const [form, setForm] = useState({
        address_line1: user?.address_line1 || '',
        address_line2: user?.address_line2 || '',
        city: user?.city || '',
        postal_code: user?.postal_code || '',
        province: user?.province || '',
        country: user?.country || 'South Africa',
    });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);
        try {
            await updateProfile(form);
            setSuccess(true);
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="max-w-xl mx-auto py-16 px-6">
            <h1 className="font-display text-2xl font-black uppercase mb-8">Address</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    type="text"
                    name="address_line1"
                    label="Address Line 1"
                    value={form.address_line1}
                    onChange={handleChange}
                />
                <Input
                    type="text"
                    name="address_line2"
                    label="Address Line 2 (optional)"
                    value={form.address_line2}
                    onChange={handleChange}
                />
                <Input
                    type="text"
                    name="city"
                    label="City"
                    value={form.city}
                    onChange={handleChange}
                />
                <Input
                    type="text"
                    name="postal_code"
                    label="Postal Code"
                    value={form.postal_code}
                    onChange={handleChange}
                />
                <Input
                    type="text"
                    name="province"
                    label="Province"
                    value={form.province}
                    onChange={handleChange}
                />
                <Input
                    type="text"
                    name="country"
                    label="Country"
                    value={form.country}
                    onChange={handleChange}
                />

                {success && (
                    <p className="text-sm text-green-700">Address saved successfully.</p>
                )}

                <Button type="submit" isLoading={saving} disabled={saving}>
                    Save Address
                </Button>
            </form>
        </main>
    );
}