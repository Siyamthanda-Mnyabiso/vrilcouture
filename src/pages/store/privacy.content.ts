// Wording supplied by Vril Couture. Get their approval before changing it.

export type PolicyBlock =
    | { type: 'text'; text: string }
    | { type: 'subheading'; text: string }
    | { type: 'list'; items: string[] };

export interface PolicySection {
    title: string;
    blocks: PolicyBlock[];
}

const text = (value: string): PolicyBlock => ({ type: 'text', text: value });
const subheading = (value: string): PolicyBlock => ({ type: 'subheading', text: value });
const list = (...items: string[]): PolicyBlock => ({ type: 'list', items });

export const LAST_UPDATED = '26 November 2026';

export const SECTIONS: PolicySection[] = [
    {
        title: 'Our commitment to your privacy',
        blocks: [
            text('At Vril Couture, we value the trust you place in us. We are committed to protecting your personal information and respecting your privacy whenever you interact with our brand, visit our website or purchase our products.'),
            text('This Privacy and Cookie Policy explains how Vril Couture collects, uses, stores, shares and protects your personal information when you visit www.vrilcouture.co.za or engage with our products, services and digital platforms.'),
            text('We are committed to handling personal information responsibly and in accordance with applicable South African legislation, including the Protection of Personal Information Act, 4 of 2013 (POPIA).'),
        ],
    },
    {
        title: 'Personal information we collect',
        blocks: [
            text('Depending on how you interact with Vril Couture, we may collect the following information:'),
            subheading('Personal and contact information'),
            list(
                'First name and surname',
                'Email address',
                'Contact number',
                'Billing and delivery addresses',
            ),
            subheading('Account and purchase information'),
            list(
                'Customer account details',
                'Order and purchase history',
                'Product preferences and clothing sizes',
                'Returns, exchanges and refund information',
                'Payment method and transaction references',
            ),
            subheading('Website and device information'),
            list(
                'IP address',
                'Browser and device type',
                'Website browsing activity',
                'Approximate geographical location',
                'Products viewed and items added to your shopping cart',
                'Interactions with our advertisements and marketing campaigns',
            ),
            subheading('Communication information'),
            list(
                'Customer service enquiries',
                'Product reviews and feedback',
                'Marketing preferences',
                'Communications through email, social media or other customer service channels',
            ),
        ],
    },
    {
        title: 'How we collect your information',
        blocks: [
            text('We may collect personal information when you:'),
            list(
                'Visit or browse our website.',
                'Create a customer account.',
                'Place an order or complete a purchase.',
                'Subscribe to our newsletter.',
                'Contact our customer support team.',
                'Participate in competitions, promotions or surveys.',
                'Interact with our social media platforms or digital advertisements.',
                'Submit product reviews or feedback.',
            ),
            text('Certain information may also be collected automatically through cookies, analytics tools and similar technologies, or received from service providers assisting with payments, deliveries and website operations.'),
        ],
    },
    {
        title: 'How we use your personal information',
        blocks: [
            text('We process your personal information for legitimate business purposes, including:'),
            list(
                'Processing and fulfilling your orders.',
                'Facilitating payments, deliveries, returns and refunds.',
                'Providing customer assistance.',
                'Managing your customer account.',
                'Improving our website, products and shopping experience.',
                'Understanding customer preferences and purchasing trends.',
                'Communicating relevant product launches, exclusive offers and promotions where legally permitted.',
                'Measuring the effectiveness of our advertising campaigns.',
                'Detecting and preventing fraud or unauthorised activity.',
                'Complying with legal, regulatory and financial obligations.',
            ),
            text('We process personal information where necessary to fulfil our contractual obligations, comply with the law, pursue legitimate interests permitted by law or where we have obtained your consent.'),
            text('Providing certain personal information is necessary to complete a purchase. Without this information, we may be unable to process your order or deliver your products. Providing information for optional marketing communications is voluntary.'),
        ],
    },
    {
        title: 'Payment information',
        blocks: [
            text('Online payments are facilitated through third-party payment service providers.'),
            text('Payment information is processed in accordance with the applicable security standards and privacy policies of the selected payment provider.'),
            text('We may receive transaction confirmations, payment references and payment status information necessary to process your order or resolve payment-related enquiries.'),
            text('Customers should never share their banking passwords, card PINs or one-time passwords directly with Vril Couture.'),
        ],
    },
    {
        title: 'Marketing and promotional communications',
        blocks: [
            text('We may send you communications relating to:'),
            list(
                'New collections and product launches',
                'Exclusive offers and discounts',
                'Upcoming events and brand activations',
                'Brand news and announcements',
                'Special promotions and seasonal campaigns',
            ),
            text('Electronic marketing communications will only be sent where we have obtained your consent or where otherwise permitted under applicable legislation, including the requirements relating to existing customers.'),
            text('You may unsubscribe from marketing communications at any time by selecting the unsubscribe option provided in our emails or by contacting us directly.'),
            text('Unsubscribing from marketing communications will not affect essential order confirmations, delivery notifications or other communications relating to purchases you have made.'),
        ],
    },
    {
        title: 'Cookies and tracking technologies',
        blocks: [
            text('Our website may use cookies, tracking pixels and similar technologies to improve functionality, understand customer behaviour and provide a more relevant online shopping experience.'),
            text('Cookies are small data files stored on your device when you visit a website.'),
            text('We may use the following categories of cookies:'),
            subheading('Essential cookies'),
            text('These support the core functionality of our website, including shopping carts, account access, checkout processes and website security.'),
            subheading('Functional cookies'),
            text('These help us remember your preferences and provide a more personalised browsing experience.'),
            subheading('Analytics and performance cookies'),
            text('These help us understand how visitors interact with our website, identify technical issues and improve website performance.'),
            subheading('Advertising and marketing cookies'),
            text('These may help us deliver relevant advertisements, measure campaign performance and reconnect with visitors who have previously interacted with our website or products.'),
            subheading('Third-party cookies'),
            text('Certain cookies may be placed by external service providers that support our website, analytics, advertising or e-commerce functionality.'),
            text('Where required by law, we will obtain your consent before using non-essential cookies or tracking technologies.'),
            text("You may manage your cookie preferences through your browser settings or through our website's cookie preference controls, where available."),
            text('Disabling certain cookies may affect your ability to access some website features.'),
        ],
    },
    {
        title: 'Sharing your personal information',
        blocks: [
            text('We may share relevant personal information with third-party service providers that assist us in operating our business and delivering our services.'),
            text('These may include:'),
            list(
                'E-commerce and website hosting providers',
                'Payment processing companies',
                'Courier and logistics partners',
                'Customer support service providers',
                'Email marketing platforms',
                'Advertising and analytics providers',
                'Professional advisers and regulatory authorities, where necessary',
            ),
            text('Information is shared for specified business purposes and subject to applicable privacy obligations.'),
            text('We may also disclose personal information where legally required, to investigate fraudulent activity, protect our legal rights or facilitate a lawful business restructuring or transfer.'),
        ],
    },
    {
        title: 'International data transfers',
        blocks: [
            text('Some of the technology platforms and service providers supporting our business may process or store personal information outside South Africa.'),
            text('Where personal information is transferred internationally, we will take appropriate steps to ensure that such transfers comply with applicable data protection legislation, including the requirements of POPIA.'),
        ],
    },
    {
        title: 'Data security',
        blocks: [
            text('We are committed to taking reasonable technical and organisational measures to protect personal information against unauthorised access, loss, misuse, alteration or disclosure.'),
            text('We will periodically review our security practices and take appropriate steps to address identified risks.'),
            text('While we take reasonable precautions to safeguard your information, no online platform or electronic transmission can be guaranteed to be completely secure.'),
            text('Should a security compromise occur, we will notify affected individuals and the relevant authorities where required by law.'),
        ],
    },
    {
        title: 'Data retention',
        blocks: [
            text('We retain personal information only for as long as reasonably necessary to fulfil the purposes for which it was collected, including:'),
            list(
                'Completing transactions and fulfilling orders.',
                'Managing customer relationships.',
                'Resolving disputes and processing returns.',
                'Meeting accounting, tax and regulatory requirements.',
                'Protecting our legitimate business interests where permitted by law.',
            ),
            text('When personal information is no longer required and there is no lawful reason to retain it, we will take reasonable steps to securely delete, destroy or de-identify it.'),
        ],
    },
    {
        title: 'Your privacy rights',
        blocks: [
            text('Subject to applicable legislation, you have the right to:'),
            list(
                'Request access to personal information we hold about you.',
                'Request correction or updating of inaccurate information.',
                'Request deletion of personal information where legally permissible.',
                'Object to certain forms of personal information processing.',
                'Withdraw consent where processing is based on consent.',
                'Opt out of direct marketing communications.',
                'Be notified of qualifying personal information security compromises.',
                'Lodge a complaint with the Information Regulator of South Africa.',
            ),
            text('We may request verification of your identity before processing a privacy-related request to protect your information.'),
        ],
    },
    {
        title: "Children's privacy",
        blocks: [
            text('Our online store is not specifically directed towards children under the age of 18.'),
            text("We do not knowingly process children's personal information unless authorised by a competent person or otherwise permitted under applicable legislation."),
            text('If you believe that a child has provided personal information without the necessary authorisation, please contact us so that we can take appropriate action.'),
        ],
    },
    {
        title: 'Third-party websites and social media',
        blocks: [
            text('Our website may contain links to external websites, payment services and social media platforms.'),
            text('These platforms operate independently and may have their own privacy policies and data collection practices.'),
            text('We encourage customers to review the privacy policies of any third-party platforms they choose to use.'),
            text('Information shared publicly through social media comments, reviews or other public platforms may be visible to other users.'),
        ],
    },
    {
        title: 'Changes to this policy',
        blocks: [
            text('Vril Couture may update this Privacy and Cookie Policy from time to time to reflect changes in our business operations, technology, services or legal obligations.'),
            text('The latest version will be available on our website, together with the applicable revision date.'),
            text('Where necessary, we will communicate material changes through appropriate channels.'),
        ],
    },
];
