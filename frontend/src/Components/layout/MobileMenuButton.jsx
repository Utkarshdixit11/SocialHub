import React from 'react'
import './MobileMenuButton.css'

const MobileMenuButton = ({ isOpen, onClick, className = '' }) => {
    return (
        <button 
            className={`mobile-menu-btn ${isOpen ? 'open' : ''} ${className}`}
            onClick={onClick}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            type="button"
        >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
        </button>
    )
}

export default MobileMenuButton
