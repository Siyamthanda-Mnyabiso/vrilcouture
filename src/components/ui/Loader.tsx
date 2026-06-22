interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullScreen?: boolean;
}

export const Loader = ({
                         size = 'md',
                         className = '',
                         fullScreen = false,
                       }: LoaderProps) => {
  const sizeStyles = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const spinner = (
      <div className={`${sizeStyles[size]} ${className}`}>
        <svg
            className="animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
          <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="#6B5D4F"
              strokeWidth="4"
          />
          <path
              className="opacity-75"
              fill="#6B5D4F"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </div>
  );

  if (fullScreen) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5F1EA] bg-opacity-80">
          {spinner}
        </div>
    );
  }

  return spinner;
};