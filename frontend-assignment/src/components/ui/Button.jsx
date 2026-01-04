import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        const btn = buttonRef.current;

        const handleMouseEnter = () => {
            gsap.to(btn, { scale: 1.05, duration: 0.2, ease: "power1.out" });
        };

        const handleMouseLeave = () => {
            gsap.to(btn, { scale: 1, duration: 0.2, ease: "power1.out" });
        };

        const handleMouseDown = () => {
            gsap.to(btn, { scale: 0.95, duration: 0.1, ease: "power1.out" });
        };

        const handleMouseUp = () => {
            gsap.to(btn, { scale: 1.05, duration: 0.1, ease: "power1.out" }); // Return to hover scale
        };

        btn.addEventListener('mouseenter', handleMouseEnter);
        btn.addEventListener('mouseleave', handleMouseLeave);
        btn.addEventListener('mousedown', handleMouseDown);
        btn.addEventListener('mouseup', handleMouseUp);

        return () => {
            btn.removeEventListener('mouseenter', handleMouseEnter);
            btn.removeEventListener('mouseleave', handleMouseLeave);
            btn.removeEventListener('mousedown', handleMouseDown);
            btn.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const baseStyles = "px-6 py-2 rounded-xl font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30",
        secondary: "bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500 shadow-lg shadow-slate-500/30",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-lg shadow-red-500/30",
        emerald: "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500 shadow-lg shadow-emerald-500/30",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-800"
    };

    return (
        <button
            ref={buttonRef}
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
