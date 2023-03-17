import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/appContext"
import { useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import Logo from "../assets/shiba.png"

const initialState = {
    password: "",
    confirmPassword: "",
}

let url = window.location.pathname
url = url.replace("/new-password/", "")

const NewPassword = () => {
    const { changePassword } = useAppContext()
    const navigate = useNavigate()

    const [values, setValues] = useState(initialState)

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    }

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        const { password, confirmPassword } = values
        if (password !== confirmPassword) {
            toast.error(
                "Password and confirm password should be same.",
                toastOptions
            )
            return false
        }
        const res = await changePassword({
            string: url,
            password,
        })
        if (res.status !== 202 && res.response.status === 500) {
            toast.error(res.response.data.message, toastOptions)
        } else {
            toast.success("New password has been set", toastOptions)
        }
        setTimeout(() => {
            navigate("/login")
        }, 5000)
    }

    return (
        <>
            <div className="password">
                <div className="password__container">
                    <div className="password__logo">
                        <img src={Logo} alt="logo" />
                    </div>
                    <h3 className="password__title"> Password change </h3>
                    <p className="password__paragraph">
                        Changing the password for the account:
                    </p>
                    <p className="password__email"> </p>
                    <form onSubmit={onSubmit}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={values.password}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={values.confirmPassword}
                            onChange={handleChange}
                        />
                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}
export default NewPassword
