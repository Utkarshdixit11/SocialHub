import React, { useState, useRef } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { usePost } from '../../../context/PostContext'
import { useMobileMenu } from '../../../context/MobileMenuContext'
import Sidebar from '../../layout/Sidebar'
import Footer from '../../layout/Footer'
import MobileMenuButton from '../../layout/MobileMenuButton'
import LoadingSpinner from '../../LoadingSpinner'
import './Profile.css'

const Profile = () => {
    const { user, updateUser } = useAuth()
    const { posts, isLoading } = usePost()
    const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenu()
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [profileImage, setProfileImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [errors, setErrors] = useState({})
    const [successMessage, setSuccessMessage] = useState('')
    const fileInputRef = useRef(null)

    const [editData, setEditData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        location: user?.location || '',
        website: user?.website || '',
        phone: user?.phone || ''
    })

    // Filter posts by current user
    const userPosts = posts.filter(post => post.name === user?.name)

    const validateForm = () => {
        const newErrors = {}

        if (!editData.name.trim()) {
            newErrors.name = 'Name is required'
        }

        if (!editData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(editData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (editData.website && !/^https?:\/\/.+/.test(editData.website)) {
            newErrors.website = 'Please enter a valid URL (starting with http:// or https://)'
        }

        if (editData.phone && !/^\+?[\d\s\-\(\)]+$/.test(editData.phone)) {
            newErrors.phone = 'Please enter a valid phone number'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleEdit = () => {
        setIsEditing(true)
        setErrors({})
        setSuccessMessage('')
    }

    const handleSave = async () => {
        if (!validateForm()) return

        setIsSaving(true)
        setErrors({})

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            const updatedUser = { ...user, ...editData }

            // Update localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser))

            // Update auth context if updateUser function exists
            if (updateUser) {
                updateUser(updatedUser)
            }

            setIsEditing(false)
            setSuccessMessage('Profile updated successfully!')

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000)

        } catch (error) {
            setErrors({ general: 'Failed to update profile. Please try again.' })
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setEditData({
            name: user?.name || '',
            email: user?.email || '',
            bio: user?.bio || '',
            location: user?.location || '',
            website: user?.website || '',
            phone: user?.phone || ''
        })
        setIsEditing(false)
        setErrors({})
        setSuccessMessage('')
        setProfileImage(null)
        setImagePreview(null)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear specific field error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors(prev => ({
                    ...prev,
                    image: 'Image size must be less than 5MB'
                }))
                return
            }

            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Please select a valid image file'
                }))
                return
            }

            setProfileImage(file)

            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => setImagePreview(e.target.result)
            reader.readAsDataURL(file)

            // Clear image error
            setErrors(prev => ({
                ...prev,
                image: ''
            }))
        }
    }

    const triggerImageUpload = () => {
        fileInputRef.current?.click()
    }

    if (isLoading) {
        return (
            <div className="profile-page">
                <MobileMenuButton
                    isOpen={isMobileMenuOpen}
                    onClick={toggleMobileMenu}
                />
                <Sidebar />
                <div className="profile-main-wrapper">
                    <div className="profile-content">
                        <LoadingSpinner size="large" message="Loading profile..." />
                    </div>
                    <Footer />
                </div>
            </div>
        )
    }

    return (
        <div className='profile-page'>
            <MobileMenuButton
                isOpen={isMobileMenuOpen}
                onClick={toggleMobileMenu}
            />
            <Sidebar />
            <div className="profile-main-wrapper">
                <main className='profile-content' role="main">
                {/* Success Message */}
                {successMessage && (
                    <div className="success-banner" role="alert">
                        <span className="success-icon">✅</span>
                        {successMessage}
                    </div>
                )}

                {/* Profile Header */}
                <div className='profile-header'>
                    <div className='profile-avatar-section'>
                        <div className='profile-avatar-large'>
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile preview"
                                    className="profile-image-preview"
                                />
                            ) : (
                                <span className="avatar-text">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            )}
                            {isEditing && (
                                <button
                                    className="image-upload-btn"
                                    onClick={triggerImageUpload}
                                    aria-label="Upload profile picture"
                                >
                                    📷
                                </button>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden-file-input"
                            aria-label="Profile picture upload"
                        />
                        {errors.image && (
                            <span className="error-text">{errors.image}</span>
                        )}
                    </div>

                    <div className='profile-info'>
                        {errors.general && (
                            <div className="error-message" role="alert">
                                {errors.general}
                            </div>
                        )}

                        {isEditing ? (
                            <form className='edit-form' onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Full Name *</label>
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={editData.name}
                                            onChange={handleInputChange}
                                            placeholder="Your full name"
                                            className={`edit-input ${errors.name ? 'error' : ''}`}
                                            disabled={isSaving}
                                            required
                                        />
                                        {errors.name && <span className="error-text">{errors.name}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">Email Address *</label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={editData.email}
                                            onChange={handleInputChange}
                                            placeholder="your.email@example.com"
                                            className={`edit-input ${errors.email ? 'error' : ''}`}
                                            disabled={isSaving}
                                            required
                                        />
                                        {errors.email && <span className="error-text">{errors.email}</span>}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="location" className="form-label">Location</label>
                                        <input
                                            id="location"
                                            type="text"
                                            name="location"
                                            value={editData.location}
                                            onChange={handleInputChange}
                                            placeholder="City, Country"
                                            className="edit-input"
                                            disabled={isSaving}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone" className="form-label">Phone Number</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            value={editData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+1 (555) 123-4567"
                                            className={`edit-input ${errors.phone ? 'error' : ''}`}
                                            disabled={isSaving}
                                        />
                                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="website" className="form-label">Website</label>
                                    <input
                                        id="website"
                                        type="url"
                                        name="website"
                                        value={editData.website}
                                        onChange={handleInputChange}
                                        placeholder="https://yourwebsite.com"
                                        className={`edit-input ${errors.website ? 'error' : ''}`}
                                        disabled={isSaving}
                                    />
                                    {errors.website && <span className="error-text">{errors.website}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="bio" className="form-label">Bio</label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={editData.bio}
                                        onChange={handleInputChange}
                                        placeholder="Tell us about yourself..."
                                        className='edit-textarea'
                                        rows="4"
                                        maxLength="500"
                                        disabled={isSaving}
                                    />
                                    <div className="char-count">
                                        {editData.bio.length}/500
                                    </div>
                                </div>

                                <div className='edit-actions'>
                                    <button
                                        type="submit"
                                        className={`save-btn ${isSaving ? 'loading' : ''}`}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <>
                                                <span className="loading-spinner"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className='cancel-btn'
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className='profile-display'>
                                <h1>{user?.name || 'User'}</h1>
                                <div className="profile-details">
                                    <div className="detail-item">
                                        <span className="detail-icon">📧</span>
                                        <span className="detail-text">{user?.email || 'No email provided'}</span>
                                    </div>
                                    {user?.location && (
                                        <div className="detail-item">
                                            <span className="detail-icon">📍</span>
                                            <span className="detail-text">{user.location}</span>
                                        </div>
                                    )}
                                    {user?.phone && (
                                        <div className="detail-item">
                                            <span className="detail-icon">📞</span>
                                            <span className="detail-text">{user.phone}</span>
                                        </div>
                                    )}
                                    {user?.website && (
                                        <div className="detail-item">
                                            <span className="detail-icon">🌐</span>
                                            <a
                                                href={user.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="detail-link"
                                            >
                                                {user.website}
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <p className='profile-bio'>{user?.bio || 'No bio available'}</p>
                                <button onClick={handleEdit} className='edit-profile-btn'>
                                    ✏️ Edit Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Stats */}
                <section className='profile-stats' aria-labelledby="stats-heading">
                    <h2 id="stats-heading" className="sr-only">Profile Statistics</h2>
                    <div className='stat-item'>
                        <div className="stat-icon">📝</div>
                        <div className="stat-content">
                            <span className='stat-number'>{userPosts.length}</span>
                            <span className='stat-label'>Posts</span>
                        </div>
                    </div>
                    <div className='stat-item'>
                        <div className="stat-icon">❤️</div>
                        <div className="stat-content">
                            <span className='stat-number'>
                                {userPosts.reduce((total, post) => total + (post.likes || 0), 0)}
                            </span>
                            <span className='stat-label'>Likes Received</span>
                        </div>
                    </div>
                    <div className='stat-item'>
                        <div className="stat-icon">💬</div>
                        <div className="stat-content">
                            <span className='stat-number'>
                                {userPosts.reduce((total, post) => total + (post.comments?.length || 0), 0)}
                            </span>
                            <span className='stat-label'>Comments</span>
                        </div>
                    </div>
                    <div className='stat-item'>
                        <div className="stat-icon">📅</div>
                        <div className="stat-content">
                            <span className='stat-number'>
                                {userPosts.length > 0 ? Math.ceil((Date.now() - new Date(userPosts[userPosts.length - 1].date).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                            </span>
                            <span className='stat-label'>Days Active</span>
                        </div>
                    </div>
                </section>

                {/* User Posts Section */}
                <section className='user-posts-section' aria-labelledby="posts-heading">
                    <div className="posts-header">
                        <h2 id="posts-heading">My Posts ({userPosts.length})</h2>
                        <button
                            className="create-post-link"
                            onClick={() => window.location.href = '/post'}
                            aria-label="Create a new post"
                        >
                            ✏️ Create New Post
                        </button>
                    </div>

                    {userPosts.length > 0 ? (
                        <div className='user-posts-grid'>
                            {userPosts.map((post, index) => (
                                <article key={index} className='user-post-card'>
                                    <div className='post-content'>
                                        <p>{post.content}</p>
                                    </div>
                                    <div className='post-meta'>
                                        <time className='post-date' dateTime={post.date}>
                                            {new Date(post.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </time>
                                        <div className='post-engagement'>
                                            <span className="engagement-item">
                                                <span aria-label="Likes">❤️</span> {post.likes || 0}
                                            </span>
                                            <span className="engagement-item">
                                                <span aria-label="Comments">💬</span> {post.comments?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="post-actions">
                                        <button
                                            className="post-action-btn edit"
                                            aria-label="Edit this post"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            className="post-action-btn delete"
                                            aria-label="Delete this post"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className='no-posts'>
                            <div className="no-posts-icon">📝</div>
                            <h3>No posts yet</h3>
                            <p>You haven't posted anything yet.</p>
                            <p>Share your thoughts with the community!</p>
                            <button
                                className="create-first-post-btn"
                                onClick={() => window.location.href = '/post'}
                            >
                                Create Your First Post
                            </button>
                        </div>
                    )}
                </section>
                </main>
                <Footer />
            </div>
        </div>
    )
}

export default Profile
