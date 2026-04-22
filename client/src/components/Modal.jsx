import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useEffect, useRef, useCallback } from 'react';

const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    size = 'medium', // small, medium, large, xlarge, fullscreen
    variant = 'default', // default, danger, warning, success, info
    showCloseButton = true,
    closeOnBackdropClick = true,
    closeOnEsc = true,
    showFooter = false,
    footerActions,
    isLoading = false,
    loadingText = 'Loading...',
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmDisabled = false,
    className = ''
}) => {
    const modalRef = useRef(null);
    const previousFocusRef = useRef(null);

    // Size configurations
    const sizeClasses = {
        small: 'max-w-md',
        medium: 'max-w-lg',
        large: 'max-w-2xl',
        xlarge: 'max-w-4xl',
        fullscreen: 'max-w-[95vw] h-[90vh]'
    };

    // Variant configurations
    const variantColors = {
        default: {
            border: 'border-[var(--border-strong)]',
            icon: null,
            headerBg: 'bg-[var(--card-bg)]'
        },
        danger: {
            border: 'border-red-500/30',
            icon: AlertTriangle,
            headerBg: 'bg-gradient-to-r from-red-500/10 to-transparent'
        },
        warning: {
            border: 'border-yellow-500/30',
            icon: AlertTriangle,
            headerBg: 'bg-gradient-to-r from-yellow-500/10 to-transparent'
        },
        success: {
            border: 'border-green-500/30',
            icon: CheckCircle,
            headerBg: 'bg-gradient-to-r from-green-500/10 to-transparent'
        },
        info: {
            border: 'border-blue-500/30',
            icon: Info,
            headerBg: 'bg-gradient-to-r from-blue-500/10 to-transparent'
        }
    };

    const currentVariant = variantColors[variant];
    const Icon = currentVariant.icon;

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
            modalRef.current?.focus();
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            previousFocusRef.current?.focus();
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isOpen]);

    // Handle ESC key
    const handleKeyDown = useCallback((e) => {
        if (closeOnEsc && e.key === 'Escape' && isOpen) {
            onClose();
        }
    }, [closeOnEsc, isOpen, onClose]);

    // Handle backdrop click
    const handleBackdropClick = (e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    // Add/remove event listener for ESC
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    // Focus trap
    useEffect(() => {
        if (isOpen && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            const handleTabKey = (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            lastFocusable?.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            firstFocusable?.focus();
                            e.preventDefault();
                        }
                    }
                }
            };

            document.addEventListener('keydown', handleTabKey);
            return () => document.removeEventListener('keydown', handleTabKey);
        }
    }, [isOpen]);

    // Animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const modalVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.95, 
            y: 20,
            transition: { duration: 0.2 }
        },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { 
                type: 'spring', 
                damping: 25, 
                stiffness: 300 
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.95, 
            y: 20,
            transition: { duration: 0.2 }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={handleBackdropClick}
                        className="fixed inset-0 bg-[rgba(0,0,0,0.85)] backdrop-blur-md z-[1000]"
                    />

                    {/* Modal Container */}
                    <motion.div
                        ref={modalRef}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 z-[1001] flex items-center justify-center pointer-events-none p-4 sm:p-6"
                        tabIndex={-1}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        <div className={`
                            pointer-events-auto 
                            ${sizeClasses[size]} 
                            w-full 
                            bg-[var(--card-bg)] 
                            border ${currentVariant.border}
                            rounded-2xl sm:rounded-3xl 
                            shadow-2xl 
                            relative 
                            transition-all 
                            duration-300
                            ${size === 'fullscreen' ? 'h-full flex flex-col' : 'max-h-[85vh] flex flex-col'}
                            ${className}
                        `}>
                            {/* Header */}
                            <div className={`
                                flex items-center justify-between 
                                p-4 sm:p-6 
                                border-b border-[var(--border-color)]
                                rounded-t-2xl sm:rounded-t-3xl
                                ${currentVariant.headerBg}
                            `}>
                                <div className="flex items-center gap-3">
                                    {Icon && (
                                        <div className={`
                                            p-2 rounded-xl
                                            ${variant === 'danger' ? 'bg-red-500/10 text-red-500' : ''}
                                            ${variant === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                                            ${variant === 'success' ? 'bg-green-500/10 text-green-500' : ''}
                                            ${variant === 'info' ? 'bg-blue-500/10 text-blue-500' : ''}
                                        `}>
                                            <Icon size={20} />
                                        </div>
                                    )}
                                    <h2 
                                        id="modal-title"
                                        className={`
                                            text-xl sm:text-2xl font-bold 
                                            bg-gradient-to-r from-[var(--text-main)] to-[var(--primary)] 
                                            bg-clip-text text-transparent
                                            m-0
                                        `}
                                    >
                                        {title}
                                    </h2>
                                </div>
                                
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="
                                            p-2 rounded-full 
                                            bg-[var(--element-bg)] 
                                            border border-[var(--border-color)]
                                            text-[var(--text-muted)]
                                            hover:bg-red-500/10 
                                            hover:border-red-500/30 
                                            hover:text-red-500
                                            transition-all duration-300
                                            hover:rotate-90
                                            hover:scale-110
                                            active:scale-95
                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-red-500/50
                                        "
                                        aria-label="Close modal"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            {/* Content */}
                            <div className={`
                                flex-1 
                                overflow-y-auto 
                                p-4 sm:p-6 
                                text-[var(--text-secondary)]
                                custom-scrollbar
                                ${isLoading ? 'flex items-center justify-center' : ''}
                            `}>
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full border-4 border-[var(--border-color)] border-t-[var(--primary)] animate-spin" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-3 h-3 rounded-full bg-[var(--primary)] animate-pulse" />
                                            </div>
                                        </div>
                                        <p className="mt-4 text-[var(--text-muted)]">{loadingText}</p>
                                    </div>
                                ) : (
                                    children
                                )}
                            </div>

                            {/* Footer */}
                            {(showFooter || footerActions || onConfirm || onCancel) && (
                                <div className="
                                    p-4 sm:p-6 
                                    border-t border-[var(--border-color)]
                                    bg-[var(--element-bg)]/30
                                    rounded-b-2xl sm:rounded-b-3xl
                                ">
                                    {footerActions ? (
                                        footerActions
                                    ) : (
                                        <div className="flex justify-end gap-3">
                                            {onCancel && (
                                                <button
                                                    onClick={onCancel}
                                                    className="
                                                        px-4 py-2 rounded-full
                                                        bg-[var(--element-bg)]
                                                        border border-[var(--border-color)]
                                                        text-[var(--text-muted)]
                                                        hover:bg-[var(--element-bg)]/80
                                                        hover:border-[var(--danger-color)]
                                                        hover:text-[var(--danger-color)]
                                                        transition-all duration-300
                                                    "
                                                >
                                                    {cancelText}
                                                </button>
                                            )}
                                            {onConfirm && (
                                                <button
                                                    onClick={onConfirm}
                                                    disabled={confirmDisabled}
                                                    className={`
                                                        px-6 py-2 rounded-full
                                                        font-semibold
                                                        transition-all duration-300
                                                        ${variant === 'danger' 
                                                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                                                            : variant === 'success'
                                                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                                                : 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white'
                                                        }
                                                        hover:scale-105
                                                        active:scale-95
                                                        disabled:opacity-50
                                                        disabled:cursor-not-allowed
                                                        disabled:hover:scale-100
                                                        shadow-lg
                                                        hover:shadow-xl
                                                    `}
                                                >
                                                    {confirmText}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// Confirmation Modal Helper Component
export const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            variant={variant}
            size="small"
            onConfirm={onConfirm}
            onCancel={onClose}
            confirmText={confirmText}
            cancelText={cancelText}
            showFooter={true}
        >
            <div className="text-center py-4">
                <p className="text-[var(--text-muted)]">{message}</p>
            </div>
        </Modal>
    );
};

// Loading Modal Helper Component
export const LoadingModal = ({ isOpen, message = 'Processing...' }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {}}
            title="Please Wait"
            size="small"
            showCloseButton={false}
            isLoading={true}
            loadingText={message}
        />
    );
};

// Success Modal Helper Component
export const SuccessModal = ({ isOpen, onClose, title, message }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            variant="success"
            size="small"
            onConfirm={onClose}
            confirmText="Great!"
            showFooter={true}
        >
            <div className="text-center py-4">
                <CheckCircle size={48} className="mx-auto mb-3 text-green-500" />
                <p className="text-[var(--text-muted)]">{message}</p>
            </div>
        </Modal>
    );
};

export default Modal;