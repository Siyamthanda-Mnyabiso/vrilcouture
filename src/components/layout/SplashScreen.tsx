import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function SplashScreen() {
    const [reveal, setReveal] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [removed, setRemoved] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    // Reset the animation whenever we (re)land on the home route.
    const [prevIsHome, setPrevIsHome] = useState(isHome);
    if (isHome !== prevIsHome) {
        setPrevIsHome(isHome);
        if (isHome) {
            setReveal(false);
            setFadeOut(false);
            setRemoved(false);
        }
    }

    useEffect(() => {
        if (!isHome) return;

        // slight delay before reveal (creates anticipation)
        const revealTimer = setTimeout(() => setReveal(true), 250);

        // hold moment (like a fashion frame pause)
        const holdTimer = setTimeout(() => setFadeOut(true), 1800);

        // remove screen
        const removeTimer = setTimeout(() => setRemoved(true), 2200);

        return () => {
            clearTimeout(revealTimer);
            clearTimeout(holdTimer);
            clearTimeout(removeTimer);
        };
    }, [isHome]);

    if (!isHome || removed) return null;

    return (
        <div className={`
            fixed inset-0 z-[100]
            bg-white
            flex items-center justify-center
            transition-all duration-700
            ${fadeOut ? 'opacity-0 scale-[1.02]' : 'opacity-100 scale-100'}
        `}>
            <div className={`
                text-center transition-all duration-700 ease-out
                ${reveal ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-sm translate-y-4'}
            `}>
                <h1 className="
                    font-display
                    text-black
                    uppercase
                    text-5xl md:text-6xl
                    tracking-[0.4em]
                    font-light
                ">
                    VRIL
                </h1>

                <div className="mt-3 overflow-hidden">
                    <p className="
                        text-black/60
                        uppercase
                        text-[10px]
                        tracking-[0.8em]
                    ">
                        Couture
                    </p>
                </div>
            </div>
        </div>
    );
}