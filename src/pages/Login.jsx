import React, { useState, useEffect } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
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
        const checkServerStatus = async () => {
            if (
                localStorage.getItem('chat-app-user') ||
                localStorage.getItem('chat-app-token')
            ) {
                ;<Navigate to="/" replace={true} />
            }
            toast.info('please wait until the server starts up', toastOptions)

            let counter = 0

            const intervalId = setInterval(() => {
                if (counter < 5) {
                    // fetch(`${process.env.REACT_APP_SERVER_HOSTNAME}`)
                    fetch('https://chat-app-backend-utsp.onrender.com')
                        .then((res) => {
                            if (res) {
                                toast.success(
                                    'Server is running, I can log in',
                                    toastOptions
                                )
                                clearInterval(intervalId)
                            }
                        })
                        .catch(() => {
                            toast.error('connecting...', toastOptions)
                        })
                    counter++
                } else {
                    clearInterval(intervalId)
                    toast.error('Unable to connect to server', toastOptions)
                }
            }, 8500)
        }
        checkServerStatus()
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
                if (window.location.pathname === '/login') {
                    window.location.pathname = '/'
                }
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
                        Don't have an account ?
                        <Link to="/register">Create One.</Link>
                    </span>
                </form>
            </div>
            <ToastContainer />
        </>
    )
}
