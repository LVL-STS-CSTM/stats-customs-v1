
import { View } from '../types';

/**
 * @description Centralized routing logic for semantic path construction and parsing.
 * Updated to use History API (Path-based routing) instead of Hash routing.
 */
export const Router = {
    /**
     * Constructs a URL path string for navigation.
     */
    getPath: (page: View, params?: { group?: string; id?: string; color?: string; type?: string; value?: string }): string => {
        if (!page || page === 'home') return '/';
        
        // Semantic Product Path: /Collection/ID/Color
        if (page === 'product' && params?.id) {
            const group = params.group || 'catalogue';
            let path = `/${encodeURIComponent(group)}/${encodeURIComponent(params.id)}`;
            if (params.color) path += `/${encodeURIComponent(params.color)}`;
            return path;
        }

        // Semantic Filter Paths: /catalogue/category/value or /catalogue/gender/value
        if (page === 'catalogue' && params?.type && params?.value) {
            return `/catalogue/${params.type}/${encodeURIComponent(params.value)}`;
        }

        // Semantic Catalogue Path (Collection Group): /Collection
        if (page === 'catalogue' && params?.group) {
            return `/${encodeURIComponent(params.group)}`;
        }
        
        // Standard pages
        return `/${page}`;
    },

    /**
     * Parses the current pathname into structured state components.
     */
    parseUrl: (pathname: string, knownViews: string[], knownGroups: string[]) => {
        const cleanPath = pathname.replace(/^\/+/, '').replace(/\/+$/, ''); // Remove leading/trailing slashes
        
        if (!cleanPath || cleanPath === 'home') {
            return { page: 'home' as View, filter: null, id: null, color: null, group: null };
        }

        const parts = cleanPath.split('/').map(p => decodeURIComponent(p));
        const firstPart = parts[0];

        // 1. Check if first part is a Collection Name (Group) e.g. /Performance
        if (knownGroups.includes(firstPart)) {
            if (parts.length === 1) {
                return {
                    page: 'catalogue' as View,
                    filter: { type: 'group' as const, value: firstPart },
                    id: null, color: null, group: firstPart
                };
            }
            if (parts.length >= 2) {
                // e.g. /Performance/jersey-01
                return {
                    page: 'product' as View,
                    filter: null,
                    id: parts[1],
                    color: parts[2] || null,
                    group: firstPart
                };
            }
        }

        // 2. Check if first part is a static view or explicit 'catalogue'
        if (knownViews.includes(firstPart) || firstPart === 'catalogue') {
            if (firstPart === 'catalogue') {
                // Handle /catalogue/category/Jersey or /catalogue/gender/Men
                if (parts[1] && parts[2]) {
                    const filterType = parts[1] as 'category' | 'gender';
                    return { 
                        page: 'catalogue' as View, 
                        filter: { type: filterType, value: parts[2] },
                        id: null, color: null, group: null 
                    };
                }
                return { page: 'catalogue' as View, filter: null, id: null, color: null, group: null };
            }
            return { page: firstPart as View, filter: null, id: null, color: null, group: null };
        }

        // Fallback
        return { page: 'home' as View, filter: null, id: null, color: null, group: null };
    }
};
