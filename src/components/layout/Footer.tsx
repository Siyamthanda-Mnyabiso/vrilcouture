import { Link } from 'react-router-dom';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white">
            <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-24">

                {/* Brand block */}
                <div className="text-center mb-20">
                    <h3 className="
                        font-display
                        text-3xl md:text-4xl
                        uppercase
                        tracking-[0.6em]
                        font-light
                    ">
                        VRIL
                    </h3>

                    <p className="text-white/40 uppercase text-[10px] tracking-[0.8em] mt-4">
                        Couture
                    </p>
                </div>

                {/* Minimal link grid */}
                <div className="flex flex-col md:flex-row justify-center gap-16 md:gap-32 text-center mb-24">

                    <div>
                        <h4 className="text-white/70 text-[10px] uppercase tracking-[0.6em] mb-6">
                            Collection
                        </h4>
                        <ul className="space-y-3">
                            {['New In', 'Lookbook', 'Drops'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to="#"
                                        className="text-sm text-white/50 hover:text-white transition"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white/70 text-[10px] uppercase tracking-[0.6em] mb-6">
                            Information
                        </h4>
                        <ul className="space-y-3">
                            {['Shipping', 'Returns', 'Size Guide'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to="#"
                                        className="text-sm text-white/50 hover:text-white transition"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white/70 text-[10px] uppercase tracking-[0.6em] mb-6">
                            Contact
                        </h4>
                        <ul className="space-y-3">
                            <li className="text-sm text-white/50">
                                Cape Town
                            </li>
                            <li className="text-sm text-white/50">
                                South Africa
                            </li>
                            <li className="text-sm text-white/50">
                                info@vrilcouture.com
                            </li>
                        </ul>
                    </div>

                </div>

                {/* bottom line */}
                <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-8 gap-4">

                    <p className="text-white/30 text-xs tracking-[0.3em] uppercase">
                        © {currentYear} Vril Couture
                    </p>

                    <div className="flex gap-8 text-xs tracking-[0.3em] uppercase text-white/30">
                        <Link className="hover:text-white transition" to="#">
                            Instagram
                        </Link>
                        <Link className="hover:text-white transition" to="#">
                            Terms
                        </Link>
                        <Link className="hover:text-white transition" to="#">
                            Privacy
                        </Link>
                    </div>

                </div>

            </div>
        </footer>
    );
};