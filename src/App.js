import './App.css'
import './css/main.css'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import Settings from './pages/Settings'
import ResetPasswordRequest from './pages/Reset-Password'
import ProtectedRoute from './pages/ProtectedRoute'
import NewPassword from './pages/New-Password'
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/reset-password"
                    element={<ResetPasswordRequest />}
                />
                <Route path="/newPassword/:string" element={<NewPassword />} />

                <Route path="/register" element={<Register />} />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}
