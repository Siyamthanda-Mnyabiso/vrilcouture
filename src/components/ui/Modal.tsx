import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  className?: string;
}

export const Modal = ({
                        isOpen,
                        onClose,
                        children,
                        title,
                        size = 'md',
                        closeOnOverlayClick = true,
                        className = '',
                      }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
          closeOnOverlayClick &&
          modalRef.current &&
          !modalRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnOverlayClick]);

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div
            ref={modalRef}
            className={`
          w-full ${sizeStyles[size]} bg-[#F5F1EA] shadow-lg
          animate-in fade-in zoom-in duration-200
          ${className}
        `}
        >
          {title && (
              <div className="flex items-center justify-between p-6 border-b border-[#D5C9B9]">
                <h2 className="text-xl font-medium text-[#2C2420] tracking-wide uppercase">
                  {title}
                </h2>
                <button
                    onClick={onClose}
                    className="text-[#8A8378] hover:text-[#2C2420] transition-colors"
                    aria-label="Close modal"
                >
                  <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                  >
                    <path
                        strokeLinecap="square"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
  );
};