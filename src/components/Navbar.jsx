import { Link, useLocation } from 'react-router-dom'
import { Home, Archive, Mail, Hammer } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
    const location = useLocation()

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return 'active'
        if (path !== '/' && location.pathname.startsWith(path)) return 'active'
        return ''
    }

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">
                <img
                    src="https://image-api.rasa.io/image/self-service-logos/path/2024-01-27/files/78fe1ab5-3ea9-41f7-bfc5-dbcb7a3b72df?h=60"
                    alt="RenovationPlaza"
                    className="brand-logo"
                />
            </Link>
            <div className="nav-links">
                <Link to="/" className={`nav-link ${isActive('/')}`}>
                    <Home size={20} />
                    <span className="link-text">Latest</span>
                </Link>
                <Link to="/archive" className={`nav-link ${isActive('/archive')}`}>
                    <Archive size={20} />
                    <span className="link-text">Archive</span>
                </Link>
                <Link to="/subscribe" className={`nav-link ${isActive('/subscribe')}`}>
                    <Mail size={20} />
                    <span className="link-text">Subscribe</span>
                </Link>
            </div>
        </nav>
    )
}
