import { toast, ToastOptions } from "react-toastify";

type ToastType = 'success' | 'error' | 'info' | 'warning'

export const showToast = (message: string, type: ToastType = 'success', options: ToastOptions = {}): void => {
    const defaultOptions: ToastOptions = {
        position: 'top-center',
        autoClose: 2000,
        theme: 'dark',
    }

    const toastOptions = { ...defaultOptions, ...options }

    switch (type) {
        case 'success':
            toast.success(message, toastOptions)
            break
        case 'error':
            toast.error(message, toastOptions)
            break
        case 'info':
            toast.info(message, toastOptions)
            break
        case 'warning':
            toast.warning(message, toastOptions)
            break
        default:
            toast(message, toastOptions)
            break
    }
}
