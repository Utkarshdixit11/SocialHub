import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePost } from '../context/PostContext'
import './CommentModal.css'

const CommentModal = ({ isOpen, onClose, post }) => {
    const { user } = useAuth()
    const { addComment } = usePost()
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!comment.trim()) return

        setIsSubmitting(true)

        try {
            addComment(post._id, {
                text: comment.trim(),
                author: user.name
            })
            
            setComment('')
        } catch (error) {
            console.error('Failed to add comment:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        setComment('')
        onClose()
    }

    if (!isOpen || !post) return null

    return (
        <div className="comment-modal-overlay" onClick={handleClose}>
            <div className="comment-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="comment-modal-header">
                    <h3>{post.name}'s Post</h3>
                    <button className="close-btn" onClick={handleClose}>×</button>
                </div>
                
                <div className="original-post">
                    <div className="post-author">
                        <div className="author-avatar">
                            {post.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="author-info">
                            <h4>{post.name}</h4>
                            <p className="post-date">{post.date} at {post.time}</p>
                        </div>
                    </div>
                    <div className="post-content">
                        <p>{post.content}</p>
                    </div>
                </div>

                <div className="comments-section">
                    <h4>Comments ({post.comments?.length || 0})</h4>
                    <div className="comments-list">
                        {post.comments?.map((comment, index) => (
                            <div key={index} className="comment-item">
                                <div className="comment-avatar">
                                    {comment.author.charAt(0).toUpperCase()}
                                </div>
                                <div className="comment-content">
                                    <div className="comment-header">
                                        <span className="comment-author">{comment.author}</span>
                                        <span className="comment-time">
                                            {new Date(comment.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="comment-text">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                        {(!post.comments || post.comments.length === 0) && (
                            <p className="no-comments">No comments yet. Be the first to comment!</p>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="comment-form">
                    <div className="comment-input-container">
                        <div className="user-avatar">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="comment-input"
                            disabled={isSubmitting}
                        />
                        <button 
                            type="submit" 
                            className="comment-submit-btn"
                            disabled={isSubmitting || !comment.trim()}
                        >
                            {isSubmitting ? '...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CommentModal
