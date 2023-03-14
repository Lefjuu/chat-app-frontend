import { useState } from "react"
import { Link } from "react-router-dom"
import { useAppContext } from "../context/appContext"
import Logo from "../assets/shiba.png"
import { ToastContainer, toast } from "react-toastify"

const ResetPasswordRequest = () => {
    const { sendEmail } = useAppContext()

    const [email, setEmail] = useState("")

    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!email) {
            toast.error("Email is required.", toastOptions)
            return
        }
        const res = await sendEmail(email)
        console.log(res)
        if (res.status !== 200 && res.response.status === 500) {
            toast.error(res.response.data.message, toastOptions)
        } else {
            toast.success("Email Sended! Check your e-mail", toastOptions)
        }
    }

    return (
        <>
            <div className="login">
                <form action="" onSubmit={onSubmit}>
                    <div className="login-brand">
                        <img src={Logo} alt="logo" />
                        <h1>Messenger</h1>
                    </div>
                    <h1>Problems with log in ?</h1>
                    <input
                        onChange={(e) => handleChange(e)}
                        className="password__input"
                        name="email"
                        placeholder="Email"
                        value={email}
                    />
                    <button type="submit" className="password__btn">
                        Send link to create new password
                    </button>
                    <span>
                        Don't have an account? &nbsp;
                        <Link to="/register">Create One.</Link>
                    </span>
                </form>
            </div>
            <ToastContainer />
        </>
    )
}
export default ResetPasswordRequest
