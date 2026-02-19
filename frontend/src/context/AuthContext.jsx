import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Check authentication on mount
    useEffect(() => {
        checkAuth()
    }, [])

    const navigate = useNavigate()

    const checkAuth = async () => {
        try {
            // Try to get current user from the backend using HttpOnly cookie
            const response = await authAPI.getMe()
            setUser(response.data.user)
            setIsAuthenticated(true)
            // Keep a copy of the non-sensitive user profile for components that read it
            try { localStorage.setItem('user', JSON.stringify(response.data.user)) } catch (e) { /* ignore */ }
        } catch (error) {
            console.error('Auth check failed:', error)
            // No valid session
            setUser(null)
            setIsAuthenticated(false)
        } finally {
            setLoading(false)
        }
    }

    const login = async (identifier, password) => {
        try {
            const response = await authAPI.login({ identifier, password })
            const { user, token } = response.data

            // Server sets HttpOnly cookie; frontend should not store token in localStorage
            setUser(user)
            setIsAuthenticated(true)
            // Keep a copy of the non-sensitive user profile for components that read it
            try { localStorage.setItem('user', JSON.stringify(user)) } catch (e) { /* ignore */ }

            return { success: true, user, token }
        } catch (error) {
            console.error('Login failed:', error)
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            }
        }
    }

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData)
            const { user, token } = response.data

            // Server sets HttpOnly cookie; frontend should not store token in localStorage
            setUser(user)
            setIsAuthenticated(true)

            return { success: true, user, token }
        } catch (error) {
            console.error('Registration failed:', error)
            return {
                success: false,
                error: error.response?.data?.error || 'Registration failed'
            }
        }
    }

    const logout = () => {
        try {
            // Inform backend to clear the HttpOnly cookie
            authAPI.logout()
        } catch (e) {
            console.warn('Logout request failed:', e)
        }
        setUser(null)
        setIsAuthenticated(false)
        try { localStorage.removeItem('user') } catch (e) { /* ignore */ }
        // Navigate to auth page without full reload
        navigate('/auth')
    }

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
