import { ReactNode } from "react"
import Header from "../components/Header"

type Props = {
    children: ReactNode
}

export default function LandingPageLayout({ children }: Props) {
    return (
        <div className="container mx-auto">
            <Header />
            {children}
        </div>
    )
}
