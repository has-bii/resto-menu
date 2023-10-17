import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import Toast from "../components/Toast"

type Props = {
    children: ReactNode
}

type ToastStatus = "danger" | "error" | "normal" | "success"

type ToastData = {
    message: string
    status: ToastStatus
}

const ToastContext = createContext<{
    pushToast: (message: string, status: ToastStatus) => void
}>({ pushToast: () => {} })

export function ToastProvider({ children }: Props) {
    const [toasts, setToasts] = useState<ToastData[]>([])
    const [to, setTo] = useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (toasts.length > 0) {
            if (to) {
                clearTimeout(to)
                setTo(null)
            }

            setTo(setTimeout(() => setToasts(toasts.slice(1, toasts.length)), 2000))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toasts])

    function pushToast(message: string, status: ToastStatus) {
        setToasts((prev) => [...prev, { message, status }])
    }

    function delToast(toast: ToastData) {
        setToasts(toasts.filter((item) => JSON.stringify(item) !== JSON.stringify(toast)))
    }

    return (
        <ToastContext.Provider value={{ pushToast }}>
            {toasts.length !== 0 && <Toast toasts={toasts} delToast={delToast} />}
            {children}
        </ToastContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext)
