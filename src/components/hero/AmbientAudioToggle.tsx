import { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const TARGET_VOLUME = 0.5;
const FADE_DURATION_MS = 1500;

export function AmbientAudioToggle() {
    const [muted, setMuted] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);
    const fadeIntervalRef = useRef<number | null>(null);

    const clearFade = () => {
        if (fadeIntervalRef.current !== null) {
            window.clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
        }
    };

    const fadeIn = (audio: HTMLAudioElement) => {
        clearFade();
        audio.volume = 0;

        const steps = 30;
        const stepTime = FADE_DURATION_MS / steps;
        const volumeStep = TARGET_VOLUME / steps;
        let currentStep = 0;

        fadeIntervalRef.current = window.setInterval(() => {
            currentStep++;
            audio.volume = Math.min(volumeStep * currentStep, TARGET_VOLUME);

            if (currentStep >= steps) {
                clearFade();
            }
        }, stepTime);
    };

    const fadeOutAndPause = (audio: HTMLAudioElement) => {
        clearFade();
        const startVolume = audio.volume;
        const steps = 20;
        const stepTime = 400 / steps;
        const volumeStep = startVolume / steps;
        let currentStep = 0;

        fadeIntervalRef.current = window.setInterval(() => {
            currentStep++;
            audio.volume = Math.max(startVolume - volumeStep * currentStep, 0);

            if (currentStep >= steps) {
                clearFade();
                audio.pause();
            }
        }, stepTime);
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (muted) {
            // Jump to a random point in the track before playing
            if (audio.duration && isFinite(audio.duration)) {
                audio.currentTime = Math.random() * audio.duration;
            }

            audio.volume = 0;
            audio.play()
                .then(() => fadeIn(audio))
                .catch(() => {
                    // Should not happen — this runs inside a real click handler
                });
        } else {
            fadeOutAndPause(audio);
        }

        setMuted(!muted);
    };

    return (
        <>
            <audio ref={audioRef} loop>
                <source src="/audio/ambient.mp3" type="audio/mpeg" />
            </audio>

            <button
                onClick={toggleMute}
                aria-label={muted ? 'Unmute ambient sound' : 'Mute ambient sound'}
                className="text-black hover:opacity-60 transition-opacity"
            >
                {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
        </>
    );
}