/**
 * @description Central registry for image-based assets used as icons.
 * Place your PNG/JPG files in the /public/icons/ directory and update paths here.
 */
export const ICON_ASSETS = {
    social: {
        facebook: '/icons/facebook.png',
        instagram: '/icons/instagram.png',
        threads: '/icons/threads.png',
        tiktok: '/icons/tiktok.png',
        linkedin: '/icons/linkedin.png',
        mail: '/icons/mail.png',
    },
    ui: {
        search: '/icons/search-icon.png',
        user: '/icons/user-icon.png',
        cart: '/icons/cart-icon.png',
    },
    // Add more categories as needed (e.g., trust badges, payment methods)
    trust: {
        bdo: '/icons/bdo-logo.png',
        gcash: '/icons/gcash-logo.png',
        bpi: '/icons/bpi-logo.png',
    }
};
