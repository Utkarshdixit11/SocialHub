import React, { createContext, useContext, useState, useEffect } from 'react'

const MobileMenuContext = createContext()

export const useMobileMenu = () => {
    const context = useContext(MobileMenuContext)
    if (!context) {
        throw new Error('useMobileMenu must be used within a MobileMenuProvider')
    }
    return context
}

export const MobileMenuProvider = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    const openMobileMenu = () => {
        setIsMobileMenuOpen(true)
    }

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobileMenuOpen && 
                !event.target.closest('.sidebar') && 
                !event.target.closest('.mobile-menu-btn')) {
                setIsMobileMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isMobileMenuOpen])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('mobile-menu-open')
            document.body.style.overflow = 'hidden'
        } else {
            document.body.classList.remove('mobile-menu-open')
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.classList.remove('mobile-menu-open')
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    // Close menu on route change
    useEffect(() => {
        const handleRouteChange = () => {
            setIsMobileMenuOpen(false)
        }

        window.addEventListener('popstate', handleRouteChange)
        return () => window.removeEventListener('popstate', handleRouteChange)
    }, [])

    const value = {
        isMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
        openMobileMenu
    }

    return (
        <MobileMenuContext.Provider value={value}>
            {children}
        </MobileMenuContext.Provider>
    )
}
