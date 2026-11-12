import { useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
    className?: string;
}

export const Input = ({
                          label,
                          error,
                          icon,
                          iconPosition = 'left',
                          className = '',
                          id,
                          type,
                          ...props
                      }: InputProps) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    // Every password field gets a show/hide toggle, hidden by default.
    const isPassword = type === 'password';
    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPassword && showPassword ? 'text' : type;

    const baseStyles = `
    w-full px-4 py-3 bg-white border rounded-none
    text-black placeholder-gray-400
    focus:outline-none focus:ring-1 focus:ring-black focus:border-black
    transition-all duration-200
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-black'}
    ${icon && iconPosition === 'left' ? 'pl-11' : ''}
    ${(icon && iconPosition === 'right') || isPassword ? 'pr-11' : ''}
  `;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-black tracking-wide uppercase mb-2"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && iconPosition === 'left' && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
                )}
                <input
                    id={inputId}
                    type={inputType}
                    className={baseStyles}
                    {...props}
                />
                {icon && iconPosition === 'right' && !isPassword && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
                )}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};
