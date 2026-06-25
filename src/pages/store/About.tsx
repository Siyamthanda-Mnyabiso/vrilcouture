// src/pages/store/About.tsx
import { Link } from 'react-router-dom';

export const About = () => {
    return (
        <main>
            {/* HERO */}
            <section className="px-6 md:px-12 py-20 md:py-28 border-b border-black">
                <h1 className="font-display text-4xl md:text-6xl font-light uppercase tracking-tight mb-6 max-w-3xl">
                    Built On Structure.
                    Worn With Presence.
                </h1>
                <p className="text-black/60 text-sm md:text-base max-w-xl">
                    Vril Couture is a study in form — clothing made for people who think
                    about what they put on their body before they put it on.
                </p>
            </section>

            {/* STORY */}
            <section className="px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-12 border-b border-black">
                <div>
                    <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tight mb-4">
                        The Archive
                    </h2>
                    <p className="text-black/60 text-sm leading-relaxed mb-4">
                        Every piece begins as a question about silhouette, not trend.
                        We design in small batches, release with intention, and avoid
                        chasing seasons for their own sake.
                    </p>
                    <p className="text-black/60 text-sm leading-relaxed">
                        What stays constant across every collection is a commitment to
                        construction — fabric weight, drape, and the kind of detailing
                        that only shows up after you've worn something a hundred times.
                    </p>
                </div>
                <img
                    src="/categories/3.jpeg"
                    alt="Vril Couture studio"
                    className="w-full h-full object-cover rounded-lg max-h-[420px]"
                />
            </section>

            {/* VALUES */}
            <section className="px-6 md:px-12 py-16 md:py-24 border-b border-black">
                <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tight mb-10 text-center">
                    What We Stand On
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-4xl mx-auto text-center">
                    <div>
                        <h3 className="text-xs font-bold tracking-wider mb-3">CRAFT</h3>
                        <p className="text-black/60 text-sm leading-relaxed">
                            Small runs, real fabric, considered fit.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold tracking-wider mb-3">RESTRAINT</h3>
                        <p className="text-black/60 text-sm leading-relaxed">
                            Fewer pieces, designed to last beyond a single season.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold tracking-wider mb-3">PRESENCE</h3>
                        <p className="text-black/60 text-sm leading-relaxed">
                            Clothing that holds its shape, on you and off the rack.
                        </p>
                    </div>
                </div>
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