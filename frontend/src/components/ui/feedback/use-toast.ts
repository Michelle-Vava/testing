import * as React from "react"
import { eventBus, EVENTS } from '@/lib/event-bus';

type ToastProps = {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

/**
 * Hook for showing toast notifications via the eventBus system
 * This integrates with ToastContext.tsx which listens for SHOW_TOAST events
 */
export function useToast() {
  const toast = React.useCallback((props: ToastProps) => {
    eventBus.emit(EVENTS.SHOW_TOAST, {
      message: props.description || props.title || '',
      type: props.variant === 'destructive' ? 'error' : 'info',
    });
  }, [])

  return { toast }
}
