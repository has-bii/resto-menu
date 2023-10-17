import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Logo from "./Logo"
import {
    faArrowRightFromBracket,
    faHome,
    faList,
    faTableColumns,
    faUser,
    faUtensils,
} from "@fortawesome/free-solid-svg-icons"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useCookies } from "react-cookie"

const NavItems = [
    {
        title: "Dashboard",
        icon: faHome,
        path: "/app",
    },
    {
        title: "Menu",
        icon: faUtensils,
        path: "/app/menus",
    },
    {
        title: "Category",
        icon: faList,
        path: "/app/categories",
    },
]

const NavSettingItems = [
    {
        title: "Profile",
        icon: faUser,
        path: "/app/profile",
    },
]

export default function Navbar() {
    const [show, setShow] = useState(true)
    const location = useLocation()
    const [, , removeCookie] = useCookies(["user_access"])
    const navigate = useNavigate()

    const logoutHandler = () => {
        removeCookie("user_access")
        navigate("/auth")
    }

    return (
        <div className="navbar-container">
            <div className="navbar-header">
                <Logo show={show} />
                {show && (
                    <button
                        className="text-neutral-500 w-8 h-8 border rounded-lg hover:border-0 hover:text-white hover:bg-black"
                        onClick={() => setShow(false)}
                    >
                        <FontAwesomeIcon icon={faTableColumns} />
                    </button>
                )}
            </div>

            <ul className="navbar-list">
                {NavItems.map((item, i) => (
                    <li key={i} className="group/nav">
                        <Link
                            to={item.path}
                            className={`nav-item group-hover/nav:bg-orange-100 ${
                                location.pathname === item.path ? "active" : ""
                            }`}
                        >
                            <span className="nav-icon group-hover/nav:bg-orange-500 group-hover/nav:border-0 group-hover/nav:text-white">
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                />
                            </span>
                            {show && (
                                <span className="nav-item-title group-hover/nav:text-orange-500">
                                    {item.title}
                                </span>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>

            <ul className="navbar-list mt-auto">
                {NavSettingItems.map((item, i) => (
                    <li key={i} className="group/nav">
                        <Link
                            to={item.path}
                            className={`nav-item group-hover/nav:bg-orange-100 ${
                                location.pathname === item.path ? "active" : ""
                            }`}
                        >
                            <span className="nav-icon group-hover/nav:bg-orange-500 group-hover/nav:border-0 group-hover/nav:text-white">
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                />
                            </span>
                            {show && (
                                <span className="nav-item-title group-hover/nav:text-orange-500">
                                    {item.title}
                                </span>
                            )}
                        </Link>
                    </li>
                ))}
                <li className="group/nav">
                    <button
                        onClick={logoutHandler}
                        className="nav-item group-hover/nav:bg-orange-100"
                    >
                        <span className="nav-icon group-hover/nav:bg-orange-500 group-hover/nav:border-0 group-hover/nav:text-white">
                            <FontAwesomeIcon
                                icon={faArrowRightFromBracket}
                                className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                            />
                        </span>
                        {show && (
                            <span className="nav-item-title group-hover/nav:text-orange-500">
                                Logout
                            </span>
                        )}
                    </button>
                </li>
            </ul>
        </div>
    )
}
