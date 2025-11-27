import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Navbar = () => {
    const [error, setError] = useState('')
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {
                withCredentials: true
            })
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Logout failed')
            console.error('Logout error:', err)
        }
    }

    return (
        <nav className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-2xl">📕</span>
                            <span className="font-semibold text-lg text-gray-800">Notes</span>
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            to="/dashboard"
                            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-md hover:opacity-90 transition cursor-pointer"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setOpen((v) => !v)}
                            aria-label="Toggle menu"
                            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {open ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {open && (
                    <div className="md:hidden mt-2 pb-4 border-t border-gray-200">
                        <div className="flex flex-col px-2 space-y-2">
                            <Link
                                to="/dashboard"
                                onClick={() => setOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    setOpen(false)
                                    handleLogout()
                                }}
                                className="w-full text-left px-3 py-2 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium"
                            >
                                Logout
                            </button>
                            {error && (
                                <div className="mt-2 text-sm text-red-600 px-3">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
