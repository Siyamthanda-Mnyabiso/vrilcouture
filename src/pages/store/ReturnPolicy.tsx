// src/pages/store/ReturnPolicy.tsx

const SECTIONS: {
    title: string;
    paragraphs?: string[];
    list?: string[];
}[] = [
    {
        title: 'Returns',
        paragraphs: [
            'You may request a return within 14 days of receiving your order.',
            'To be eligible for a return, your item must:',
        ],
        list: [
            'Be unworn and unused.',
            'Be in its original condition.',
            'Have all original tags attached.',
            'Be returned in its original packaging where possible.',
            'Be free from perfume, deodorant, makeup, stains, pet hair or any signs of wear.',
        ],
    },
    {
        title: 'Exchanges',
        paragraphs: [
            'Need a different size?',
            'We gladly offer exchanges, subject to stock availability.',
            'If your preferred size is unavailable, you may choose another item of equal value or receive a store credit.',
        ],
    },
    {
        title: 'Faulty or Incorrect Items',
        paragraphs: [
            'If you receive an item that is faulty, damaged or incorrect, please contact us within 7 days of delivery.',
            'Once assessed and approved, we will replace the item or provide a full refund where applicable.',
            'Please include your order number together with clear photographs of the issue when contacting us.',
        ],
    },
    {
        title: 'Non-Returnable Items',
        paragraphs: [
            'For hygiene and quality assurance reasons, the following items cannot be returned unless they are faulty:',
        ],
        list: [
            'Socks',
            'Gift cards',
            'Sale or clearance items',
            'Promotional or discounted items marked "Final Sale"',
            'Custom or personalised products',
        ],
    },
    {
        title: 'Refunds',
        paragraphs: [
            'Once your return has been received and inspected, we will notify you of the outcome.',
            'If approved, refunds will be processed to your original payment method within 5–10 business days, depending on your payment provider.',
            'Original shipping fees are non-refundable unless the return is due to our error or a faulty product.',
        ],
    },
    {
        title: 'Return Shipping',
        paragraphs: [
            'Customers are responsible for the cost of returning items unless:',
        ],
        list: [
            'The incorrect item was sent.',
            'The item is faulty.',
            'The item was damaged during delivery.',
        ],
    },
    {
        title: 'How to Start a Return',
        paragraphs: ['To request a return or exchange, please contact us with:'],
        list: [
            'Your order number',
            'Your full name',
            'The reason for the return',
            'Photos (if the item is faulty or damaged)',
        ],
    },
];

export const ReturnPolicy = () => {
    return (
        <main>
            {/* HERO */}
            <section className="px-6 md:px-12 py-20 md:py-28 border-b border-black">
                <h1 className="font-display text-4xl md:text-6xl font-light uppercase tracking-tight mb-6 max-w-3xl">
                    Returns &amp; Exchanges
                </h1>
                <p className="text-black/60 text-sm md:text-base max-w-xl">
                    At Vril Couture, we take pride in the quality of every garment we
                    produce. If your order isn't quite right, we're here to help.
                </p>
            </section>

            {/* SECTIONS */}
            <section className="px-6 md:px-12 py-16 md:py-24 max-w-3xl mx-auto">
                <div className="space-y-12">
                    {SECTIONS.map(({ title, paragraphs, list }) => (
                        <div key={title}>
                            <h2 className="font-display text-xl md:text-2xl uppercase tracking-tight mb-4">
                                {title}
                            </h2>
                            {paragraphs?.map((paragraph, i) => (
                                <p
                                    key={i}
                                    className="text-black/60 text-sm leading-relaxed mb-3 last:mb-0"
                                >
                                    {paragraph}
                                </p>
                            ))}
                            {list && (
                                <ul className="list-disc list-inside space-y-2 mt-3">
                                    {list.map((item) => (
                                        <li
                                            key={item}
                                            className="text-black/60 text-sm leading-relaxed"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}

                    <div>
                        <h2 className="font-display text-xl md:text-2xl uppercase tracking-tight mb-4">
                            Questions?
                        </h2>
                        <p className="text-black/60 text-sm leading-relaxed">
                            If you have any questions about your order, we're always
                            happy to help. Contact us at{' '}
                            <a
                                href="mailto:admin@vrilcouture.co.za"
                                className="underline hover:text-black"
                            >
                                admin@vrilcouture.co.za
                            </a>
                            , and we'll get back to you as soon as possible.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};
