import { useState } from 'react'
import { useAppContext } from '../context/appContext'
import { ToastContainer, toast } from 'react-toastify'

const Settings = () => {
    const { user, updateUser, sendEmail } = useAppContext()

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }

    const [username, setUsername] = useState(user?.username)
    const [file, setFile] = useState()
    const [selected, setSelected] = useState(1)

    const handleFileInputChange = (e) => {
        e.preventDefault()
        let files
        if (e.dataTransfer) {
            files = e.dataTransfer.files
        } else if (e.target) {
            files = e.target.files
        }

        const reader = new FileReader()
        reader.onload = () => {
            setFile(reader.result)
        }
        reader.readAsDataURL(files[0])
    }

    const handleChange = (e) => {
        setUsername(e)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!username) {
            toast.error('Username is required.', toastOptions)
            return
        }
        const updatedUser = { img: file, username }
        const res = await updateUser(updatedUser)
        if (res.data.code === 11000) {
            toast.error(res.data.message, toastOptions)
        } else {
            toast.success('User updated!', toastOptions)
        }

        setTimeout(() => {
            window.location.reload(false)
        }, 5000)
    }

    const onSubmitReset = async (e) => {
        e.preventDefault()
        if (!user.email) {
            toast.error(' Email is required.', toastOptions)
            return
        }
        const res = await sendEmail({
            email: user.email
        })
        if (res.response.status === 500) {
            toast.error(res.response.data.message, toastOptions)
        } else {
            toast.success('Email Sended! Check your e-mail', toastOptions)
        }
    }

    return (
        <>
            <div className="settings">
                <div className="settings-container">
                    <div className="settings-sidebar">
                        <div onClick={(e) => setSelected(1)}>Edit Profile</div>
                        <div onClick={(e) => setSelected(2)}>
                            Change password
                        </div>
                    </div>

                    {selected === 1 && (
                        <div className="settings-content">
                            <div className="settings-avatar">
                                {file ? (
                                    <img src={file} alt="chosen" />
                                ) : (
                                    <img src={user?.img} alt="profile" />
                                )}
                                <div>
                                    <div>{user?.email}</div>
                                    <label htmlFor="file">
                                        Change your profile photo
                                        <input
                                            id="file"
                                            type="file"
                                            name="image"
                                            hidden
                                            onChange={handleFileInputChange}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="settings-body">
                                <div className="settings-body-term">
                                    User name
                                </div>
                                <input
                                    className="settings-body-input"
                                    value={username || ''}
                                    onChange={(e) =>
                                        handleChange(e.target.value)
                                    }
                                ></input>
                            </div>
                            <div className="settings-body">
                                <div className="settings-body-term">email</div>
                                <input
                                    className="settings-body-input"
                                    value={user.email}
                                    disabled
                                ></input>
                            </div>

                            <div className="settings-button">
                                <button onClick={onSubmit}>Upload</button>
                            </div>
                        </div>
                    )}
                    {selected === 2 && (
                        <div className="settings-content">
                            <div className="settings-body">
                                <p className="password-paragraph">
                                    Press button and we'll send you a link to
                                    regain access to your account.
                                </p>
                                <form
                                    className="password-form"
                                    onSubmit={onSubmitReset}
                                >
                                    <label className="password-label"></label>
                                    <input
                                        type="email"
                                        className="password-input"
                                        name="email"
                                        placeholder="Email"
                                        value={user?.email}
                                        disabled
                                    />
                                    <button
                                        type="submit"
                                        className="password-btn"
                                    >
                                        reset password
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </>
    )
}
export default Settings
