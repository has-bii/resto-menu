import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ToastIcon from "./ToastIcon"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

type ToastStatus = "danger" | "error" | "normal" | "success"

type ToastData = {
    message: string
    status: ToastStatus
}

type Props = {
    toasts: ToastData[]
    delToast: (toast: ToastData) => void
}

export default function Toast({ toasts, delToast }: Props) {
    return (
        <div className="toast-container">
            {toasts.map((toast, id) => (
                <div key={id} className={`toast-item ${toast.status}`}>
                    <ToastIcon status={toast.status} />

                    <p>{toast.message}</p>

                    <button onClick={() => delToast(toast)}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
            ))}
        </div>
    )
}
