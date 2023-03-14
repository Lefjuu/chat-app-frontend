import Dog from "../assets/dog.gif"
import { useAppContext } from "../context/appContext"
import Logout from "./Logout"

export default function Welcome() {
    const { user } = useAppContext()
    return (
        <div className="welcome">
            <div className="logout-btn">
                <Logout />
            </div>
            <img src={Dog} alt="" />
            <h1>
                Welcome, <span>{user.username}!</span>
            </h1>
            <h3>Please select a chat to Start messaging.</h3>
        </div>
    )
}
