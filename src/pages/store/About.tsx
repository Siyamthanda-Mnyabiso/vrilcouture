// src/pages/store/About.tsx
import { Link } from 'react-router-dom';

export const About = () => {
    return (
        <main>
            {/* HERO */}
            <section className="px-6 md:px-12 py-20 md:py-28 border-b border-black">
                <h1 className="font-display text-4xl md:text-6xl font-light uppercase tracking-tight mb-6 max-w-3xl">
                    About Vril Couture
                </h1>
                <p className="text-black/60 text-sm md:text-base max-w-xl">
                    Vril Couture is a South African fashion brand that brings together premium
                    streetwear, contemporary design and individual expression.
                </p>
            </section>

            {/* STORY */}
            <section className="px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-12 border-b border-black">
                <div className="text-black/60 text-sm leading-relaxed space-y-4">
                    <p>
                        The name Vril represents a controlled form of energy — a philosophy that
                        influences everything we create. We believe clothing is more than just what
                        you wear; it is an extension of your identity, your energy and how you choose
                        to express yourself.
                    </p>
                    <p>
                        Our collections combine bold graphics, distinctive silhouettes and premium
                        fabrics, with a strong emphasis on quality, comfort and attention to detail.
                        Rooted in South African creativity, we are passionate about supporting local
                        production while building a brand with global appeal.
                    </p>
                    <p>
                        At Vril Couture, we don't simply follow trends. We create pieces with
                        character, meaning and purpose, making premium fashion accessible to those
                        who appreciate individuality and authenticity.
                    </p>
                    <p>
                        More than a clothing brand, Vril Couture is a culture, a mindset and a
                        statement of self-expression.
                    </p>
                </div>
                <img
                    src="/categories/3.jpeg"
                    alt="Vril Couture studio"
                    className="w-full h-full object-cover rounded-lg max-h-[420px]"
                />
            </section>

            {/* TAGLINE */}
            <section className="px-6 md:px-12 py-16 md:py-24 border-b border-black text-center">
                <p className="font-display text-2xl md:text-4xl font-light uppercase tracking-tight max-w-3xl mx-auto">
                    Built in silence. Designed with purpose. Worn with power.
                </p>
            </section>

            {/* CTA */}
            <section className="py-20 px-8 md:px-12 text-center">
                <h2 className="font-display text-3xl md:text-5xl font-light uppercase tracking-tight mb-4">
                    Explore The Collection
                </h2>
                <p className="text-black/50 text-sm max-w-md mx-auto mb-8">
                    See what's currently available from the archive.
                </p>
                <Link
                    to="/shop"
                    className="inline-block bg-black text-white px-8 py-3 text-xs uppercase tracking-[0.4em]"
                >
                    Shop Now
                </Link>
            </section>
        </main>
    );
};
