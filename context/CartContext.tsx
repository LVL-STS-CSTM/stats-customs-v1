
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { QuoteItem, Product, Color } from '../types';

/**
 * @interface QuoteContextType
 * @description Defines the shape of the context that will be provided to consumers.
 */
interface QuoteContextType {
    quoteItems: QuoteItem[];
    addToQuote: (
        product: Product, 
        color: Color, 
        sizeQuantities: { [key: string]: number }, 
        logoFile?: File, 
        designFile?: File, 
        customizations?: { name: string; number: string; size: string }[],
        printLocations?: number,
        unitPrice?: number
    ) => void;
    removeFromQuote: (quoteItemId: string) => void;
    clearQuote: () => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [quoteItems, setQuoteItems] = useState<QuoteItem[]>(() => {
        try {
            const localData = localStorage.getItem('quoteItems');
            if (localData) {
                return JSON.parse(localData);
            }
        } catch (error) {
            console.error("Could not parse quote items from localStorage", error);
        }
        return [];
    });

    useEffect(() => {
        try {
            const itemsToStore = quoteItems.map(item => {
                const { logoFile, designFile, ...rest } = item;
                return rest;
            });
            localStorage.setItem('quoteItems', JSON.stringify(itemsToStore));
        } catch (error) {
            console.error("Could not save quote items to localStorage", error);
        }
    }, [quoteItems]);

    const addToQuote = (
        product: Product, 
        color: Color, 
        sizeQuantities: { [key: string]: number }, 
        logoFile?: File, 
        designFile?: File, 
        customizations?: { name: string; number: string; size: string }[],
        printLocations: number = 1,
        unitPrice: number = product.price || 0
    ) => {
        const isCustomizableItem = product.category === 'Custom Jerseys' && customizations && customizations.length > 0;
        const quoteItemId = isCustomizableItem
            ? `custom-${product.id}-${color.name}-${Date.now()}`
            : `${product.id}-${color.name}-${printLocations}`; // Unique per print location count too
        
        setQuoteItems(prevItems => {
            const existingItemIndex = !isCustomizableItem
                ? prevItems.findIndex(item => item.quoteItemId === quoteItemId)
                : -1;
            
            if (existingItemIndex > -1) {
                const updatedItems = [...prevItems];
                const existingItem = updatedItems[existingItemIndex];
                const newSizeQuantities = { ...existingItem.sizeQuantities };

                for (const size in sizeQuantities) {
                    newSizeQuantities[size] = (newSizeQuantities[size] || 0) + sizeQuantities[size];
                }
                
                updatedItems[existingItemIndex] = {
                    ...existingItem,
                    sizeQuantities: newSizeQuantities,
                    unitPrice: unitPrice, // Update price based on latest volume
                    logoFile: logoFile || existingItem.logoFile,
                    designFile: designFile || existingItem.designFile,
                };
                return updatedItems;

            } else {
                const newItem: QuoteItem = {
                    quoteItemId,
                    product,
                    selectedColor: color,
                    sizeQuantities,
                    printLocations,
                    unitPrice,
                    logoFile,
                    designFile,
                    customizations,
                };
                return [...prevItems, newItem];
            }
        });
    };

    const removeFromQuote = (quoteItemId: string) => {
        setQuoteItems(prevItems => prevItems.filter(item => item.quoteItemId !== quoteItemId));
    };
    
    const clearQuote = () => {
        setQuoteItems([]);
    };

    return (
        <QuoteContext.Provider value={{ quoteItems, addToQuote, removeFromQuote, clearQuote }}>
            {children}
        </QuoteContext.Provider>
    );
};

export const useQuote = (): QuoteContextType => {
    const context = useContext(QuoteContext);
    if (context === undefined) {
        throw new Error('useQuote must be used within a QuoteProvider');
    }
    return context;
};
