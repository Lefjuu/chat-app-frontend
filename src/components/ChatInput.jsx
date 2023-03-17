import React, { useState } from "react"
import { IoMdSend } from "react-icons/io"

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("")

  const sendChat = (e) => {
    e.preventDefault()

    if (msg.length > 0) {
      handleSendMsg(msg)
      setMsg("")
    }
  }

  return (
    <div className="chat-input-content">
      <form className="input-container" onSubmit={(e) => sendChat(e)}>
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </div>
  )
}