import { toast } from 'vue-sonner'

export interface ToastOptions {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
}

export function useToast() {
  const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(options?.title || message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration,
    })
  }

  const showError = (message: string, options?: ToastOptions) => {
    toast.error(options?.title || message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration,
    })
  }

  const showWarning = (message: string, options?: ToastOptions) => {
    toast.warning(options?.title || message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration,
    })
  }

  const showInfo = (message: string, options?: ToastOptions) => {
    toast.info(options?.title || message, {
      description: options?.description,
      action: options?.action,
      duration: options?.duration,
    })
  }

  const showPromise = <T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    }
  ) => {
    return toast.promise(promise, messages)
  }

  return {
    toast, // toast original de vue-sonner
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPromise,
  }
}