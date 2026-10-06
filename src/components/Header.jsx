import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

function Header() {
  const { itemCount } = useCart()
  const { currentUser, isAdmin, switchRole } = useAuth()
  const { orders } = useData()
  const location = useLocation()

  // Count active ongoing orders
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready for Pickup'
  ).length

  return (
    <header className="header">
      <div className="header-inner">
        {/* Brand / Logo */}
        <Link to="/" className="logo-link">
          <div className="logo">
            <svg className="apple-logo-mark" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            <span className="brand-name">CampusEats</span>
            <span className="campus-badge">IIUM</span>
          </div>
        </Link>

        {/* Desktop & Tablet Navigation */}
        <nav className="nav desktop-nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Explore
          </Link>
          <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>
            My Orders
            {activeOrdersCount > 0 && <span className="badge pulse-badge">{activeOrdersCount}</span>}
          </Link>
          <Link to="/cart" className={`cart-nav-link ${location.pathname === '/cart' ? 'active' : ''}`}>
            <span>Cart</span>
            <span className="badge">{itemCount}</span>
          </Link>
          <Link to="/admin" className={`admin-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
            <span className="admin-chip">{isAdmin ? '⚙️ Admin Panel' : '👨‍🍳 Staff View'}</span>
          </Link>
          <Link to="/profile" className={`profile-nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
            <div className="avatar-chip">
              <span className="avatar-letter">{currentUser.name.charAt(0)}</span>
              <span className="user-short-name">{currentUser.name.split(' ')[0]}</span>
            </div>
          </Link>
        </nav>

        {/* Mobile Quick Header Actions */}
        <div className="mobile-header-actions">
          <button
            onClick={() => switchRole(isAdmin ? 'student' : 'admin')}
            className={`role-toggle-btn ${isAdmin ? 'admin-active' : ''}`}
            title="Toggle Student / Admin view"
          >
            {isAdmin ? 'Admin' : 'Student'}
          </button>
          <Link to="/cart" className="mobile-cart-btn">
            🛒 <span className="badge">{itemCount}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
