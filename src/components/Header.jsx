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
            <svg className="brand-logo-svg" viewBox="0 0 980 980" width="20" height="20" fill="currentColor">
              <path fillRule="evenodd" d="M 462 428 L 425 454 L 398 368 L 501 289 L 577 237 L 624 266 L 713 331 L 754 466 L 580 342 L 462 428 Z M 280 395 L 334 558 L 526 558 L 497 644 L 271 642 L 220 487 L 265 356 L 269 360 L 280 395 Z M 281 347 L 276 327 L 408 229 L 552 231 L 382 357 L 435 531 L 435 543 L 364 545 L 351 544 L 344 540 L 281 347 Z M 445 658 L 507 656 L 567 481 L 640 531 L 620 608 L 573 751 L 408 751 L 291 659 L 445 658 Z M 757 504 L 713 649 L 608 726 L 594 733 L 658 528 L 505 413 L 566 369 L 581 362 L 759 489 L 757 504 Z" />
            </svg>
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
