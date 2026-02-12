import { createContext, useContext, useState, useEffect } from 'react'
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

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setLoading(false)
                return
            }

            const response = await authAPI.getMe()
            setUser(response.data.user)
            setIsAuthenticated(true)
        } catch (error) {
            console.error('Auth check failed:', error)
            localStorage.removeItem('token')
            setUser(null)
            setIsAuthenticated(false)
        } finally {
            setLoading(false)
        }
    }

    const login = async (identifier, password) => {
        try {
            const response = await authAPI.login({ identifier, password })
            const { token, user } = response.data

            // Store only token in localStorage
            localStorage.setItem('token', token)

            setUser(user)
            setIsAuthenticated(true)

            return { success: true, user }
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
            const { token, user } = response.data

            // Store only token in localStorage
            localStorage.setItem('token', token)

            setUser(user)
            setIsAuthenticated(true)

            return { success: true, user }
        } catch (error) {
            console.error('Registration failed:', error)
            return {
                success: false,
                error: error.response?.data?.error || 'Registration failed'
            }
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        setIsAuthenticated(false)
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
