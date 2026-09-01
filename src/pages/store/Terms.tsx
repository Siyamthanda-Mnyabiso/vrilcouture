// src/pages/store/Terms.tsx

const SECTIONS: {
    title: string;
    paragraphs?: string[];
    list?: string[];
}[] = [
    {
        title: '1. About Vril Couture',
        paragraphs: [
            'Vril Couture is a South African fashion brand offering premium apparel and accessories through our online store.',
        ],
    },
    {
        title: '2. Acceptance of Terms',
        paragraphs: [
            'By using this website, creating an account or placing an order, you confirm that you have read, understood and accepted these Terms & Conditions.',
            'If you do not agree with these Terms, please do not use our website.',
        ],
    },
    {
        title: '3. Products',
        paragraphs: [
            'We make every effort to ensure that product descriptions, colours, sizing and images are as accurate as possible.',
            'Please note that colours may vary slightly depending on your screen or device settings.',
            'All products are subject to availability.',
        ],
    },
    {
        title: '4. Pricing',
        paragraphs: [
            'All prices displayed on our website are in South African Rand (ZAR).',
            'Prices are subject to change without prior notice.',
            'Any promotional pricing is available only for the period advertised.',
        ],
    },
    {
        title: '5. Orders',
        paragraphs: [
            'Once an order has been placed, you will receive an order confirmation email.',
            'Acceptance of your order occurs once payment has been successfully processed and your order has been confirmed.',
            'Vril Couture reserves the right to decline or cancel any order where necessary, including in cases of pricing errors, suspected fraud or stock unavailability.',
            'If an order is cancelled after payment has been received, a full refund will be processed.',
        ],
    },
    {
        title: '6. Payments',
        paragraphs: [
            'We accept secure online payment methods available during checkout.',
            'All payments are processed through trusted third-party payment providers.',
            'Vril Couture does not store your payment card information.',
        ],
    },
    {
        title: '7. Shipping',
        paragraphs: [
            'Delivery timeframes are estimates and may vary due to courier delays, public holidays or circumstances beyond our control.',
            'Please refer to our Shipping Policy for full delivery information.',
        ],
    },
    {
        title: '8. Returns & Exchanges',
        paragraphs: [
            'Returns and exchanges are governed by our Returns Policy.',
            'Please review our Returns Policy before requesting a return or exchange.',
        ],
    },
    {
        title: '9. Promotions & Discount Codes',
        paragraphs: ['Promotional offers and discount codes:'],
        list: [
            'Cannot be exchanged for cash.',
            'May not be combined unless stated otherwise.',
            'May have expiry dates.',
            'May exclude selected products.',
            'Vril Couture reserves the right to withdraw promotions at any time.',
        ],
    },
    {
        title: '10. Intellectual Property',
        paragraphs: ['All content on this website, including but not limited to:'],
        list: [
            'Logos',
            'Branding',
            'Product designs',
            'Photography',
            'Graphics',
            'Videos',
            'Written content',
            'Website design',
        ],
    },
    {
        title: '11. User Conduct',
        paragraphs: ['You agree not to:'],
        list: [
            'Use the website for unlawful purposes.',
            'Attempt to gain unauthorised access to our systems.',
            'Upload malicious software or harmful code.',
            'Interfere with the operation or security of the website.',
        ],
    },
    {
        title: '12. Limitation of Liability',
        paragraphs: [
            'To the fullest extent permitted by law, Vril Couture shall not be liable for any indirect, incidental or consequential loss arising from the use of our website or products.',
            'Nothing in these Terms excludes any rights that consumers have under applicable South African law.',
        ],
    },
    {
        title: '13. Privacy',
        paragraphs: [
            'Your personal information is collected and processed in accordance with our Privacy Policy and applicable South African privacy legislation.',
            'We are committed to protecting your information and will never sell your personal data to third parties.',
        ],
    },
    {
        title: '14. Changes to These Terms',
        paragraphs: [
            'Vril Couture reserves the right to amend these Terms & Conditions at any time.',
            'Updated versions will be published on this website and become effective immediately upon publication.',
        ],
    },
    {
        title: '15. Governing Law',
        paragraphs: [
            'These Terms & Conditions are governed by the laws of the Republic of South Africa.',
            'Any disputes arising from the use of this website shall be subject to the jurisdiction of the South African courts.',
        ],
    },
];

export const Terms = () => {
    return (
        <main>
            {/* HERO */}
            <section className="px-6 md:px-12 py-20 md:py-28 border-b border-black">
                <h1 className="font-display text-4xl md:text-6xl font-light uppercase tracking-tight mb-4 max-w-3xl">
                    Terms &amp; Conditions
                </h1>
                <p className="text-black/40 text-xs uppercase tracking-[0.3em] mb-6">
                    Last Updated: July 2026
                </p>
                <p className="text-black/60 text-sm md:text-base max-w-xl">
                    Welcome to Vril Couture. By accessing or using our website, you agree
                    to be bound by these Terms &amp; Conditions. Please read them
                    carefully before placing an order.
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
                            16. Contact Us
                        </h2>
                        <p className="text-black/60 text-sm leading-relaxed mb-3">
                            If you have any questions regarding these Terms &amp;
                            Conditions, please contact us:
                        </p>
                        <p className="text-black/60 text-sm leading-relaxed mb-1">
                            Email:{' '}
                            <a
                                href="mailto:vrilcouture@gmail.com"
                                className="underline hover:text-black"
                            >
                                vrilcouture@gmail.com
                            </a>
                        </p>
                        <p className="text-black/60 text-sm leading-relaxed mb-3">
                            Phone: 021 211 0063
                        </p>
                        <p className="text-black/60 text-sm leading-relaxed">
                            We are committed to providing excellent customer service and
                            will do our best to assist you as quickly as possible.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};
