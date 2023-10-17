import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom"

export default function Navigation() {
    const navigate = useNavigate()

    return (
        <div className="inline-flex gap-2 items-center">
            <button
                onClick={() => navigate(-1)}
                className="w-8 h-8 border rounded-full border-neutral-500"
            >
                <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <button
                onClick={() => navigate(1)}
                className="w-8 h-8 border rounded-full border-neutral-500"
            >
                <FontAwesomeIcon icon={faAngleRight} />
            </button>
        </div>
    )
}
