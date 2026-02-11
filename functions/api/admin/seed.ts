import { initialProductsData, initialCollectionsData } from '../../../context/initialProductData';
import { 
    initialFaqData, 
    initialHeroData, 
    initialPartnerData, 
    initialHowWeWorkData, 
    initialMaterialData, 
    initialInfoCardData, 
    initialFeaturedVideoData, 
    initialBrandReviewData, 
    initialPlatformRatingData, 
    initialCommunityPostData,
    initialPageBannerData,
    initialServiceData,
    initialCapabilityData,
    initialSubscriptionModalData,
    initialHomeFeatureData
} from '../../../context/initialContentData';

interface Env {
  STATSCUSTOMSDATA: any;
  ADMIN_SECRET: string;
  ALLOW_SEED: string;
}

const DATA_TO_SEED: Record<string, any> = {
    products: initialProductsData,
    collections: initialCollectionsData,
    faqs: initialFaqData,
    heroContents: initialHeroData,
    partners: initialPartnerData,
    howWeWorkSections: initialHowWeWorkData,
    materials: initialMaterialData,
    infoCards: initialInfoCardData,
    featuredVideoContent: initialFeaturedVideoData,
    brandReviews: initialBrandReviewData,
    platformRatings: initialPlatformRatingData,
    communityPosts: initialCommunityPostData,
    pageBanners: initialPageBannerData,
    services: initialServiceData,
    capabilities: initialCapabilityData,
    subscriptionModalContent: initialSubscriptionModalData,
    homeFeature: initialHomeFeatureData
};

export const onRequestGet = async (context: { env: Env; request: Request }) => {
    const { request, env } = context;

    // Check if seeding is allowed via env var
    if (env.ALLOW_SEED !== 'true') {
        return new Response('Seeding disabled. Set ALLOW_SEED=true in dashboard.', { status: 403 });
    }

    // Basic Authentication Check
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
        return new Response('Authentication required', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
        });
    }
    
    // Default credentials for first-time use
    let validUser = 'admin';
    let validPass = 'password';

    try {
        const storedCredsRaw = await env.STATSCUSTOMSDATA.get('credential');
        if (storedCredsRaw) {
            const creds = JSON.parse(storedCredsRaw);
            validUser = creds.username || validUser;
            validPass = creds.password || validPass;
        }
    } catch (e) {
        console.error("Credential parse failed, using defaults.");
    }

    const auth = atob(authHeader.split(' ')[1]);
    const [user, pass] = auth.split(':');

    if (user !== validUser || pass !== validPass) {
        return new Response('Invalid credentials', { status: 401 });
    }

    // Seeding Logic
    try {
        let count = 0;
        const keys = Object.keys(DATA_TO_SEED);

        for (const key of keys) {
            const data = DATA_TO_SEED[key];
            await env.STATSCUSTOMSDATA.put(key, JSON.stringify(data));
            count++;
        }

        // Initialize credentials if they don't exist
        const hasCreds = await env.STATSCUSTOMSDATA.get('credential');
        if (!hasCreds) {
            await env.STATSCUSTOMSDATA.put('credential', JSON.stringify({ username: 'admin', password: 'password' }));
            count++;
        }

        const successMessage = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 40px; border: 1px solid #e5e7eb; border-radius: 24px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #10b981; font-size: 24px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px;">Database Seeding Successful!</h1>
                <p style="color: #4b5563; line-height: 1.6;">Successfully synchronized ${count} data keys to your Cloudflare KV store.</p>
                <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 24px 0;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Default Credentials:</p>
                    <p style="margin: 8px 0 0 0; font-family: monospace; font-weight: bold; color: #111827;">admin / password</p>
                </div>
                <p style="color: #ef4444; font-size: 0.85em; font-weight: bold;">SECURITY NOTICE: Log in to the admin panel immediately to update these credentials.</p>
            </div>
        `;
        
        return new Response(successMessage, { 
            status: 200, 
            headers: { 'Content-Type': 'text/html' }
        });

    } catch (error: any) {
        return new Response(`<h1>Seeding Failed</h1><p>${error.message}</p>`, { 
            status: 500, 
            headers: { 'Content-Type': 'text/html' }
        });
    }
};