import React, { useState } from 'react'
import "./post.css"
import Sidebar from '../../layout/Sidebar'
import Footer from '../../layout/Footer'
import MobileMenuButton from '../../layout/MobileMenuButton'
import CreatePostModal from '../../../components/CreatePostModal'
import CommentModal from '../../../components/CommentModal'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { usePost } from '../../../context/PostContext'
import { useAuth } from '../../../context/AuthContext'
import { useMobileMenu } from '../../../context/MobileMenuContext'
import { assets } from '../../../assets/assets.js';

const post = () => {
    const { posts, likePost, isLoading, error, fetchPosts } = usePost()
    const { user } = useAuth()
    const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenu()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
    const [selectedPost, setSelectedPost] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('newest')

    const handleLike = (postId) => {
        likePost(postId, user.id)
    }

    const handleComment = (post) => {
        setSelectedPost(post)
        setIsCommentModalOpen(true)
    }

    const handleShare = (post) => {
        if (navigator.share) {
            navigator.share({
                title: `${post.name}'s post`,
                text: post.content,
                url: window.location.href
            })
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(`${post.name}: ${post.content}`)
            alert('Post content copied to clipboard!')
        }
    }

    // Filter and sort posts
    const filteredAndSortedPosts = posts
        .filter(post =>
            post.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.date) - new Date(a.date)
                case 'oldest':
                    return new Date(a.date) - new Date(b.date)
                case 'mostLiked':
                    return (b.likes || 0) - (a.likes || 0)
                case 'mostCommented':
                    return (b.comments?.length || 0) - (a.comments?.length || 0)
                default:
                    return 0
            }
        })

    return (
        <div className='post'>
            <MobileMenuButton
                isOpen={isMobileMenuOpen}
                onClick={toggleMobileMenu}
            />
            <Sidebar />
            <div className="post-main-wrapper">
                <main className='feed' role="main">
                <button
                    className='createpost'
                    onClick={() => setIsModalOpen(true)}
                    aria-label="Create a new post"
                    type="button"
                >
                    <img src={assets.addIcon} alt="Add post icon" />
                    <h4>Create Post</h4>
                </button>

                <div className='search-filter-container'>
                    <div className='search-box'>
                        <input
                            type="text"
                            placeholder="Search posts or users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='search-input'
                        />
                    </div>
                    <div className='filter-box'>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className='sort-select'
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="mostLiked">Most Liked</option>
                            <option value="mostCommented">Most Commented</option>
                        </select>
                    </div>
                </div>

                <div className='Allposts'>
                    {error ? (
                        <div className="error-message">
                            <p>⚠️ Failed to load posts: {error}</p>
                            <button
                                onClick={fetchPosts}
                                className="retry-button"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : isLoading ? (
                        <LoadingSpinner size="large" message="Loading posts..." />
                    ) : filteredAndSortedPosts.length === 0 ? (
                        <div className="no-posts-found">
                            <p>No posts found matching your search.</p>
                            <p>Try adjusting your search terms or filters.</p>
                        </div>
                    ) : (
                        filteredAndSortedPosts.map((item, index) => {
                        const isLiked = item.likedBy?.includes(user.id)
                        return (
                            <div key={index} className='cardpost'>
                                <div className="post-header">
                                    <div className="post-author">
                                        <div className="author-avatar">
                                            {item.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="author-info">
                                            <h3>{item.name}</h3>
                                            <p className="post-date">{item.date} at {item.time}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="post-content">
                                    <p>{item.content}</p>
                                </div>
                                <div className="post-actions">
                                    <button
                                        className={`like-btn ${isLiked ? 'liked' : ''}`}
                                        onClick={() => handleLike(item._id)}
                                    >
                                        ❤️ {item.likes || 0}
                                    </button>
                                    <button
                                        className="comment-btn"
                                        onClick={() => handleComment(item)}
                                    >
                                        💬 {item.comments?.length || 0}
                                    </button>
                                    <button
                                        className="share-btn"
                                        onClick={() => handleShare(item)}
                                    >
                                        🔗 Share
                                    </button>
                                </div>
                            </div>
                        )
                    }))}
                </div>
                </main>
                <Footer />
            </div>
            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <CommentModal
                isOpen={isCommentModalOpen}
                onClose={() => setIsCommentModalOpen(false)}
                post={selectedPost}
            />
        </div>
    )
}

export default post
