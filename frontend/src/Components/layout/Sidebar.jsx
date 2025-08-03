import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useMobileMenu } from '../../context/MobileMenuContext'
import './Sidebar.css'
import { assets } from '../../assets/assets.js'

function Sidebar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuth()
    const { isMobileMenuOpen, closeMobileMenu } = useMobileMenu()
    const [currentPage, setCurrentPage] = useState('')
    const [collapsed, setCollapsed] = useState(false)

    // figure out which page we're on
    useEffect(() => {
        const currentPath = location.pathname
        if (currentPath === '/home') {
            setCurrentPage('home')
        } else if (currentPath === '/post') {
            setCurrentPage('post')
        } else if (currentPath === '/profile') {
            setCurrentPage('profile')
        } else {
            setCurrentPage('home') // default
        }
    }, [location.pathname])

    const goToPage = (pageName) => {
        setCurrentPage(pageName)
        navigate(`/${pageName}`)
        closeMobileMenu() // close mobile menu when navigating
    }

    const doLogout = () => {
        logout()
        navigate('/login')
        closeMobileMenu()
    }

    const toggleCollapse = () => {
        setCollapsed(!collapsed)
    }

    // navigation menu items
    const menuItems = [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'post', label: 'Posts', icon: '📝' },
        { id: 'profile', label: 'Profile', icon: '👤' }
    ]

    return (
        <>
            {/* overlay for mobile */}
            {isMobileMenuOpen && <div className="mobile-overlay" onClick={closeMobileMenu} />}

            <aside
                className={`sidebar ${collapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}
                role="navigation"
                aria-label="Main navigation"
            >
                {/* Header section */}
                <div className="sidebar-header">
                    <div className="brand">
                        <div className="brand-icon">🌐</div>
                        {!collapsed && <h2 className="brand-text">SocialHub</h2>}
                    </div>
                    <button
                        className="collapse-btn"
                        onClick={toggleCollapse}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        aria-expanded={!collapsed}
                    >
                        {collapsed ? '→' : '←'}
                    </button>
            </div>

                {/* User profile area */}
                <div className="user-section">
                    <div className="user-avatar">
                        <img
                            src={assets.profile}
                            alt={`${user?.name || 'User'}'s profile`}
                            className="profile-image"
                            onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'flex'
                            }}
                        />
                        <div className="profile-fallback">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>
                    {!collapsed && (
                        <div className="user-info">
                            <h3 className="user-name">{user?.name || 'User'}</h3>
                            <p className="user-email">{user?.email || 'user@example.com'}</p>
                        </div>
                    )}
                </div>

                {/* Main navigation */}
                <nav className="nav-menu" role="menu">
                    <ul className="nav-list">
                        {menuItems.map((item) => (
                            <li key={item.id} className="nav-item" role="none">
                                <button
                                    className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                                    onClick={() => goToPage(item.id)}
                                    aria-current={currentPage === item.id ? 'page' : undefined}
                                    role="menuitem"
                                >
                                    <span className="nav-icon" aria-hidden="true">
                                        {item.icon}
                                    </span>
                                    {!collapsed && (
                                        <span className="nav-text">{item.label}</span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer section */}
                <div className="sidebar-footer">
                    {!collapsed && (
                        <div className="footer-info">
                            <p className="app-version">v1.0.0</p>
                        </div>
                    )}
                    <button
                        className="logout-btn"
                        onClick={doLogout}
                        aria-label="Sign out of your account"
                    >
                        <span className="logout-icon" aria-hidden="true">🚪</span>
                        {!collapsed && <span className="logout-text">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
