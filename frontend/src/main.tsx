import { RouterProvider, createBrowserRouter } from "react-router-dom"
import ReactDOM from "react-dom/client"
import Home from "./routes/Home"
import React from "react"
import "./styles/index.css"
import Signin from "./routes/Auth/Signin"
import Register from "./routes/Auth/Register"
import Forgot from "./routes/Auth/Forgot"
import App from "./routes/App/App"
import { ToastProvider } from "./providers/ToastProvider"
import Menu from "./routes/App/Menu"
import Category from "./routes/App/Category"
import Profile from "./routes/App/Profile"
import { CookiesProvider } from "react-cookie"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/auth",
        element: <Signin />,
    },
    {
        path: "/auth/register",
        element: <Register />,
    },
    {
        path: "/auth/forgot",
        element: <Forgot />,
    },
    {
        path: "/app",
        element: <App />,
    },
    {
        path: "/app/menus",
        element: <Menu />,
    },
    {
        path: "/app/categories",
        element: <Category />,
    },
    {
        path: "/app/profile",
        element: <Profile />,
    },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
            <ToastProvider>
                <RouterProvider router={router} />
            </ToastProvider>
        </CookiesProvider>
    </React.StrictMode>
)
