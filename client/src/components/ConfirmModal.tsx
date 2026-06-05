import { useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmModalProps {
    isOpen: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    onConfirm: () => void
    onCancel: () => void
    variant?: 'danger' | 'default'
    isConfirming?: boolean
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    isConfirming,
    variant = 'default',
}: ConfirmModalProps) {
    const cancelRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => cancelRef.current?.focus(), 0)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onCancel()
        }
        document.addEventListener('keydown', handleEsc)
        return () => document.removeEventListener('keydown', handleEsc)
    }, [isOpen, onCancel])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in" onClick={onCancel}>
            <div
                className="bg-white dark:bg-surface-800 rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 animate-scale-in"
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                <div className="flex items-center gap-3 mb-4">
                    <FiAlertTriangle className={`w-6 h-6 ${variant === 'danger' ? 'text-red-500' : 'text-primary-600'}`} />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        ref={cancelRef}
                        onClick={onCancel}
                        className="px-4 py-2 text-sm rounded-md bg-gray-100 dark:bg-surface-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-surface-600 transition"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        disabled={isConfirming}
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm rounded-md text-white transition disabled:opacity-50 ${
                            variant === 'danger'
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-primary-600 hover:bg-primary-700 active:scale-95'
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
