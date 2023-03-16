import React, { useState, useEffect } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import Logo from '../assets/shiba.png'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAppContext } from '../context/appContext'

export default function Register() {
    const { register, token, user } = useAppContext()
    const navigate = useNavigate()

    useEffect(() => {
        const checkServerStatus = async () => {
            try {
                const response = await fetch(
                    // `${process.env.REACT_APP_SERVER_HOSTNAME}`
                    `https://chat-app-backend-utsp.onrender.com`
                )
                if (response) {
                    toast.success(
                        'Server is running, I can sign in',
                        toastOptions
                    )
                }
            } catch (error) {
                console.error(error)
                toast.error('Unable to connect to server', toastOptions)
            }
        }
        checkServerStatus()
        if (
            localStorage.getItem('chat-app-user') ||
            localStorage.getItem('chat-app-token')
        ) {
            ;<Navigate to="/" replace={true} />
        }
    }, [])

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const handleValidation = () => {
        const { password, confirmPassword, username, email } = values
        if (password !== confirmPassword) {
            toast.error(
                'Password and confirm password should be same.',
                toastOptions
            )
            return false
        } else if (username.length < 3) {
            toast.error(
                'Username should be greater than 3 characters.',
                toastOptions
            )
            return false
        } else if (password.length < 3) {
            toast.error(
                'Password should be equal or greater than 3 characters.',
                toastOptions
            )
            return false
        } else if (email === '') {
            toast.error('Email is required.', toastOptions)
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (handleValidation()) {
            const data = await register(values)
            if (data) {
                toast.error(data, toastOptions)
            } else {
                toast.success('Account created, please log in', toastOptions)
                setTimeout(() => {
                    navigate('/login')
                }, 5000)
            }
        }
    }

    return (
        <>
            <div className="register">
                <form action="" onSubmit={(e) => handleSubmit(e)}>
                    <div className="register-brand">
                        <img src={Logo} alt="logo" />
                        <h1>Messenger</h1>
                    </div>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        onChange={(e) => handleChange(e)}
                    />
                    <button type="submit">Create User</button>
                    <span>
                        Already have an account ?{' '}
                        <Link to="/login">Login.</Link>
                    </span>
                </form>
            </div>
            <ToastContainer />
        </>
    )
}
