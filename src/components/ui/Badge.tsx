import type { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    dot?: boolean;
}

export const Badge = ({
                          children,
                          variant = 'default',
                          size = 'md',
                          className = '',
                          dot = false,
                      }: BadgeProps) => {
    const variantStyles = {
        default: 'bg-[#6B5D4F] text-white',
        success: 'bg-green-600 text-white',
        warning: 'bg-amber-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
    };

    const sizeStyles = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    };

    return (
        <span
            className={`
        inline-flex items-center gap-1.5 font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
        >
      {dot && (
          <span
              className={`
            inline-block rounded-full
            ${size === 'sm' ? 'h-1.5 w-1.5' : size === 'md' ? 'h-2 w-2' : 'h-2.5 w-2.5'}
            ${variant === 'default' ? 'bg-white/80' : 'bg-white/60'}
          `}
          />
      )}
            {children}
    </span>
    );
};