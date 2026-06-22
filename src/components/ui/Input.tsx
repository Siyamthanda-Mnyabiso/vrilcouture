import type { InputHTMLAttributes, ReactNode } from 'react';

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
                          ...props
                      }: InputProps) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const baseStyles = `
    w-full px-4 py-3 bg-white border rounded-none
    text-black placeholder-gray-400
    focus:outline-none focus:ring-1 focus:ring-black focus:border-black
    transition-all duration-200
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-black'}
    ${icon && iconPosition === 'left' ? 'pl-11' : ''}
    ${icon && iconPosition === 'right' ? 'pr-11' : ''}
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
                    className={baseStyles}
                    {...props}
                />
                {icon && iconPosition === 'right' && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};