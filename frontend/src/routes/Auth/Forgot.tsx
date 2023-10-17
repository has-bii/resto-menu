import AuthLayout from "../../layouts/AuthLayout"
import { Link } from "react-router-dom"
import image from "../../images/register-img.jpg"

export default function Forgot() {
    return (
        <AuthLayout image={image}>
            <div className="card-head">Forgot your password?</div>
            <div className="card-subhead">No worries, we'll send you reset instructions</div>

            <form className="auth-form">
                <label htmlFor="email-input">Email</label>
                <input type="email" id="email-input" placeholder="Enter your email" />
                <button className="px-4 py-2 rounded-3xl bg-orange-500 text-white font-semibold mt-2 hover:shadow-md hover:shadow-orange-500/50 transition-all duration-200 ease-in-out">
                    Reset Password
                </button>
                <Link
                    to={"/auth"}
                    className="px-4 py-2 rounded-3xl font-semibold border border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500 text-center hover:shadow-md hover:shadow-orange-500/50 transition-all duration-200 ease-in-out"
                >
                    Back to Login
                </Link>
                <div className="text-center text-neutral-400 mt-1">
                    Don't have an account?{" "}
                    <Link
                        to={"/auth/register"}
                        className="font-semibold text-orange-500 hover:underline underline-offset-2"
                    >
                        Sign Up
                    </Link>
                </div>
            </form>
        </AuthLayout>
    )
}
