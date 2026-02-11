import React from 'react';

// Define props that are common to both button and anchor
interface CommonProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'solid' | 'light' | 'secondary';
}

// Define props specific to each element type, making them optional.
type ButtonSpecificProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AnchorSpecificProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

// Combine them into a single polymorphic type
export type ButtonProps = CommonProps & (ButtonSpecificProps | AnchorSpecificProps);

/**
 * @description A reusable, styled button component that supports multiple visual variants.
 * Aligned with Stats Technical Sportswear branding (Black/White, Sharp/Technical).
 */
const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'solid', ...props }) => {
    // Defines the core layout and interaction styles of the button.
    const baseClasses = "inline-flex items-center justify-center py-3 px-8 text-xs md:text-sm uppercase font-bold tracking-[0.2em] rounded-md transition-all duration-300 ease-out active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-center font-oswald";
    
    // Defines styles for different visual variants.
    const primaryClasses = "bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white hover:text-black"; // Transparent/Glass
    const solidClasses = "bg-black text-white border border-transparent hover:bg-zinc-800 shadow-lg hover:shadow-xl"; // Primary CTA (Black)
    const lightClasses = "bg-white text-black border border-zinc-200 hover:border-black hover:bg-zinc-50 shadow-sm"; // Secondary CTA (White)
    const secondaryClasses = "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-black"; // Tertiary
    
    let variantClasses = '';
    switch (variant) {
        case 'solid': variantClasses = solidClasses; break;
        case 'light': variantClasses = lightClasses; break;
        case 'secondary': variantClasses = secondaryClasses; break;
        case 'primary': variantClasses = primaryClasses; break;
        default: variantClasses = solidClasses;
    }

    const combinedClasses = `${baseClasses} ${variantClasses} ${className}`;

    // Render as an anchor tag if 'href' is present
    if ('href' in props && props.href) {
        return (
            <a {...(props as AnchorSpecificProps)} className={combinedClasses}>
                {children}
            </a>
        );
    }

    // Otherwise, render as a button
    return (
        <button {...(props as ButtonSpecificProps)} className={combinedClasses}>
            {children}
        </button>
    );
};

export default Button;