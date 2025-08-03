import { createContext, useContext, useState, useEffect } from 'react'
import { userAPI } from '../services/api.js'

const AuthContext = createContext()

// custom hook for using auth context
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [authError, setAuthError] = useState(null)

    // check if user is already logged in when app starts
    useEffect(() => {
        const userData = localStorage.getItem('user')
        const userToken = localStorage.getItem('token')

        if (userData && userToken) {
            try {
                const parsedUser = JSON.parse(userData)
                setCurrentUser(parsedUser)
            } catch (err) {
                console.error('Error parsing user data:', err)
                // clear corrupted data
                localStorage.removeItem('user')
                localStorage.removeItem('token')
            }
        }
        setLoading(false)
    }, [])

    const login = async (credentials) => {
        try {
            setLoading(true)
            setAuthError(null)

            const response = await userAPI.login(credentials)

            if (response.success) {
                const userData = {
                    id: response.user.id,
                    name: response.user.name,
                    email: response.user.email,
                    token: response.token
                }

                setCurrentUser(userData)
                localStorage.setItem('user', JSON.stringify(userData))
                localStorage.setItem('token', response.token)
                return { success: true, user: userData }
            } else {
                throw new Error(response.message || 'Login failed')
            }
        } catch (error) {
            console.error('Login error:', error)
            setAuthError(error.message)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const signup = async (userData) => {
        try {
            setLoading(true)
            setAuthError(null)

            const response = await userAPI.register(userData)

            if (response.success) {
                const newUser = {
                    id: response.user.id,
                    name: response.user.name,
                    email: response.user.email,
                    token: response.token
                }

                setCurrentUser(newUser)
                localStorage.setItem('user', JSON.stringify(newUser))
                localStorage.setItem('token', response.token)
                return { success: true, user: newUser }
            } else {
                throw new Error(response.message || 'Registration failed')
            }
        } catch (error) {
            console.error('Signup error:', error)
            setAuthError(error.message)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const updateUserProfile = (updatedData) => {
        const updatedUser = { ...currentUser, ...updatedData }
        setCurrentUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        return updatedUser
    }

    const logout = () => {
        setCurrentUser(null)
        userAPI.logout() // clears localStorage
        setAuthError(null)
    }

    const isAuthenticated = () => {
        return currentUser !== null
    }

    const contextValue = {
        user: currentUser,
        login,
        signup,
        logout,
        updateUser: updateUserProfile,
        isAuthenticated,
        isLoading: loading,
        error: authError,
        setError: setAuthError
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}
