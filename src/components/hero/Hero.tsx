export function Hero() {
    return (
        <section className="relative h-screen bg-black overflow-hidden">

            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/videos/hero_vid.mp4" type="video/mp4" />
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