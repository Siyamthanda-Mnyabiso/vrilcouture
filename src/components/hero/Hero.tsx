// src/components/hero/Hero.tsx
import { CategoryHeroTile } from './CategoryHeroTile';
import { heroCategories } from './categoryHeroData';

const category = (area: (typeof heroCategories)[number]['area']) =>
    heroCategories.find((c) => c.area === area)!;

export function Hero() {
    const hoodies = category('hoodies');
    const tshirts = category('tshirts');
    const shorts = category('shorts');
    const sweaters = category('sweaters');
    const accessories = category('accessories');
    const newArrivals = category('newArrivals');
    const limitedEdition = category('limitedEdition');

    return (
        <section className="relative w-full bg-black">
            {/* Desktop / tablet — asymmetric editorial mosaic */}
            <div className="hidden md:grid md:grid-cols-[1.4fr_1fr_1fr] gap-[3px] p-[3px]">
                <CategoryHeroTile
                    category={hoodies}
                    className="row-span-2"
                    nameClassName="text-3xl lg:text-4xl"
                />
                <CategoryHeroTile category={tshirts} className="h-[320px]" nameClassName="text-xl lg:text-2xl" />
                <CategoryHeroTile category={shorts} className="h-[320px]" nameClassName="text-xl lg:text-2xl" />
                <CategoryHeroTile category={sweaters} className="h-[280px]" nameClassName="text-xl lg:text-2xl" />
                <CategoryHeroTile category={accessories} className="h-[280px]" nameClassName="text-xl lg:text-2xl" />

                <CategoryHeroTile
                    category={newArrivals}
                    className="col-span-3 h-[400px]"
                    nameClassName="text-4xl lg:text-5xl"
                />

                <CategoryHeroTile
                    category={limitedEdition}
                    className="col-span-3 h-[300px]"
                    nameClassName="text-3xl lg:text-4xl"
                    align="center"
                />
            </div>

            {/* Mobile — editorial vertical sequence with varying heights */}
            <div className="flex flex-col gap-[3px] p-[3px] md:hidden">
                <CategoryHeroTile category={hoodies} className="h-[440px]" nameClassName="text-2xl" />
                <CategoryHeroTile category={tshirts} className="h-[300px]" nameClassName="text-xl" />
                <CategoryHeroTile category={shorts} className="h-[260px]" nameClassName="text-xl" />
                <CategoryHeroTile category={sweaters} className="h-[300px]" nameClassName="text-xl" />
                <CategoryHeroTile category={accessories} className="h-[240px]" nameClassName="text-lg" />
                <CategoryHeroTile category={newArrivals} className="h-[360px]" nameClassName="text-3xl" />
                <CategoryHeroTile
                    category={limitedEdition}
                    className="h-[320px]"
                    nameClassName="text-2xl"
                    align="center"
                />
            </div>
        </section>
    );
}
