
import { FaqItem, HeroContent, Partner, HowWeWorkSection, Material, InfoCard, FeaturedVideoContent, BrandReview, PlatformRating, CommunityPost, PageBanner, Service, Capability, SubscriptionModalContent, HomeFeature } from '../types';

export const initialFaqData: FaqItem[] = [
    { id: 'faq-1', question: 'What types of custom apparel do you offer?', answer: 'We specialize in high-performance jerseys, technical training wear, corporate essentials, and lifestyle headwear. Every piece is engineered for durability and style.' },
    { id: 'faq-2', question: 'What is your minimum order quantity (MOQ)?', answer: 'Ready-to-Order items have no MOQ. For Custom Projects, we typically start at 24 pieces for basic apparel and 12 pieces for specialized teamwear.' },
    { id: 'faq-3', question: 'How long does production take?', answer: 'Our standard lead time is 14 business days from design approval. Rush services are available for select collections.' },
    { id: 'faq-4', question: 'Do you offer international shipping?', answer: 'Yes. We provide nationwide delivery in the Philippines and global logistics for international clients.' },
    { id: 'faq-5', question: 'What file formats do you need for branding?', answer: 'Vector files (AI, EPS, SVG) provide the sharpest results. High-resolution PNGs are also accepted for specific printing methods.' },
];

export const initialHeroData: HeroContent[] = [
    {
        id: 'primary',
        mediaSrc: 'https://i.imgur.com/6yO1M5P.png',
        mediaType: 'image',
        title: 'THE STANDARD OF PERFORMANCE',
        description: 'Locally crafted technical apparel for those who demand excellence. We combine precision engineering with the spirit of Filipino craftsmanship.',
        displayOrder: 0,
        buttonText: 'EXPLORE GEAR',
        buttonCollectionLink: 'browse',
        featuredProductsTitle: 'CORE ESSENTIALS',
        featuredProductIds: ['jersey-01', 'comp-top-01', 'hoodie-01', 'bottom-01'],
    },
];

export const initialPartnerData: Partner[] = [
    { id: 'partner-1', name: 'Elite Sports PH', logoUrl: 'https://logo.clearbit.com/nike.com' },
    { id: 'partner-2', name: 'Summit Dynamics', logoUrl: 'https://logo.clearbit.com/adidas.com' },
    { id: 'partner-3', name: 'Global Logistics Inc', logoUrl: 'https://logo.clearbit.com/fedex.com' },
];

export const initialHowWeWorkData: HowWeWorkSection[] = [
    { id: 'sample-testing', title: 'TECHNICAL R&D', description: 'Every textile batch undergoes rigorous tension and colorfastness testing to ensure it survives the intensity of your pursuit.', imageUrl: 'https://images.pexels.com/photos/3910065/pexels-photo-3910065.jpeg' },
    { id: 'small-batch', title: 'CRAFTED IN-HOUSE', description: 'Our hybrid facility supports large-scale enterprise contracts and precision small-batch commissioning.', imageUrl: 'https://images.pexels.com/photos/5699479/pexels-photo-5699479.jpeg' },
];

export const initialMaterialData: Material[] = [
    { id: 'fabric-1', name: 'Vantage-Dry Tech', imageUrl: 'https://images.pexels.com/photos/5699865/pexels-photo-5699865.jpeg', description: 'Our signature lightweight textile designed for extreme moisture management and zero-distraction movement.', features: ['4-Way Stretch', 'Anti-Odor', 'UV Protection'] },
    { id: 'fabric-2', name: 'Aero-Mesh 2.0', imageUrl: 'https://images.pexels.com/photos/5699505/pexels-photo-5699505.jpeg', description: 'Maximum airflow for high-intensity output. Engineered to regulate body temperature in tropical climates.', features: ['Ultra-Breathable', 'Fast-Drying'] },
];

export const initialInfoCardData: InfoCard[] = [
    { id: 'pursuit', title: 'THE PURSUIT OF\nEXCELLENCE', imageUrl: 'https://images.pexels.com/photos/8365691/pexels-photo-8365691.jpeg', linkType: 'page', linkValue: 'about', displayOrder: 0 },
    { id: 'newsletter', title: 'JOIN THE\nINNER CIRCLE', imageUrl: 'https://images.pexels.com/photos/7679883/pexels-photo-7679883.jpeg', linkType: 'modal', linkValue: 'subscribe', displayOrder: 1 },
    { id: 'fabric', title: 'TEXTILE\nENGINEERING', imageUrl: 'https://images.pexels.com/photos/5699865/pexels-photo-5699865.jpeg', linkType: 'page', linkValue: 'materials', displayOrder: 2 },
];

export const initialFeaturedVideoData: FeaturedVideoContent = {
    isVisible: true,
    title: 'BUILT FOR THE GRIND',
    description: 'A look inside the LEVEL studio, where digital vision meets meticulous artisan execution.',
    youtubeVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
};

export const initialBrandReviewData: BrandReview[] = [
    { id: 'review-1', author: 'ELITE ATHLETICS', quote: 'LEVEL provided the most durable kits we have ever used. Performance is unmatched.', rating: 5, isVisible: false },
];

export const initialPlatformRatingData: PlatformRating[] = [
    { id: 'pr-1', platform: 'Google', rating: 4.9, reviewCount: 312, url: '#', isVisible: false },
];

export const initialCommunityPostData: CommunityPost[] = [
    { id: 'comm-1', imageUrl: 'https://images.pexels.com/photos/11115895/pexels-photo-11115895.jpeg', caption: 'Championship kits ready for deployment.', author: 'Eagles Basketball', source: 'Instagram', isVisible: true, taggedProductId: 'jersey-01' },
];

export const initialPageBannerData: PageBanner[] = [
    { id: 'pb-browse', page: 'browse', title: 'THE CATALOGUE', description: 'Curated technical systems for athletic and lifestyle utility.', imageUrl: 'https://images.pexels.com/photos/1036856/pexels-photo-1036856.jpeg' },
    { id: 'pb-catalogue', page: 'catalogue', title: 'MASTER INVENTORY', description: 'Explore our full spectrum of specialized gear.', imageUrl: 'https://images.pexels.com/photos/1036856/pexels-photo-1036856.jpeg' },
    { id: 'pb-about', page: 'about', title: 'THE NARRATIVE', description: 'A legacy of quality. A future of local excellence.', imageUrl: 'https://images.pexels.com/photos/8365691/pexels-photo-8365691.jpeg' },
    { id: 'pb-services', page: 'services', title: 'EXPERT SOLUTIONS', description: 'Strategic B2B apparel systems for global-ready brands.', imageUrl: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg' },
];

export const initialServiceData: Service[] = [
    {
        id: 's1',
        subtitle: 'PERFORMANCE SYSTEMS',
        title: 'ELITE TEAMWEAR',
        description: 'Engineered for competition. We combine high-performance textiles with aerodynamic cuts.',
        imageUrl: 'https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg',
        includedItems: ['Match Kits', 'Warmups', 'Compression Gear'],
        displayOrder: 0
    },
];

export const initialCapabilityData: Capability[] = [
    { id: 'cap1', iconName: 'DesignIcon', title: 'Strategic Design', description: 'Full visual identity systems applied to technical apparel.', displayOrder: 0 },
];

export const initialSubscriptionModalData: SubscriptionModalContent = {
    title: 'Join The Inner Circle',
    description: 'Get exclusive access to new arrivals, special offers, and behind-the-scenes content.',
    imageUrl: 'https://images.pexels.com/photos/7679883/pexels-photo-7679883.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
};

export const initialHomeFeatureData: HomeFeature = {
    id: 'home-feat-1',
    tagline: 'Durable, professional, & fully customizable',
    headline: 'Custom Polo Shirt Uniforms for Companies',
    description: 'We are a trusted polo shirt uniform supplier and custom uniform maker in the Philippines offering company uniforms, office polos, and branded workwear with logos, bulk production, and nationwide delivery.',
    imageUrl: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    tabs: [
        { label: 'Custom Uniforms', imageUrl: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg' },
        { label: 'Company Jackets', imageUrl: 'https://images.pexels.com/photos/6311604/pexels-photo-6311604.jpeg' },
        { label: 'Custom Bags', imageUrl: 'https://images.pexels.com/photos/1485031/pexels-photo-1485031.jpeg' },
        { label: 'Custom Tumblers', imageUrl: 'https://images.pexels.com/photos/3764510/pexels-photo-3764510.jpeg' }
    ],
    isVisible: true
};
