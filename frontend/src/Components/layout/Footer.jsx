import React, { useState } from 'react'
import './Footer.css'

const Footer = () => {
    const currentYear = new Date().getFullYear()
    const [email, setEmail] = useState('')
    const [isSubscribed, setIsSubscribed] = useState(false)

    const footerLinks = {
        company: [
            { label: 'About Us', href: '#about', ariaLabel: 'Learn about our company' },
            { label: 'Careers', href: '#careers', ariaLabel: 'View career opportunities' },
            { label: 'Press', href: '#press', ariaLabel: 'Press releases and media' },
            { label: 'Blog', href: '#blog', ariaLabel: 'Read our blog' }
        ],
        support: [
            { label: 'Help Center', href: '#help', ariaLabel: 'Get help and support' },
            { label: 'Contact Us', href: '#contact', ariaLabel: 'Contact our support team' },
            { label: 'Community', href: '#community', ariaLabel: 'Join our community' },
            { label: 'Status', href: '#status', ariaLabel: 'Check service status' }
        ],
        legal: [
            { label: 'Privacy Policy', href: '#privacy', ariaLabel: 'Read our privacy policy' },
            { label: 'Terms of Service', href: '#terms', ariaLabel: 'Read our terms of service' },
            { label: 'Cookie Policy', href: '#cookies', ariaLabel: 'Learn about our cookie policy' },
            { label: 'GDPR', href: '#gdpr', ariaLabel: 'GDPR compliance information' }
        ]
    }

    const socialLinks = [
        { 
            platform: 'Twitter', 
            icon: '🐦', 
            href: 'https://twitter.com/socialhub',
            ariaLabel: 'Follow us on Twitter'
        },
        { 
            platform: 'Facebook', 
            icon: '📘', 
            href: 'https://facebook.com/socialhub',
            ariaLabel: 'Follow us on Facebook'
        },
        { 
            platform: 'LinkedIn', 
            icon: '💼', 
            href: 'https://linkedin.com/company/socialhub',
            ariaLabel: 'Connect with us on LinkedIn'
        },
        { 
            platform: 'Instagram', 
            icon: '📷', 
            href: 'https://instagram.com/socialhub',
            ariaLabel: 'Follow us on Instagram'
        },
        { 
            platform: 'GitHub', 
            icon: '🐙', 
            href: 'https://github.com/socialhub',
            ariaLabel: 'View our code on GitHub'
        }
    ]

    const handleLinkClick = (e, href) => {
        e.preventDefault()
        // In a real app, these would navigate to actual pages
        console.log(`Navigating to: ${href}`)
    }

    const handleNewsletterSubmit = (e) => {
        e.preventDefault()
        if (email) {
            console.log(`Newsletter subscription for: ${email}`)
            setIsSubscribed(true)
            setEmail('')
            // Reset success message after 3 seconds
            setTimeout(() => setIsSubscribed(false), 3000)
        }
    }

    return (
        <footer className="footer" role="contentinfo">
            <div className="footer-container">
                {/* Main Footer Content */}
                <div className="footer-main">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <div className="brand-logo">
                            <span className="brand-icon">🌐</span>
                            <h3 className="brand-name">SocialHub</h3>
                        </div>
                        <p className="brand-description">
                            Connect, share, and discover with our vibrant community. 
                            Building meaningful connections in the digital age.
                        </p>
                        <div className="social-links">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.platform}
                                    href={social.href}
                                    className="social-link"
                                    aria-label={social.ariaLabel}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => handleLinkClick(e, social.href)}
                                >
                                    <span className="social-icon" aria-hidden="true">
                                        {social.icon}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="footer-links">
                        <div className="link-section">
                            <h4 className="link-section-title">Company</h4>
                            <ul className="link-list">
                                {footerLinks.company.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="footer-link"
                                            aria-label={link.ariaLabel}
                                            onClick={(e) => handleLinkClick(e, link.href)}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="link-section">
                            <h4 className="link-section-title">Support</h4>
                            <ul className="link-list">
                                {footerLinks.support.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="footer-link"
                                            aria-label={link.ariaLabel}
                                            onClick={(e) => handleLinkClick(e, link.href)}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="link-section">
                            <h4 className="link-section-title">Legal</h4>
                            <ul className="link-list">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="footer-link"
                                            aria-label={link.ariaLabel}
                                            onClick={(e) => handleLinkClick(e, link.href)}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter Signup */}
                    <div className="footer-newsletter">
                        <h4 className="newsletter-title">Stay Updated</h4>
                        <p className="newsletter-description">
                            Get the latest updates and features delivered to your inbox.
                        </p>
                        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                            <div className="newsletter-input-group">
                                <input
                                    type="email"
                                    className="newsletter-input"
                                    placeholder="Enter your email"
                                    aria-label="Email address for newsletter"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="newsletter-button"
                                    aria-label="Subscribe to newsletter"
                                    disabled={!email}
                                >
                                    Subscribe
                                </button>
                            </div>
                            {isSubscribed && (
                                <div className="newsletter-success">
                                    ✅ Thank you for subscribing!
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p className="copyright">
                            © {currentYear} SocialHub. All rights reserved.
                        </p>
                        <div className="footer-bottom-links">
                            <a 
                                href="#accessibility" 
                                className="footer-bottom-link"
                                onClick={(e) => handleLinkClick(e, '#accessibility')}
                            >
                                Accessibility
                            </a>
                            <a 
                                href="#sitemap" 
                                className="footer-bottom-link"
                                onClick={(e) => handleLinkClick(e, '#sitemap')}
                            >
                                Sitemap
                            </a>
                            <a 
                                href="#feedback" 
                                className="footer-bottom-link"
                                onClick={(e) => handleLinkClick(e, '#feedback')}
                            >
                                Feedback
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
