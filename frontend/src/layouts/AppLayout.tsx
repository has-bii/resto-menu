import { ReactNode, useEffect } from "react"
import Navbar from "../components/Navbar"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"

type Props = {
    children: ReactNode
}

export default function AppLayout({ children }: Props) {
    const [cookies] = useCookies(["user_access"])
    const navigate = useNavigate()

    useEffect(() => {
        if (!cookies.user_access) navigate("/auth")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="w-screen h-screen flex flex-row divide-x">
            <div className="w-auto h-full">
                <Navbar />
            </div>
            <div className="grow h-full overflow-auto">{children}</div>
        </div>
    )
}
