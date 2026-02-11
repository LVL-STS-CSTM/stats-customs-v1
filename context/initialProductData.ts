
import { Product, Collection } from '../types';

// Updated to ensure a purely custom/quotation experience.
export const initialProductsData: Product[] = ([
    // --- Performance Apparel ---
    {
        id: 'jersey-01',
        name: 'Pro Elite Basketball Jersey',
        price: 45.00,
        imageUrls: {
            'Home Blue': [
                "https://images.pexels.com/photos/11115895/pexels-photo-11115895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                "https://images.pexels.com/photos/159611/basketball-player-game-sport-159611.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            ],
            'Away Red': [
                "https://images.pexels.com/photos/1080884/pexels-photo-1080884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            ]
        },
        url: '#',
        isBestseller: true,
        description: 'The pinnacle of on-court performance. This full-sublimation jersey features our proprietary capillary moisture-wicking technology and reinforced double-stitched hems for elite-level durability.',
        availableSizes: [
            { name: 'S', width: 19, length: 28 },
            { name: 'M', width: 21, length: 30 },
            { name: 'L', width: 23, length: 31 },
            { name: 'XL', width: 25, length: 32 },
            { name: 'XXL', width: 27, length: 33 },
        ],
        availableColors: [ { name: 'Home Blue', hex: '#0047AB' }, { name: 'Away Red', hex: '#C41E3A' } ],
        category: 'Custom Jerseys',
        categoryGroup: 'Performance',
        gender: 'Men',
        materialId: 'fabric-1',
        moq: 12,
        mockupImageUrl: 'https://images.pexels.com/photos/11115895/pexels-photo-11115895.jpeg',
        mockupArea: { top: 25, left: 25, width: 50, height: 40 }
    },
    {
        id: 'comp-top-01',
        name: 'Battlesuit Compression LS',
        price: 38.00,
        imageUrls: {
            'Tactical Grey': ["https://images.pexels.com/photos/4047145/pexels-photo-4047145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"],
            'Stealth Black': ["https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"]
        },
        url: '#',
        isBestseller: true,
        description: 'Second-skin engineering for high-impact training. Features anatomical panelling to support muscle groups and flat-lock seams to eliminate friction during extreme physical output.',
        availableSizes: [
            { name: 'S', width: 17, length: 26 },
            { name: 'M', width: 18, length: 27 },
            { name: 'L', width: 19, length: 28 },
            { name: 'XL', width: 21, length: 29 },
        ],
        availableColors: [ { name: 'Tactical Grey', hex: '#4A4A4A' }, { name: 'Stealth Black', hex: '#000000' } ],
        category: 'Base Layers',
        categoryGroup: 'Performance',
        gender: 'Unisex',
        materialId: 'fabric-1',
        moq: 12
    },
    {
        id: 'bottom-01',
        name: 'Hybrid Training Shorts',
        price: 32.00,
        imageUrls: {
            'Stealth Black': ["https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"],
            'Deep Navy': ["https://images.pexels.com/photos/4498553/pexels-photo-4498553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"]
        },
        url: '#',
        isBestseller: true,
        description: 'Designed for the versatile athlete. Features a lightweight laser-perforated outer shell for airflow and an integrated compression liner for stability during explosive movements.',
        availableSizes: [
            { name: 'S', width: 28, length: 18 },
            { name: 'M', width: 30, length: 19 },
            { name: 'L', width: 32, length: 20 },
            { name: 'XL', width: 34, length: 21 },
        ],
        availableColors: [ { name: 'Stealth Black', hex: '#000000' }, { name: 'Deep Navy', hex: '#000080' } ],
        category: 'Bottoms',
        categoryGroup: 'Performance',
        gender: 'Men',
        materialId: 'fabric-1',
        moq: 20
    },
    {
        id: 'singlet-01',
        name: 'Velocity Aerobic Singlet',
        price: 28.00,
        imageUrls: {
            'Neon Citron': ["https://images.pexels.com/photos/3764510/pexels-photo-3764510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"],
            'Cloud White': ["https://images.pexels.com/photos/3764496/pexels-photo-3764496.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"]
        },
        url: '#',
        isBestseller: false,
        description: 'Feather-weight racing singlet optimized for track and distance running. Open-weave Mesh 2.0 side panels ensure maximum thermoregulation under heavy metabolic load.',
        availableSizes: [
            { name: 'XS', width: 17, length: 25 },
            { name: 'S', width: 18, length: 26 },
            { name: 'M', width: 20, length: 27 },
            { name: 'L', width: 22, length: 28 },
        ],
        availableColors: [ { name: 'Neon Citron', hex: '#DFFF00' }, { name: 'Cloud White', hex: '#F5F5F5' } ],
        category: 'Custom Jerseys',
        categoryGroup: 'Performance',
        gender: 'Unisex',
        materialId: 'fabric-2',
        moq: 12
    },

    // --- Apparel & Lifestyle ---
    {
        id: 'top-01',
        name: 'Classic Pro Crew Neck',
        price: 22.00,
        imageUrls: {
            'Optic White': ["https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"],
            'Deep Black': ["https://images.pexels.com/photos/1018911/pexels-photo-1018911.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"]
        },
        url: '#',
        isBestseller: true,
        description: 'Our most popular canvas. Crafted from heavyweight combed cotton with a modern relaxed fit. Pre-shrunk and side-seamed to maintain its shape even after industrial laundering.',
        availableSizes: [
            { name: 'XS', width: 16, length: 26 },
            { name: 'S', width: 18, length: 28 },
            { name: 'M', width: 20, length: 29 },
            { name: 'L', width: 22, length: 30 },
            { name: 'XL', width: 24, length: 31 },
        ],
        availableColors: [ { name: 'Optic White', hex: '#FFFFFF' }, { name: 'Deep Black', hex: '#212121' } ],
        category: 'Tops',
        categoryGroup: 'Apparel',
        gender: 'Unisex',
        moq: 24
    },
    {
        id: 'hoodie-01',
        name: 'Signature Tech Hoodie',
        price: 58.00,
        imageUrls: {
            'Slate': ["https://images.pexels.com/photos/6311604/pexels-photo-6311604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"],
            'Obsidian': ["https://images.pexels.com/photos/6311605/pexels-photo-6311605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"]
        },
        url: '#',
        isBestseller: true,
        description: 'The definitive outerwear for modern teams. Built with a premium three-panel hood and hidden media pocket. The mid-weight tech-fleece fabric provides superior warmth without the bulk.',
        availableSizes: [
            { name: 'S', width: 22, length: 27 },
            { name: 'M', width: 24, length: 28 },
            { name: 'L', width: 26, length: 29 },
            { name: 'XL', width: 28, length: 30 },
        ],
        availableColors: [ { name: 'Slate', hex: '#708090' }, { name: 'Obsidian', hex: '#0B0B0B' } ],
        category: 'Outerwear',
        categoryGroup: 'Apparel',
        gender: 'Unisex',
        materialId: 'fabric-3',
        moq: 15
    },

    // --- Accessories ---
    {
        id: 'acc-01',
        name: 'Structured Pro Trucker',
        price: 18.00,
        imageUrls: {
            'Classic Black': ["https://images.pexels.com/photos/1485031/pexels-photo-1485031.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"]
        },
        url: '#',
        isBestseller: false,
        description: 'A classic silhouette engineered with modern mesh. Features a hard buckram front panel and a snapback closure. Optimized for high-density 3D embroidery.',
        availableSizes: [ { name: 'OSFA', width: 0, length: 0 } ],
        availableColors: [ { name: 'Classic Black', hex: '#000000' } ],
        category: 'Headwear',
        categoryGroup: 'Accessories',
        gender: 'Unisex',
        moq: 24
    }
] as Omit<Product, 'displayOrder'>[]).map((p, index) => ({ ...p, displayOrder: index }));

export const initialCollectionsData: Collection[] = [
    { id: 'c1', name: 'Performance', imageUrl: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg', displayOrder: 0 },
    { id: 'c2', name: 'Apparel', imageUrl: 'https://images.pexels.com/photos/6311604/pexels-photo-6311604.jpeg', displayOrder: 1 },
    { id: 'c3', name: 'Accessories', imageUrl: 'https://images.pexels.com/photos/1485031/pexels-photo-1485031.jpeg', displayOrder: 2 },
];
