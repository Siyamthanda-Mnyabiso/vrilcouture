import { useState } from 'react';
import { getConsentChoice, saveConsentChoice, type ConsentChoice } from '../../lib/analytics';
import { LAST_UPDATED, SECTIONS, type PolicyBlock } from './privacy.content';

const CONTACT_EMAIL = 'admin@vrilcouture.co.za';

const HEADING = 'font-display text-xl md:text-2xl uppercase tracking-tight mb-4';
const BODY = 'text-black/60 text-sm leading-relaxed';
const COOKIE_BUTTON =
    'px-8 py-3 border border-black text-xs uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-colors';

const Block = ({ block }: { block: PolicyBlock }) => {
    if (block.type === 'subheading') {
        return <h3 className="text-sm font-bold mt-6 mb-2">{block.text}</h3>;
    }
    if (block.type === 'list') {
        return (
            <ul className={`${BODY} list-disc pl-5 space-y-1 mb-3 last:mb-0`}>
                {block.items.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        );
    }
    return <p className={`${BODY} mb-3 last:mb-0`}>{block.text}</p>;
};

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
                    Privacy &amp; Cookie Policy
                </h1>
                <p className="text-black/60 text-sm md:text-base">Last updated: {LAST_UPDATED}</p>
            </section>

            <section className="px-6 md:px-12 py-16 md:py-24 max-w-3xl mx-auto">
                <div className="space-y-12">
                    {SECTIONS.map(({ title, blocks }, index) => (
                        <div key={title}>
                            <h2 className={HEADING}>
                                {index + 1}. {title}
                            </h2>
                            {blocks.map((block, blockIndex) => (
                                <Block key={blockIndex} block={block} />
                            ))}
                        </div>
                    ))}

                    <div>
                        <h2 className={HEADING}>{SECTIONS.length + 1}. Contact us</h2>
                        <p className={`${BODY} mb-3`}>
                            If you have any questions regarding this Privacy and Cookie Policy, wish to
                            exercise your privacy rights or have concerns regarding the handling of your
                            personal information, please contact us.
                        </p>
                        <address className={`${BODY} not-italic mb-3`}>
                            Vril Couture
                            <br />
                            Website: www.vrilcouture.co.za
                            <br />
                            Email:{' '}
                            <a
                                href={`mailto:${CONTACT_EMAIL}?subject=Privacy%20Enquiry`}
                                className="underline hover:text-black"
                            >
                                {CONTACT_EMAIL}
                            </a>
                            <br />
                            Business location: Woodstock, Cape Town, South Africa
                            <br />
                            Registered legal entity: Vril Couture
                            <br />
                            Business registration number: K2024008853
                            <br />
                            Registered business address: 145 Sir Lowry Road, The Palms, Selwyn
                            Studios, Unit A058, Woodstock, Cape Town, 7915
                        </address>
                        <p className={`${BODY} mb-3`}>
                            Please include “Privacy Enquiry” in the subject line of your email.
                        </p>
                        <p className={`${BODY} mb-3`}>
                            If you are dissatisfied with how your personal information has been handled,
                            you may also lodge a complaint with:
                        </p>
                        <p className={`${BODY} mb-6`}>
                            Information Regulator of South Africa
                            <br />
                            Website:{' '}
                            <a
                                href="https://inforegulator.org.za/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-black"
                            >
                                https://inforegulator.org.za/
                            </a>
                        </p>
                        <p className={BODY}>
                            Your privacy matters. Thank you for placing your trust in Vril Couture.
                        </p>
                    </div>

                    <div>
                        <h2 className={HEADING}>Your cookie choice</h2>
                        <p className={`${BODY} mb-4`} aria-live="polite">
                            {choice === 'granted' && 'You have accepted analytics and advertising cookies.'}
                            {choice === 'denied' && 'You have declined analytics and advertising cookies.'}
                            {choice === null && 'You have not made a choice yet.'}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button type="button" onClick={() => choose('granted')} className={COOKIE_BUTTON}>
                                Accept cookies
                            </button>
                            <button type="button" onClick={() => choose('denied')} className={COOKIE_BUTTON}>
                                Decline cookies
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};
