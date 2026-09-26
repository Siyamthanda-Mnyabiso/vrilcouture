import { useParallax } from '../../hooks/useParallax';

export function Hero() {
    const { ref, offset } = useParallax<HTMLElement>(0.2);

    return (
        <section ref={ref} className="relative h-screen bg-black overflow-hidden">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute -inset-y-[30%] inset-x-0 w-full h-[160%] object-cover will-change-transform"
                style={{ transform: `translate3d(0, ${offset}px, 0)` }}
            >
                <source
                    src="https://stream.mux.com/AuTOGe1xpr0102MaHp1abrgj1jwJ01bojNouGXGdtOzTLM/high.mp4"
                    type="video/mp4"
                />
            </video>

            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />

            <div className="relative z-10 h-full flex items-center justify-center">

                <h1 className="
                    font-display
                    text-white
                    uppercase
                    text-[13vw]
                    leading-none
                    tracking-[0.15em]
                    font-light
                ">
                    VRIL
                </h1>

            </div>


            <div className="
                absolute bottom-12
                left-0
                right-0
                flex
                justify-center
            ">
                <p className="
                    text-white/60
                    uppercase
                    text-xs
                    tracking-[0.8em]
                ">
                    Couture
                </p>
            </div>

        </section>
    );
}
