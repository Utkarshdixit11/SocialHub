import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import "./login.css"

const LoginPage = () => {
    const navigate = useNavigate()
    const { login: doLogin, signup: doSignup, isAuthenticated, error: authError, setError } = useAuth()
    const [showLogin, setShowLogin] = useState(false) // start with signup form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [validationErrors, setValidationErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    // redirect if user is already logged in
    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/home')
        }
    }, [isAuthenticated, navigate])

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }))

        // clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateFormData = () => {
        const errors = {}

        // email validation
        if (!formData.email) {
            errors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email'
        }

        // password validation
        if (!formData.password) {
            errors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters'
        }

        // signup specific validation
        if (!showLogin) {
            if (!formData.name) {
                errors.name = 'Name is required'
            }
            if (!formData.confirmPassword) {
                errors.confirmPassword = 'Please confirm your password'
            } else if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match'
            }
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()

        if (!validateFormData()) {
            return
        }

        setSubmitting(true)
        setValidationErrors({}) // clear any previous errors

        try {
            if (showLogin) {
                // user wants to login
                const result = await doLogin({
                    email: formData.email,
                    password: formData.password
                })

                if (result.success) {
                    navigate('/home')
                }
            } else {
                // user wants to signup
                const result = await doSignup({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })

                if (result.success) {
                    navigate('/home')
                }
            }
        } catch (error) {
            console.error('Auth error:', error)

            // show user-friendly error messages
            let message = 'Something went wrong. Please try again.'
            if (error.message) {
                if (error.message.includes('User doesn\'t exist')) {
                    message = 'No account found with this email.'
                } else if (error.message.includes('Invalid password')) {
                    message = 'Incorrect password.'
                } else if (error.message.includes('User already exists')) {
                    message = 'An account with this email already exists.'
                } else if (error.message.includes('valid email')) {
                    message = 'Please enter a valid email address.'
                } else if (error.message.includes('6 characters')) {
                    message = 'Password must be at least 6 characters.'
                } else {
                    message = error.message
                }
            }

            setValidationErrors({ general: message })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className='login'>
            <div className='content'>
                <h1>SocialHub</h1>
                <p>Connect with friends, share your thoughts, and discover new content on our social platform.</p>
            </div>
            <div className='loginContent'>
                <form className='form' onSubmit={handleFormSubmit}>
                    {validationErrors.general && <div className="error-message">{validationErrors.general}</div>}
                    {showLogin ?
                        <div>
                            <p>Welcome Back!</p>
                            <h1>Login</h1>
                            <input
                                onChange={handleInputChange}
                                name="email"
                                value={formData.email}
                                placeholder='Your Email'
                                type="email"
                                className={validationErrors.email ? 'error' : ''}
                            />
                            {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
                            <input
                                onChange={handleInputChange}
                                name="password"
                                value={formData.password}
                                placeholder='Your Password'
                                type="password"
                                className={validationErrors.password ? 'error' : ''}
                            />
                            {validationErrors.password && <span className="error-text">{validationErrors.password}</span>}
                            <button type="submit" disabled={submitting}>
                                {submitting ? 'Logging in...' : 'Login'}
                            </button>
                            <p className="toggle-text">
                                Don't have an account?
                                <span onClick={() => setShowLogin(false)} className="toggle-link"> Sign up</span>
                            </p>
                        </div>
                        :
                        <div>
                            <p>LET'S GET YOU STARTED</p>
                            <h1>CREATE YOUR ACCOUNT</h1>
                            <input
                                onChange={handleInputChange}
                                name="name"
                                value={formData.name}
                                placeholder='Your Name'
                                className={validationErrors.name ? 'error' : ''}
                            />
                            {validationErrors.name && <span className="error-text">{validationErrors.name}</span>}
                            <input
                                onChange={handleInputChange}
                                name="email"
                                value={formData.email}
                                placeholder='Your Email'
                                type="email"
                                className={validationErrors.email ? 'error' : ''}
                            />
                            {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
                            <input
                                onChange={handleInputChange}
                                name="password"
                                value={formData.password}
                                placeholder='Your Password'
                                type="password"
                                className={validationErrors.password ? 'error' : ''}
                            />
                            {validationErrors.password && <span className="error-text">{validationErrors.password}</span>}
                            <input
                                onChange={handleInputChange}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                placeholder='Confirm Password'
                                type="password"
                                className={validationErrors.confirmPassword ? 'error' : ''}
                            />
                            {validationErrors.confirmPassword && <span className="error-text">{validationErrors.confirmPassword}</span>}
                            <button type="submit" disabled={submitting}>
                                {submitting ? 'Creating Account...' : 'Create Account'}
                            </button>
                            <p className="toggle-text">
                                Already have an account?
                                <span onClick={() => setShowLogin(true)} className="toggle-link"> Login</span>
                            </p>
                        </div>
                    }
                </form>
            </div>
        </div>
    )
}

export default LoginPage
