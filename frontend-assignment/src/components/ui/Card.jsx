import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const Card = ({ children, className = '', hoverEffect = false, ...props }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        if (!hoverEffect) return;

        const card = cardRef.current;
        const handleMouseEnter = () => {
            gsap.to(card, { y: -5, duration: 0.3, ease: 'power2.out' });
        };
        const handleMouseLeave = () => {
            gsap.to(card, { y: 0, duration: 0.3, ease: 'power2.out' });
        };

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [hoverEffect]);

    return (
        <div
            ref={cardRef}
            className={`bg-white rounded-xl shadow-lg border border-slate-100 p-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
