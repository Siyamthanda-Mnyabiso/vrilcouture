// src/pages/store/Contact.tsx
import { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../../utils/constants';

const CONTACT_EMAIL = 'admin@vrilcouture.co.za';

type Status = 'idle' | 'sending' | 'success' | 'error';

const EMPTY_FORM = { name: '', email: '', subject: '', message: '', website: '' };

export const Contact = () => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [status, setStatus] = useState<Status>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === 'sending') return;

        setStatus('sending');
        setErrorMessage('');

        try {
            const response = await fetch(`${SUPABASE_URL}/functions/v1/contact-form`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    apikey: SUPABASE_ANON_KEY,
                },
                body: JSON.stringify(form),
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                setErrorMessage(
                    result?.error || 'Your message could not be sent. Please try again.'
                );
                setStatus('error');
                return;
            }

            setForm(EMPTY_FORM);
            setStatus('success');
        } catch {
            setErrorMessage('Your message could not be sent. Please check your connection and try again.');
            setStatus('error');
        }
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
                {status === 'success' ? (
                    <div
                        role="status"
                        aria-live="polite"
                        className="max-w-md border border-black p-8"
                    >
                        <h2 className="font-display text-2xl uppercase tracking-tight mb-3">
                            Message sent
                        </h2>
                        <p className="text-black/70 text-sm mb-6">
                            Thank you for getting in touch. We have received your message and
                            will get back to you soon.
                        </p>
                        <Button variant="outline" onClick={() => setStatus('idle')}>
                            Send another message
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
                        <Input
                            label="Name"
                            value={form.name}
                            onChange={handleChange('name')}
                            maxLength={100}
                            required
                            disabled={status === 'sending'}
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={handleChange('email')}
                            maxLength={254}
                            required
                            disabled={status === 'sending'}
                        />
                        <Input
                            label="Subject"
                            value={form.subject}
                            onChange={handleChange('subject')}
                            maxLength={150}
                            disabled={status === 'sending'}
                        />
                        <div>
                            <label htmlFor="contact-message" className="block text-sm font-medium text-black mb-2">
                                Message
                            </label>
                            <textarea
                                id="contact-message"
                                value={form.message}
                                onChange={handleChange('message')}
                                required
                                maxLength={5000}
                                rows={6}
                                disabled={status === 'sending'}
                                className="w-full px-4 py-3 bg-white border border-black rounded-none text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200"
                            />
                        </div>

                        {/* Spam trap: hidden from people, bots tend to fill it in. */}
                        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                            <label>
                                Website
                                <input
                                    type="text"
                                    name="website"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={form.website}
                                    onChange={handleChange('website')}
                                />
                            </label>
                        </div>

                        {status === 'error' && (
                            <p role="alert" className="text-sm text-red-600">
                                {errorMessage}
                            </p>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            isLoading={status === 'sending'}
                            disabled={status === 'sending'}
                        >
                            {status === 'sending' ? 'Sending…' : 'Send Message'}
                        </Button>
                    </form>
                )}

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
