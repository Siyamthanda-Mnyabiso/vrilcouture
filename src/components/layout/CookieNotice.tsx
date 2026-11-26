import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getConsentChoice, saveConsentChoice, type ConsentChoice } from '../../lib/analytics';

export const CookieNotice = () => {
    const [visible, setVisible] = useState(() => getConsentChoice() === null);

    if (!visible) return null;

    const choose = (choice: ConsentChoice) => {
        saveConsentChoice(choice);
        setVisible(false);
    };

    // Sits above the mobile music bar (z-40) and below the menus (z-50).
    return (
        <div
            role="region"
            aria-label="Cookie notice"
            className="fixed bottom-0 inset-x-0 z-[45] bg-white text-black border-t border-black"
        >
            <div className="max-w-[1440px] mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="text-sm text-black/70">
                    We use analytics and advertising cookies to see how our site is used and how our
                    ads perform. Read our{' '}
                    <Link to="/privacy" className="underline hover:text-black">
                        privacy policy
                    </Link>
                    .
                </p>
                <div className="flex gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={() => choose('granted')}
                        className="flex-1 px-8 py-3 bg-black text-white text-xs uppercase tracking-[0.3em] hover:bg-black/80 transition-colors"
                    >
                        Accept
                    </button>
                    <button
                        type="button"
                        onClick={() => choose('denied')}
                        className="flex-1 px-8 py-3 border border-black text-black text-xs uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-colors"
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
};
