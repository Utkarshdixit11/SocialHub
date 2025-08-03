import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePost } from '../context/PostContext'
import './CreatePostModal.css'

const CreatePostModal = ({ isOpen, onClose }) => {
    const { user } = useAuth()
    const { createPost } = usePost()
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [charCount, setCharCount] = useState(0)
    const textareaRef = useRef(null)
    const modalRef = useRef(null)

    // Focus management and accessibility
    useEffect(() => {
        if (isOpen && textareaRef.current) {
            setTimeout(() => textareaRef.current.focus(), 100)
        }
    }, [isOpen])

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen && !isSubmitting) {
                handleClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, isSubmitting])

    // Update character count
    useEffect(() => {
        setCharCount(content.length)
    }, [content])

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Client-side validation
        if (!content.trim()) {
            setError('Please enter some content for your post')
            return
        }

        if (content.length > 500) {
            setError('Post content must be less than 500 characters')
            return
        }

        if (!user?.name) {
            setError('User information is missing. Please log in again.')
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            const result = await createPost({
                name: user.name,
                content: content.trim()
            })

            if (result) {
                setShowSuccess(true)
                setContent('')

                // Show success message briefly before closing
                setTimeout(() => {
                    setShowSuccess(false)
                    onClose()
                }, 1500)
            }

        } catch (error) {
            console.error('Post creation error:', error)
            setError(error.message || 'Failed to create post. Please check your connection and try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        if (isSubmitting) return // Prevent closing while submitting
        setContent('')
        setError('')
        setShowSuccess(false)
        onClose()
    }

    const handleContentChange = (e) => {
        const newContent = e.target.value
        setContent(newContent)
        setError('') // Clear error when user starts typing
    }

    const getCharCountColor = () => {
        if (charCount > 500) return '#e74c3c'
        if (charCount > 450) return '#f39c12'
        return '#65676b'
    }

    if (!isOpen) return null

    return (
        <div
            className="modal-overlay"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                ref={modalRef}
            >
                <div className="modal-header">
                    <h2 id="modal-title">Create a Post</h2>
                    <button
                        className="close-btn"
                        onClick={handleClose}
                        aria-label="Close modal"
                        disabled={isSubmitting}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="post-form">
                    <div className="user-info">
                        <div className="user-avatar">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="user-name">{user?.name || 'User'}</span>
                    </div>

                    {error && (
                        <div className="error-message" role="alert">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    {showSuccess && (
                        <div className="success-message" role="alert">
                            <span className="success-icon">✅</span>
                            Post created successfully!
                        </div>
                    )}

                    <div className="textarea-container">
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={handleContentChange}
                            placeholder="What's on your mind?"
                            className={`post-textarea ${charCount > 500 ? 'error' : ''}`}
                            rows="4"
                            maxLength="500"
                            disabled={isSubmitting}
                            aria-describedby="char-count"
                            aria-invalid={charCount > 500}
                        />
                        <div
                            id="char-count"
                            className="character-count"
                            style={{ color: getCharCountColor() }}
                        >
                            {charCount}/500
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="cancel-btn"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
                            disabled={isSubmitting || !content.trim() || charCount > 500}
                            aria-describedby={isSubmitting ? 'loading-text' : undefined}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    <span id="loading-text">Posting...</span>
                                </>
                            ) : (
                                'Post'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePostModal
