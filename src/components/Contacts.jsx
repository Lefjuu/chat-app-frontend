import React, { useState, useEffect } from 'react'
import Logo from '../assets/shiba.png'
import { useAppContext } from '../context/appContext'
import { BiSearch } from 'react-icons/bi'
import SearchBar from './Search'
import { Link } from 'react-router-dom'
import moment from 'moment/moment'

export default function Contacts({ contacts, changeChat }) {
    const { user, getAllUsers } = useAppContext()
    const [currentSelected, setCurrentSelected] = useState(undefined)
    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index)
        changeChat(contact)
    }

    const [allUsers, setAllUsers] = useState([])
    const [keyword, setKeyword] = useState('')
    const [sortedUsers, setSortedUsers] = useState([])

    const fetchStories = async () => {
        const data = await getAllUsers(user._id)
        setAllUsers(data.data)
        setSortedUsers(data.data)
    }

    const updateKeyword = (keyword) => {
        const filtered = allUsers.filter((e) => {
            return `${e.username.toLowerCase()} ${e.username.toLowerCase()}`.includes(
                keyword.toLowerCase()
            )
        })
        setKeyword(keyword)
        setSortedUsers(filtered)
    }

    useEffect(() => {
        fetchStories()
    }, [])

    return (
        <>
            <div className="contacts">
                <div className="contacts-brand">
                    <img src={Logo} alt="logo" />
                    <h3>Messenger</h3>
                </div>
                <div className="contacts-find">
                    <SearchBar keyword={keyword} onChange={updateKeyword} />
                    <BiSearch className="contracts-icon" />
                </div>
                <div className="contacts-content">
                    {keyword !== '' &&
                        sortedUsers &&
                        sortedUsers.map((user, index) => {
                            return (
                                <div
                                    key={user._id}
                                    className={`contact ${
                                        index === currentSelected
                                            ? 'selected'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        changeCurrentChat(index, user)
                                    }
                                >
                                    <div className="avatar">
                                        <img src={user.img} alt="" />
                                    </div>
                                    <div className="username">
                                        <h3>{user.username}</h3>
                                    </div>
                                </div>
                            )
                        })}
                    {keyword === '' &&
                        contacts.map((contact, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`contact ${
                                        index === currentSelected
                                            ? 'selected'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        changeCurrentChat(index, contact)
                                    }
                                >
                                    <div className="avatar">
                                        <img src={contact.img} alt="" />
                                    </div>
                                    <div className="username">
                                        <h3>{contact.username}</h3>
                                        <p>{contact.lastMessageText}</p>
                                        <p>
                                            {contact.lastMessageText
                                                ? moment(contact.lastMessage)
                                                      .startOf('minutes')
                                                      .fromNow()
                                                : 'start chat!'}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                </div>
                <Link to="/settings" className="current-user">
                    <div className="avatar">
                        <img src={user.img} alt="avatar" />
                    </div>
                    <div className="username">
                        <h2>{user.username}</h2>
                    </div>
                </Link>
            </div>
        </>
    )
}
