import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    isLoading?: boolean;
    className?: string;
}

export const Button = ({
                           children,
                           variant = 'primary',
                           size = 'md',
                           fullWidth = false,
                           isLoading = false,
                           className = '',
                           disabled,
                           ...props
                       }: ButtonProps) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 uppercase tracking-widest text-sm';

    const variantStyles = {
        primary: 'bg-black text-white hover:bg-gray-800 active:bg-gray-900 disabled:bg-gray-400',
        secondary: 'bg-gray-100 text-black hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400',
        outline: 'border-2 border-black text-black hover:bg-black hover:text-white disabled:border-gray-300 disabled:text-gray-300',
        ghost: 'text-black hover:bg-gray-100 disabled:text-gray-400',
    };

    const sizeStyles = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
    };

    const widthStyles = fullWidth ? 'w-full' : '';
    const loadingStyles = isLoading ? 'opacity-70 cursor-wait' : '';

    return (
        <button
            className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyles}
        ${loadingStyles}
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    );
};