import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { usePost } from '../../../context/PostContext'
import { useMobileMenu } from '../../../context/MobileMenuContext'
import Sidebar from '../../layout/Sidebar'
import Footer from '../../layout/Footer'
import MobileMenuButton from '../../layout/MobileMenuButton'
import LoadingSpinner from '../../LoadingSpinner'
import './HomePage.css'

const HomePage = () => {
    const { user } = useAuth()
    const { posts, isLoading, error, fetchPosts } = usePost()
    const { isMobileMenuOpen, toggleMobileMenu } = useMobileMenu()
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        userPosts: 0
    })

    useEffect(() => {
        if (posts.length > 0) {
            const userPosts = posts.filter(post => post.name === user?.name)
            const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0)
            const totalComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0)
            
            setStats({
                totalPosts: posts.length,
                totalLikes,
                totalComments,
                userPosts: userPosts.length
            })
        }
    }, [posts, user])

    const recentPosts = posts.slice(0, 5)
    const trendingPosts = posts
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 3)

    if (isLoading) {
        return (
            <div className="home-page">
                <Sidebar />
                <div className="home-content">
                    <LoadingSpinner size="large" message="Loading dashboard..." />
                </div>
            </div>
        )
    }

    return (
        <div className="home-page">
            <MobileMenuButton
                isOpen={isMobileMenuOpen}
                onClick={toggleMobileMenu}
            />
            <Sidebar />
            <div className="home-main-wrapper">
                <main className="home-content" role="main">
                    {/* Welcome Section */}
                    <section className="welcome-section">
                        <div className="welcome-card">
                            <div className="welcome-content">
                                <h1>Welcome back, {user?.name || 'User'}! 👋</h1>
                                <p>Here's what's happening in your community today.</p>
                            </div>
                            <div className="welcome-avatar">
                                <div className="user-avatar-large">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </div>
                        </div>
                    </section>

                {/* Stats Overview */}
                <section className="stats-section" aria-labelledby="stats-heading">
                    <h2 id="stats-heading" className="section-title">Community Overview</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">📝</div>
                            <div className="stat-content">
                                <span className="stat-number">{stats.totalPosts}</span>
                                <span className="stat-label">Total Posts</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">❤️</div>
                            <div className="stat-content">
                                <span className="stat-number">{stats.totalLikes}</span>
                                <span className="stat-label">Total Likes</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">💬</div>
                            <div className="stat-content">
                                <span className="stat-number">{stats.totalComments}</span>
                                <span className="stat-label">Comments</span>
                            </div>
                        </div>
                        <div className="stat-card highlight">
                            <div className="stat-icon">🎯</div>
                            <div className="stat-content">
                                <span className="stat-number">{stats.userPosts}</span>
                                <span className="stat-label">Your Posts</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent Activity */}
                <section className="activity-section" aria-labelledby="activity-heading">
                    <h2 id="activity-heading" className="section-title">Recent Activity</h2>
                    <div className="activity-grid">
                        <div className="activity-card">
                            <h3>Latest Posts</h3>
                            {recentPosts.length > 0 ? (
                                <div className="recent-posts">
                                    {recentPosts.map((post, index) => (
                                        <div key={index} className="recent-post-item">
                                            <div className="post-author-avatar">
                                                {post.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="post-preview">
                                                <span className="post-author">{post.name}</span>
                                                <p className="post-excerpt">
                                                    {post.content.length > 60 
                                                        ? `${post.content.substring(0, 60)}...` 
                                                        : post.content
                                                    }
                                                </p>
                                                <span className="post-time">{post.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-content">No posts yet. Be the first to share something!</p>
                            )}
                        </div>

                        <div className="activity-card">
                            <h3>Trending Posts</h3>
                            {trendingPosts.length > 0 ? (
                                <div className="trending-posts">
                                    {trendingPosts.map((post, index) => (
                                        <div key={index} className="trending-post-item">
                                            <div className="trending-rank">#{index + 1}</div>
                                            <div className="trending-content">
                                                <span className="trending-author">{post.name}</span>
                                                <p className="trending-excerpt">
                                                    {post.content.length > 50 
                                                        ? `${post.content.substring(0, 50)}...` 
                                                        : post.content
                                                    }
                                                </p>
                                                <div className="trending-stats">
                                                    <span>❤️ {post.likes || 0}</span>
                                                    <span>💬 {post.comments?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-content">No trending posts yet.</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="quick-actions-section" aria-labelledby="actions-heading">
                    <h2 id="actions-heading" className="section-title">Quick Actions</h2>
                    <div className="quick-actions">
                        <button 
                            className="action-button primary"
                            onClick={() => window.location.href = '/post'}
                            aria-label="Create a new post"
                        >
                            <span className="action-icon">✏️</span>
                            <span>Create Post</span>
                        </button>
                        <button 
                            className="action-button secondary"
                            onClick={() => window.location.href = '/profile'}
                            aria-label="View your profile"
                        >
                            <span className="action-icon">👤</span>
                            <span>View Profile</span>
                        </button>
                        <button 
                            className="action-button secondary"
                            onClick={() => window.location.href = '/post'}
                            aria-label="Browse all posts"
                        >
                            <span className="action-icon">🔍</span>
                            <span>Browse Posts</span>
                        </button>
                    </div>
                </section>
                </main>
                <Footer />
            </div>
        </div>
    )
}

export default HomePage
