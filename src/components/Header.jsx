import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

function Header() {
  const { itemCount } = useCart()
  const { currentUser, isAdmin, switchRole } = useAuth()
  const { orders } = useData()
  const location = useLocation()

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready for Pickup'
  ).length

  return (
    <header className="header">
      <div className="header-inner">
        {/* Brand / Logo */}
        <Link to="/" className="logo-link">
          <div className="logo">
            <img src="favicon.svg" alt="CampusEats Icon" width="20" height="20" className="brand-logo-mark" />
            <span className="brand-name">CampusEats</span>
            <span className="campus-badge">IIUM</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav desktop-nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Explore
          </Link>
          <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>
            Orders
            {activeOrdersCount > 0 && <span className="badge">{activeOrdersCount}</span>}
          </Link>
          <Link to="/cart" className={`cart-nav-link ${location.pathname === '/cart' ? 'active' : ''}`}>
            <span>Tray</span>
            <span className="badge">{itemCount}</span>
          </Link>
          <Link to="/admin" className={`admin-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
            <span className="admin-chip">{isAdmin ? 'Admin' : 'Kitchen'}</span>
          </Link>
          <Link to="/profile" className={`profile-nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
            <div className="avatar-chip">
              <span className="avatar-letter">{currentUser.name.charAt(0)}</span>
              <span className="user-short-name">{currentUser.name.split(' ')[0]}</span>
            </div>
          </Link>
        </nav>

        {/* Mobile Header Actions */}
        <div className="mobile-header-actions">
          <button
            onClick={() => switchRole(isAdmin ? 'student' : 'admin')}
            className={`role-toggle-btn ${isAdmin ? 'admin-active' : ''}`}
          >
            {isAdmin ? 'Admin' : 'Student'}
          </button>
          <Link to="/cart" className="mobile-cart-btn" aria-label="View Tray">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {itemCount > 0 && <span className="badge">{itemCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
