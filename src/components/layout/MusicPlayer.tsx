// src/components/layout/MusicPlayer.tsx
//
// The site's Spotify player. It uses Spotify's iFrame API so the page can start
// the music on the visitor's first click, tap or key press. Browsers do not
// allow sound to start before the visitor has interacted with the page, so that
// first interaction is the earliest it can begin.
//
// Visitors who are not signed in to Spotify in that browser (and anyone whose
// browser blocks third-party cookies, such as Safari or Brave) only hear
// Spotify's 30-second previews. That is a Spotify limit, not something the
// site can change.
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ALBUM_ID = '0Hr4UiqidZHMMzCMTFXxzD';
const ALBUM_URI = `spotify:album:${ALBUM_ID}`;
const ALBUM_URL = `https://open.spotify.com/album/${ALBUM_ID}`;
const EMBED_URL = `https://open.spotify.com/embed/album/${ALBUM_ID}?utm_source=generator`;
const STARTED_KEY = 'vril-music-started';
const PLAYER_HEIGHT = 80;

interface EmbedController {
    play: () => void;
    destroy: () => void;
    addListener: (
        event: 'playback_update',
        callback: (e: { data: { isPaused: boolean } }) => void
    ) => void;
}

interface SpotifyIFrameApi {
    createController: (
        element: HTMLElement,
        options: { uri: string; width: string; height: number },
        callback: (controller: EmbedController) => void
    ) => void;
}

declare global {
    interface Window {
        onSpotifyIframeApiReady?: (api: SpotifyIFrameApi) => void;
    }
}

let apiPromise: Promise<SpotifyIFrameApi> | null = null;

function loadSpotifyApi(): Promise<SpotifyIFrameApi> {
    if (!apiPromise) {
        apiPromise = new Promise((resolve, reject) => {
            window.onSpotifyIframeApiReady = resolve;
            const script = document.createElement('script');
            script.src = 'https://open.spotify.com/embed/iframe-api/v1';
            script.async = true;
            script.onerror = () => {
                apiPromise = null;
                reject(new Error('Spotify player script failed to load'));
            };
            document.body.appendChild(script);
        });
    }
    return apiPromise;
}

function hasStarted() {
    try {
        return sessionStorage.getItem(STARTED_KEY) === '1';
    } catch {
        return false;
    }
}

function markStarted() {
    try {
        sessionStorage.setItem(STARTED_KEY, '1');
    } catch {
        // Storage can be blocked; the player still works.
    }
}

function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(
        () => window.matchMedia('(min-width: 1024px)').matches
    );
    useEffect(() => {
        const query = window.matchMedia('(min-width: 1024px)');
        const onChange = () => setIsDesktop(query.matches);
        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
    }, []);
    return isDesktop;
}

function SpotifyEmbed() {
    const hostRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;

        let cancelled = false;
        let controller: EmbedController | null = null;
        let removeStartListeners = () => {};

        loadSpotifyApi()
            .then((api) => {
                if (cancelled) return;
                const mount = document.createElement('div');
                host.appendChild(mount);

                api.createController(
                    mount,
                    { uri: ALBUM_URI, width: '100%', height: PLAYER_HEIGHT },
                    (created) => {
                        if (cancelled) {
                            created.destroy();
                            return;
                        }
                        controller = created;

                        created.addListener('playback_update', (e) => {
                            if (!e.data.isPaused) markStarted();
                        });

                        if (hasStarted()) return;

                        // One attempt, on the first click, tap or key press.
                        const start = (event: Event) => {
                            if (event instanceof KeyboardEvent && event.key === 'Escape') return;
                            removeStartListeners();
                            if (!hasStarted()) created.play();
                        };
                        document.addEventListener('click', start, true);
                        document.addEventListener('keydown', start, true);
                        removeStartListeners = () => {
                            document.removeEventListener('click', start, true);
                            document.removeEventListener('keydown', start, true);
                        };
                    }
                );
            })
            .catch(() => {
                if (cancelled) return;
                // The script could not load: fall back to the plain embed.
                const frame = document.createElement('iframe');
                frame.src = EMBED_URL;
                frame.width = '100%';
                frame.height = String(PLAYER_HEIGHT);
                frame.style.border = '0';
                frame.style.borderRadius = '12px';
                frame.title = 'Spotify Album';
                frame.allow =
                    'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
                host.appendChild(frame);
            });

        return () => {
            cancelled = true;
            removeStartListeners();
            controller?.destroy();
            host.replaceChildren();
        };
    }, []);

    return <div ref={hostRef} className="w-full" style={{ minHeight: PLAYER_HEIGHT }} />;
}

/** Player shown in the header on large screens. */
export function HeaderPlayer() {
    const isDesktop = useIsDesktop();
    if (!isDesktop) return null;

    return (
        <div className="flex flex-col items-center gap-2 w-[300px]">
            <SpotifyEmbed />
            <a
                href={ALBUM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-black text-white text-[10px] uppercase tracking-[0.25em] py-2 rounded-full hover:bg-neutral-800 transition"
            >
                ▶ Play on Spotify
            </a>
        </div>
    );
}

/** Player pinned to the bottom of the screen on phones and tablets. */
export function MobilePlayerBar() {
    const isDesktop = useIsDesktop();
    const [open, setOpen] = useState(true);

    // Keep the bottom of every page clear of the bar.
    useEffect(() => {
        if (isDesktop) return;
        const previous = document.body.style.paddingBottom;
        document.body.style.paddingBottom = open ? `${PLAYER_HEIGHT + 56}px` : '40px';
        return () => {
            document.body.style.paddingBottom = previous;
        };
    }, [isDesktop, open]);

    if (isDesktop) return null;

    return createPortal(
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-black">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? 'Hide music player' : 'Show music player'}
                className="w-full h-10 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em]"
            >
                Now Playing
                {open ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
            {/* Kept mounted when hidden so the music carries on playing. */}
            <div
                className="px-3 overflow-hidden"
                style={{ height: open ? PLAYER_HEIGHT + 16 : 0, paddingBottom: open ? 16 : 0 }}
            >
                <SpotifyEmbed />
            </div>
        </div>,
        document.body
    );
}
