import React from "react"
import { useNavigate } from "react-router-dom"
import { BiPowerOff } from "react-icons/bi"
import { useAppContext } from "../context/appContext"

export default function Logout() {
    const { removeUserFromLocalStorage } = useAppContext()
    const navigate = useNavigate()
    const handleClick = async () => {
        navigate("/login")
        await removeUserFromLocalStorage()
    }
    return (
        <div className="logout-button" onClick={handleClick}>
            <BiPowerOff />
        </div>
    )
}
