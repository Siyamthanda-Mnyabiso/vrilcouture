import { useEffect, useRef, useState } from 'react';


declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

const PLAYLIST_ID = 'PLT5P1VUNTt8Uxg65U3SbIo_g377joGDun';

export default function MusicPlayer(): React.JSX.Element {
    const playerRef = useRef<any | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [isReady, setIsReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [trackTitle, setTrackTitle] = useState('Loading playlist...');

    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(tag);
        }

        const createPlayer = () => {
            if (playerRef.current || !containerRef.current) return;

            playerRef.current = new window.YT.Player(containerRef.current, {
                height: '0',
                width: '0',
                playerVars: {
                    listType: 'playlist',
                    list: PLAYLIST_ID,
                    autoplay: 0,
                    controls: 0,
                },
                events: {
                    onReady: () => setIsReady(true),

                    onStateChange: (event: any) => {
                        setIsPlaying(
                            event.data === window.YT.PlayerState.PLAYING
                        );

                        try {
                            const data = playerRef.current.getVideoData();
                            if (data?.title) setTrackTitle(data.title);
                        } catch {}
                    },
                },
            });
        };

        if (window.YT && window.YT.Player) {
            createPlayer();
        } else {
            window.onYouTubeIframeAPIReady = createPlayer;
        }
    }, []);

    const togglePlay = () => {
        if (!playerRef.current) return;
        isPlaying
            ? playerRef.current.pauseVideo()
            : playerRef.current.playVideo();
    };

    const skipNext = () => playerRef.current?.nextVideo();
    const skipPrev = () => playerRef.current?.previousVideo();

    return (
        <div
            className="
                flex items-center gap-3
                w-full max-w-[280px]
                px-4 py-2
                rounded-2xl

                bg-white/80
                border border-black/10
                backdrop-blur-xl

                shadow-[0_8px_30px_rgb(0,0,0,0.12)]
            "
        >
            {/* hidden youtube player */}
            <div ref={containerRef} style={{ display: 'none' }} />

            {/* prev */}
            <button
                onClick={skipPrev}
                disabled={!isReady}
                className="text-black/60 hover:text-black transition disabled:opacity-30"
            >
                ⏮
            </button>

            {/* play/pause */}
            <button
                onClick={togglePlay}
                disabled={!isReady}
                className="text-black hover:scale-110 transition"
            >
                {isPlaying ? '⏸' : '▶'}
            </button>

            {/* next */}
            <button
                onClick={skipNext}
                disabled={!isReady}
                className="text-black/60 hover:text-black transition disabled:opacity-30"
            >
                ⏭
            </button>

            {/* title */}
            <span className="text-black/80 text-[11px] truncate flex-1">
                {trackTitle}
            </span>
        </div>
    );
}