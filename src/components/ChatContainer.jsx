import React, { useState, useEffect, useRef } from "react"
import ChatInput from "./ChatInput"
import Logout from "./Logout"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { useAppContext } from "../context/appContext"

export default function ChatContainer({ currentChat, socket }) {
    const { user, createConversation, getConversation } = useAppContext()
    const { sendMessage } = useAppContext()
    const scrollRef = useRef()
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [arrivalMessage, setArrivalMessage] = useState(null)

    useEffect(() => {
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            })
        })
    }, [])

    useEffect(() => {
        arrivalMessage &&
            arrivalMessage.sender === currentChat._id &&
            setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage])

    useEffect(() => {
        socket.current.emit("addUser", user._id)
        socket.current.on("getUsers", (users) => {})
    }, [user])

    useEffect(() => {
        const getMessages = async () => {
            try {
                if (currentChat.conversationId === undefined) {
                    setMessages([])
                    const conversation = await createConversation(
                        user._id,
                        currentChat._id
                    )
                    currentChat.conversationId = conversation
                    if (conversation !== undefined) {
                        const res = await getConversation(conversation)
                        setMessages(res.data)
                    }
                } else {
                    const res = await getConversation(
                        currentChat.conversationId
                    )
                    setMessages(res.data)
                }
            } catch (err) {
                console.log(err)
            }
        }
        getMessages()
    }, [currentChat])

    const handleSendMsg = async (msg) => {
        const message = {
            sender: user._id,
            text: msg,
            conversationId: currentChat.conversationId,
        }
        try {
            const res = await sendMessage(message)
            socket.current.emit("sendMessage", {
                senderId: user._id,
                receiverId: currentChat._id,
                text: msg,
            })
            setMessages([...messages, res.data])
            setNewMessage("")
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <>
            <div className="chat-container">
                <div className="chat-header">
                    <div className="user-details">
                        <div className="avatar">
                            <img src={currentChat.img} alt="" />
                        </div>
                        <div className="username">
                            <h3>{currentChat.username}</h3>
                        </div>
                    </div>
                    <Logout />
                </div>
                <div className="chat-messages">
                    {messages.map((msg) => {
                        return (
                            <div ref={scrollRef} key={uuidv4()}>
                                <div
                                    className={`message ${
                                        msg.sender === user._id
                                            ? "sended"
                                            : "received"
                                    }`}
                                >
                                    <div className="content ">
                                        <p>{msg.text}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <ChatInput handleSendMsg={handleSendMsg} />
            </div>
        </>
    )
}
