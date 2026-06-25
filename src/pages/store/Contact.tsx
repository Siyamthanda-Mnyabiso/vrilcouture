// src/pages/store/Contact.tsx
import { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const CONTACT_EMAIL = 'hello@vrilcouture.com';

export const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const subject = encodeURIComponent(form.subject || `Message from ${form.name || 'website visitor'}`);
        const bodyLines = [
            form.message,
            '',
            '---',
            form.name ? `From: ${form.name}` : '',
            form.email ? `Email: ${form.email}` : '',
        ].filter(Boolean);
        const body = encodeURIComponent(bodyLines.join('\n'));

        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    };

    return (
        <main>
            <section className="px-6 md:px-12 py-20 md:py-28 border-b border-black">
                <h1 className="font-display text-4xl md:text-6xl font-light uppercase tracking-tight mb-6">
                    Contact Us
                </h1>
                <p className="text-black/60 text-sm md:text-base max-w-xl">
                    Questions about an order, a piece, or anything else — reach out
                    and we'll get back to you.
                </p>
            </section>

            <section className="px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-16">
                <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
                    <Input
                        label="Name"
                        value={form.name}
                        onChange={handleChange('name')}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={handleChange('email')}
                        required
                    />
                    <Input
                        label="Subject"
                        value={form.subject}
                        onChange={handleChange('subject')}
                    />
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">Message</label>
                        <textarea
                            value={form.message}
                            onChange={handleChange('message')}
                            required
                            rows={6}
                            className="w-full px-4 py-3 bg-white border border-black rounded-none text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200"
                        />
                    </div>
                    <Button type="submit" fullWidth>
                        Send Message
                    </Button>
                </form>

                <div>
                    <h2 className="font-display text-xl uppercase tracking-tight mb-4">
                        Other Ways To Reach Us
                    </h2>
                    <p className="text-black/60 text-sm mb-2">
                        Email:{' '}
                        <a href={`mailto:${CONTACT_EMAIL}`} className="text-black underline">
                            {CONTACT_EMAIL}
                        </a>
                    </p>
                    <p className="text-black/60 text-sm">
                        We typically respond within 1–2 business days.
                    </p>
                </div>
            </section>
        </main>
    );
};