import React, { useContext } from 'react'
import axios from 'axios'

const token = localStorage.getItem('chat-app-token')
const user = localStorage.getItem('chat-app-user')

const state = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user ? JSON.parse(user) : null,
    showAddPost: false,
    posts: [],
    token: token
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
    const authFetch = axios.create({
        // baseURL: `${process.env.REACT_APP_SERVER_HOSTNAME}/api`
        baseURL: `https://chat-app-backend-utsp.onrender.com/api`
    })

    authFetch.interceptors.request.use(
        (config) => {
            config.headers[`Authorization`] = `Bearer ${state.token}`
            return config
        },
        (err) => {
            return Promise.reject(err)
        }
    )

    authFetch.interceptors.response.use(
        (response) => {
            return response
        },
        (err) => {
            if (err.response.status === 401) {
                console.log('logout')
                removeUserFromLocalStorage()
            }
            return Promise.reject(err)
        }
    )

    const addUserToLocalStorage = (user) => {
        localStorage.setItem('chat-app-user', JSON.stringify(user))
    }

    const addTokenToLocalStorage = async (token) => {
        localStorage.setItem('chat-app-token', token)
    }

    const removeUserFromLocalStorage = () => {
        localStorage.removeItem('chat-app-user')
        localStorage.removeItem('chat-app-token')
    }

    const register = async (body) => {
        try {
            const { data } = await axios.post(
                // `${process.env.REACT_APP_SERVER_HOSTNAME}/api/auth/register`,
                `https://chat-app-backend-utsp.onrender.com/api/auth/register`,
                body
            )
            return data.msg
        } catch (err) {
            console.log(err)
            return err.response.data.message
        }
    }

    const login = async (body) => {
        try {
            const { data } = await axios.post(
                // `${process.env.REACT_APP_SERVER_HOSTNAME}/api/auth/login`,
                `https://chat-app-backend-utsp.onrender.com/api/auth/login`,
                body
            )
            console.log(data)
            await addTokenToLocalStorage(data.token)
            addUserToLocalStorage(data.user)
            if (data.msg) return data.msg
            else return
        } catch (err) {
            console.log(err)
            return err
        }
    }

    const updateUser = async (updatedUser) => {
        let currentUser = JSON.parse(user)

        try {
            const res = await authFetch.patch(
                `/user/update/${currentUser._id}`,
                updatedUser
            )
            addUserToLocalStorage(res.data)
            return res
        } catch (err) {
            console.log(err)
            return err.response
        }
    }

    const sendEmail = async (email) => {
        try {
            const data = await axios.post(`/user/forgot-password`, {
                email
            })
            return data
        } catch (err) {
            console.log(err)
            return err
        }
    }

    const getUsers = async () => {
        let currentUser = JSON.parse(user)

        try {
            const { data } = await authFetch.get(`/user/all/${currentUser._id}`)
            if (!data) {
                console.log('not found')
            }
            return data
        } catch (err) {
            console.log(err)
        }
    }

    const sendMessage = async (message) => {
        try {
            const res = await authFetch.post('/message', message)
            return res
        } catch (err) {
            console.log(err)
        }
    }

    const getConversations = async () => {
        const currentUser = JSON.parse(user)
        try {
            const data = await authFetch.get(
                `/conversations/user/${currentUser._id}`
            )
            return data
        } catch (err) {
            console.log(err)
        }
    }

    const createConversation = async (senderId, receiverId) => {
        try {
            const data = await authFetch.post(`/conversation`, {
                senderId,
                receiverId
            })
            return data
        } catch (err) {
            console.log(err)
            return err
        }
    }

    const getConversation = async (id) => {
        try {
            const data = await authFetch.get(`/conversation/${id}`)
            return data
        } catch (err) {
            console.log(err)
        }
    }

    const getAllUsers = async (id) => {
        try {
            const data = await authFetch.get(`/user/all/${id}`)
            return data
        } catch (err) {
            console.log(err)
        }
    }

    const changePassword = async ({ password, string }) => {
        try {
            const res = await axios.patch(`/auth/new-password/${string}`, {
                password
            })
            console.log(res)
            return res
        } catch (err) {
            return err
        }
    }

    return (
        <AppContext.Provider
            value={{
                ...state,
                register,
                login,
                updateUser,
                getUsers,
                sendMessage,
                getConversations,
                createConversation,
                getConversation,
                getAllUsers,
                removeUserFromLocalStorage,
                sendEmail,
                changePassword
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider, state, useAppContext }
