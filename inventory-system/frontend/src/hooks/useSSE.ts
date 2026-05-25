import { useEffect, useRef } from 'react'
import { useNotificationStore } from '../store/notificationStore'
import { getAuthStore } from '../store/authStore'

const buildUrl = (): string => {
  const token = getAuthStore().accessToken
  return `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/api/v1/events/notifications?token=${encodeURIComponent(token)}`
}

export const useSSE = (): void => {
  const retries = useRef(0)
  const addNotification = useNotificationStore((state) => state.addNotification)

  useEffect(() => {
    let source: EventSource | null = null

    const connect = (): void => {
      source = new EventSource(buildUrl())

      source.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          addNotification(payload)
        } catch {
          // ignore invalid payloads
        }
      }

      source.onerror = () => {
        if (source) {
          source.close()
        }
        retries.current += 1
        const timeout = Math.min(retries.current * 1000, 30000)
        setTimeout(connect, timeout)
      }
    }

    connect()

    return () => {
      if (source) {
        source.close()
      }
    }
  }, [addNotification])
}
