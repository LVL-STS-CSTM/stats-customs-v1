
/**
 * @interface Color
 * @description Represents a color option for a product.
 */
export interface Color {
    name: string;
    hex: string;
}

/**
 * @interface ProductSize
 * @description Represents a size option with specific dimensions.
 */
export interface ProductSize {
    name: string;
    width: number;    length: number;
}

/**
 * @interface Product
 * @description Represents a single product in the catalogue.
 */
export interface Product {
    id: string;
    name: string;
    imageUrls: { [colorName: string]: string[] };
    url: string;
    isBestseller: boolean;
    description: string;
    availableSizes: ProductSize[];
    availableColors: Color[];
    category: string;
    categoryGroup: string; 
    gender: 'Men' | 'Women' | 'Unisex';
    displayOrder: number;
    materialId?: string;
    moq?: number;
    price?: number; 
    priceTiers?: { minQty: number; discount: number }[]; 
    mockupImageUrl?: string;
    mockupArea?: { top: number; left: number; width: number; height: number };
    // NEW FIELDS FOR v2.1
    leadTimeWeeks?: number;   // For custom products
    supportedPrinting?: string[]; // e.g. ["Sublimation", "Embroidery"]
}

/**
 * @interface Collection
 * @description Represents a group of products.
 */
export interface Collection {
    id: string;
    name: string;
    imageUrl: string;
    description?: string;
    displayOrder: number;
}

/**
 * @interface QuoteItem
 * @description Represents an item that has been added to the user's quote request list.
 */
export interface QuoteItem {
    quoteItemId: string;
    product: Product;
    selectedColor: Color;
    sizeQuantities: { [key: string]: number };
    printLocations: number; 
    unitPrice: number; 
    logoFile?: File;
    designFile?: File;
    customizations?: { name: string; number: string; size: string }[];
}

/**
 * @interface Material
 * @description Represents a single material or fabric.
 */
export interface Material {
    id: string;
    name: string;
    imageUrl: string;
    description: string;
    features: string[];
    careImageUrl?: string;
}

/**
 * @type View
 * @description Defines the possible page views for the application's router.
 */
export type View = 'home' | 'product' | 'catalogue' | 'browse' | 'about' | 'partners' | 'contact' | 'faq' | 'admin' | 'services' | 'terms-of-service' | 'return-policy' | 'privacy-policy' | 'materials' | 'community' | 'how-we-work' | 'mockup-generator' | 'track-project' | 'checkout';

/**
 * @interface PageBanner
 * @description Stores header content for internal pages.
 */
export interface PageBanner {
    id: string;
    page: View;
    title: string;
    description: string;
    imageUrl: string;
}

/**
 * @interface HomeFeatureTab
 * @description Represents a specific tab/slide in the home feature section.
 */
export interface HomeFeatureTab {
    label: string;
    imageUrl: string;
}

/**
 * @interface HomeFeature
 * @description Represents the "Custom Uniforms" feature section on the homepage.
 */
export interface HomeFeature {
    id: string;
    tagline: string;
    headline: string;
    description: string;
    imageUrl: string;
    tabs: HomeFeatureTab[]; // List of feature slides/tabs with specific images
    isVisible: boolean;
}

/**
 * @interface Partner
 * @description Represents a partner company with a name and logo.
 */
export interface Partner {
    id: string;
    name: string;
    logoUrl: string;
}

/**
 * @interface FaqItem
 * @description Represents a single question-answer pair for the FAQ page.
 */
export interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

/**
 * @interface HeroContent
 * @description Represents the content for a hero banner section.
 */
export interface HeroContent {
    id: string;
    mediaSrc: string;
    mediaType: 'video' | 'image' | 'gif';
    title: string;
    description: string;
    buttonText?: string;
    buttonCollectionLink?: string;
    displayOrder: number;
    featuredProductIds?: string[];
    featuredProductsTitle?: string;
}

/**
 * @interface HowWeWorkSection
 * @description Represents the content for a section on the "How We Work" page.
 */
export interface HowWeWorkSection {
    id: 'sample-testing' | 'small-batch' | 'sustainability';
    title: string;
    description: string;
    imageUrl: string;
}

/**
 * @interface Service
 * @description Represents a major service solution block.
 */
export interface Service {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    includedItems: string[];
    displayOrder: number;
}

/**
 * @interface Capability
 * @description Represents a specific specialized capability card.
 */
export interface Capability {
    id: string;
    title: string;
    description: string;
    iconName: 'DesignIcon' | 'BriefcaseIcon' | 'PrintingIcon' | 'PackagingIcon' | 'LogisticsIcon' | 'ProductionIcon' | 'TargetIcon' | 'SparklesIcon' | 'ChatIcon';
    displayOrder: number;
}

export type QuoteStatus = 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Cancelled';

export interface SubmittedQuoteItem {
    product: Product;
    selectedColor: Color;
    sizeQuantities: { [key: string]: number };
    printLocations?: number;
    unitPrice?: number;
    logoFilename?: string;
    designFilename?: string;
    customizations?: { name: string; number: string; size: string }[];
}

export interface QuoteContact {
    name: string;
    email: string;
    company?: string;
    message?: string;
    phone: string;
}

export interface SubmittedQuote {
    id: string;
    submissionDate: string;
    contact: QuoteContact;
    items: SubmittedQuoteItem[];
    status: QuoteStatus;
    submissionType?: string; // New field from API
}

export interface Subscription {
    email: string;
    date: string;
}

export interface EmailCampaign {
    id: string;
    subject: string;
    content: string;
    sentDate: string;
    recipientCount: number;
    recipientSegment: 'all' | 'recent';
}

export type InfoCardLinkType = 'page' | 'modal' | 'external';

export interface InfoCard {
    id: string;
    title: string;
    imageUrl: string;
    linkType: InfoCardLinkType;
    linkValue: string;
    displayOrder?: number;
    description?: string;
}

export interface FeaturedVideoContent {
    isVisible: boolean;
    title: string;
    description: string;
    youtubeVideoUrl: string;
}

export interface BrandReview {
    id: string;
    author: string;
    quote: string;
    rating: number;
    isVisible: boolean;
    imageUrl?: string;
}

export type PlatformName = 'Google' | 'Facebook' | 'Yelp' | 'Trustpilot' | 'LinkedIn';

export interface PlatformRating {
    id: string;
    platform: PlatformName;
    rating: number;
    reviewCount: number;
    url: string;
    isVisible: boolean;
}

export type CommunityPostSource = 'Instagram' | 'Facebook' | 'Client Submission';

export interface CommunityPost {
    id: string;
    imageUrl: string;
    caption: string;
    author: string;
    source: CommunityPostSource;
    taggedProductId?: string;
    isVisible: boolean;
}

export interface SubscriptionModalContent {
    title: string;
    description: string;
    imageUrl: string;
}

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}
