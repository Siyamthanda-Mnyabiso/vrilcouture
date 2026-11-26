// DRAFT wording: needs the client's approval before it goes live.
import { useState } from 'react';
import { getConsentChoice, saveConsentChoice, type ConsentChoice } from '../../lib/analytics';

const SECTIONS: { title: string; paragraphs: string[] }[] = [
    {
        title: 'What We Collect',
        paragraphs: [
            'When you create an account, place an order or contact us, we collect the details you give us, such as your name, email address, phone number, delivery address, order details and message.',
            'When you browse the site, we and our service providers collect information about your device and visit, such as the pages you view, your approximate location and how you arrived at the site.',
        ],
    },
    {
        title: 'How We Use It',
        paragraphs: [
            'We use your information to process and deliver orders, manage your account, answer your questions, keep the site secure, understand how the site is used and measure how our advertising performs.',
        ],
    },
    {
        title: 'Who We Share It With',
        paragraphs: [
            'We share information only with the providers that help us run the store: Stitch for payments, Supabase for our database and accounts, Vercel for hosting and site statistics, Resend for order emails, and Google for analytics and advertising. Some of these providers process information outside South Africa.',
            'We do not sell your personal information.',
        ],
    },
    {
        title: 'Cookies',
        paragraphs: [
            'We use Google Analytics and Google Ads. Their cookies are only set if you accept them. If you decline, Google still receives limited information that does not use cookies, which helps us estimate visits and sales.',
            'The site also stores information in your browser that it needs to work, such as your cart and sign-in session.',
        ],
    },
    {
        title: 'Your Rights',
        paragraphs: [
            'Under the Protection of Personal Information Act (POPIA), you may ask to see, correct or delete your personal information, or object to how we use it. You may also complain to the Information Regulator of South Africa.',
        ],
    },
];

export const Privacy = () => {
    const [choice, setChoice] = useState<ConsentChoice | null>(getConsentChoice);

    const choose = (next: ConsentChoice) => {
        saveConsentChoice(next);
        setChoice(next);
    };

    return (
        <main>
            <section className="px-6 md:px-12 py-20 md:py-28 border-b border-black">
                <h1 className="font-display text-4xl md:text-6xl font-light uppercase tracking-tight mb-6 max-w-3xl">
                    Privacy Policy
                </h1>
                <p className="text-black/60 text-sm md:text-base max-w-xl">
                    How Vril Couture collects, uses and protects your personal information.
                </p>
            </section>

            <section className="px-6 md:px-12 py-16 md:py-24 max-w-3xl mx-auto">
                <div className="space-y-12">
                    {SECTIONS.map(({ title, paragraphs }) => (
                        <div key={title}>
                            <h2 className="font-display text-xl md:text-2xl uppercase tracking-tight mb-4">
                                {title}
                            </h2>
                            {paragraphs.map((paragraph) => (
                                <p
                                    key={paragraph}
                                    className="text-black/60 text-sm leading-relaxed mb-3 last:mb-0"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    ))}

                    <div>
                        <h2 className="font-display text-xl md:text-2xl uppercase tracking-tight mb-4">
                            Your Cookie Choice
                        </h2>
                        <p className="text-black/60 text-sm leading-relaxed mb-4" aria-live="polite">
                            {choice === 'granted' && 'You have accepted analytics and advertising cookies.'}
                            {choice === 'denied' && 'You have declined analytics and advertising cookies.'}
                            {choice === null && 'You have not made a choice yet.'}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => choose('granted')}
                                className="px-8 py-3 border border-black text-xs uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-colors"
                            >
                                Accept cookies
                            </button>
                            <button
                                type="button"
                                onClick={() => choose('denied')}
                                className="px-8 py-3 border border-black text-xs uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-colors"
                            >
                                Decline cookies
                            </button>
                        </div>
                    </div>

                    <div>
                        <h2 className="font-display text-xl md:text-2xl uppercase tracking-tight mb-4">
                            Contact
                        </h2>
                        <p className="text-black/60 text-sm leading-relaxed">
                            Vril Couture, 145 Sir Lowry Rd, The Palms, Cape Town. Email{' '}
                            <a
                                href="mailto:admin@vrilcouture.co.za"
                                className="underline hover:text-black"
                            >
                                admin@vrilcouture.co.za
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};
