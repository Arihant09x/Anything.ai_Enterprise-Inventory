import React from 'react';

const Input = ({ label, type = 'text', id, placeholder, value, onChange, required = false, className = '', error }) => {
    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-slate-700 font-medium mb-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}
          bg-white/50 backdrop-blur-sm
        `}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default Input;
