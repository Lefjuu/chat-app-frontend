import React, { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { io } from "socket.io-client"
import Contacts from "../components/Contacts"
import Welcome from "../components/Welcome"
import ChatContainer from "../components/ChatContainer"
import { useAppContext } from "../context/appContext"

export default function Chat() {
    const { user, getConversations } = useAppContext()
    const navigate = useNavigate()
    const [currentChat, setCurrentChat] = useState(undefined)
    const [conversations, setConversations] = useState([])
    const [render, setRender] = useState(false)
    const socket = useRef(io(`ws://${process.env.REACT_APP_SERVER_HOSTNAME}`))

    useEffect(() => {
        if (!localStorage.getItem("chat-app-user")) {
            navigate("/login")
        } else if (
            localStorage.getItem("chat-app-user") ||
            localStorage.getItem("chat-app-token")
        ) {
            if (!user) {
                window.location.reload(false)
            }
            setRender(true)
        }
    }, [user, navigate])

    useEffect(() => {
        const f = async () => {
            const res = await getConversations()
            setConversations(res.data)
        }
        f()
    }, [])

    useEffect(() => {
        socket.current.emit("addUser", user._id)
        socket.current.on("getUsers", (users) => {
            console.log(users)
        })
    }, [])

    const handleChatChange = (chat) => {
        console.log(chat)
        setCurrentChat(chat)
    }

    return (
        <>
            {render && (
                <div className="chat">
                    <div className="chat-content">
                        <Contacts
                            contacts={conversations}
                            changeChat={handleChatChange}
                        />
                        {currentChat === undefined ? (
                            <Welcome />
                        ) : (
                            <ChatContainer
                                currentChat={currentChat}
                                socket={socket}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
