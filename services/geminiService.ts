// This service now acts as a client-side wrapper for our backend's Gemini API endpoint.
import { Product, Message } from '../types';

/**
 * @description Generates a product description by calling our secure backend endpoint.
 * @param {string} productName - The name of the product.
 * @param {string} category - The category of the product.
 * @returns {Promise<string>} A compelling marketing description.
 */
export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
    try {
        const token = sessionStorage.getItem('admin_token');
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                type: 'description',
                payload: { productName, category }
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to generate description from server.');
        }

        const data = await response.json();
        return data.text;

    } catch (error) {
        console.error("Error in generateProductDescription service:", error);
        throw error;
    }
};

/**
 * @description Generates a realistic brand review by calling our secure backend endpoint.
 * @param {string} keywords - Keywords or a theme for the review.
 * @returns {Promise<{ author: string; quote: string }>} An object containing the author and quote.
 */
export const generateBrandReview = async (keywords: string): Promise<{ author: string; quote: string }> => {
    try {
        const token = sessionStorage.getItem('admin_token');
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                type: 'review',
                payload: { keywords }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to generate review from server.');
        }
        
        // The response from our API is already the JSON we need
        return await response.json();

    } catch (error) {
        console.error("Error in generateBrandReview service:", error);
        throw error;
    }
};

/**
 * @description Gets a response from the AI advisor by calling our secure backend endpoint.
 * @param {Message[]} messages - The chat history.
 * @param {Product[]} allProducts - All products to provide context.
 * @returns {Promise<string>} The AI's response.
 */
export const getAdvisorResponse = async (messages: Message[], allProducts: Product[]): Promise<string> => {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'advisor',
                payload: { messages, allProducts }
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to get advisor response from server.');
        }

        const data = await response.json();
        return data.text;

    } catch (error) {
        console.error("Error in getAdvisorResponse service:", error);
        throw error;
    }
};