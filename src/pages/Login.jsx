import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../assets/shiba.png'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAppContext } from '../context/appContext'
export default function Login() {
    const { login } = useAppContext()
    const navigate = useNavigate()
    const [values, setValues] = useState({ login: '', password: '' })

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }
    useEffect(() => {
        // window.location.reload(false)

        const checkServerStatus = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_SERVER_HOSTNAME}`
                )
                setTimeout(() => {}, 100)
                if (response) {
                    toast.success(
                        'Server is running, I can log in',
                        toastOptions
                    )
                }
                checkServerStatus()
                if (
                    localStorage.getItem('chat-app-user') ||
                    localStorage.getItem('chat-app-token')
                ) {
                    navigate('/')
                }
            } catch (error) {
                console.error(error)
                toast.error('Unable to connect to server', toastOptions)
            }
        }
    }, [])

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const validateForm = () => {
        const { login, password } = values
        if (login === '') {
            toast.error('Email or Username is required.', toastOptions)
            return false
        } else if (password === '') {
            toast.error('Password is required.', toastOptions)
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (validateForm()) {
            const data = await login(values)
            if (data) {
                toast.error(data.response.data.message, toastOptions)
            } else {
                navigate('/')
            }
        }
    }

    return (
        <>
            <div className="login">
                <form action="" onSubmit={(e) => handleSubmit(e)}>
                    <div className="login-brand">
                        <img src={Logo} alt="logo" />
                        <h1>Messenger</h1>
                    </div>
                    <input
                        type="text"
                        placeholder="Username"
                        name="login"
                        onChange={(e) => handleChange(e)}
                        min="3"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={(e) => handleChange(e)}
                    />
                    <button type="submit">Log In</button>
                    <Link
                        to="/reset-password"
                        style={{ textDecoration: 'none' }}
                    >
                        <p className="login-btn">Forgot password?</p>
                    </Link>
                    <span>
                        Don't have an account ?{' '}
                        <Link to="/register">Create One.</Link>
                    </span>
                </form>
            </div>
            <ToastContainer />
        </>
    )
}
