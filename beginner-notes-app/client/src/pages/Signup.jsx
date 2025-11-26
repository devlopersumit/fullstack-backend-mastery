import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Signup = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const validateInputs = () => {
        if (!username.trim()) {
            setError('Username is required')
            return false
        }
        if (username.trim().length < 3 || username.trim().length > 10) {
            setError('Username must be between 3 to 10 characters')
            return false
        }
        if (!email.trim()) {
            setError('Email is required')
            return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address')
            return false
        }
        if (!password.trim()) {
            setError('Password is required')
            return false
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return false
        }
        if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
            setError('Password must contain uppercase letter, number, and special character')
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!validateInputs()) {
            return
        }

        setLoading(true)
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
                { username: username.trim(), email: email.trim(), password },
                { withCredentials: true }
            )

            if (response.data.message === 'User Created Successfully') {
                navigate('/dashboard')
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Signup failed')
            console.error('Signup error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Sign Up</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Choose a username (3-10 chars)"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Strong password required"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-2">Must contain uppercase, number, and special character</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-6">
                    Already have an account?{' '}
                    <Link to="/" className="text-purple-500 font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Signup
