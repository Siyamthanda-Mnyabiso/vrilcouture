const categories = ['HOODIES', 'T-SHIRTS', 'SHORTS', 'SWEATERS'];

export function AnnouncementBar() {
    const repeated = [...categories, ...categories, ...categories];

    return (
        <div className="bg-black text-white py-3 overflow-hidden whitespace-nowrap">
            <div className="flex w-max animate-marquee">
                {repeated.map((cat, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-12 mx-6"
                    >
                        <span className="
                            text-xs
                            font-medium
                            uppercase
                            tracking-[0.5em]
                        ">
                            {cat}
                        </span>

                        <span className="text-white/40">✦</span>
                    </div>
                ))}
            </div>
        </div>
    );
}