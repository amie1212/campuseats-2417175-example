import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'

function MobileTabBar() {
  const location = useLocation()
  const { itemCount } = useCart()
  const { orders } = useData()
  const { isAdmin } = useAuth()

  const activeOrders = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready for Pickup'
  ).length

  return (
    <div className="mobile-tab-bar">
      <Link to="/" className={`tab-item ${location.pathname === '/' ? 'active' : ''}`}>
        <svg className="tab-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span className="tab-label">Explore</span>
      </Link>

      <Link to="/orders" className={`tab-item ${location.pathname === '/orders' ? 'active' : ''}`}>
        <div className="tab-icon-wrap">
          <svg className="tab-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          {activeOrders > 0 && <span className="tab-badge">{activeOrders}</span>}
        </div>
        <span className="tab-label">Orders</span>
      </Link>

      <Link to="/cart" className={`tab-item ${location.pathname === '/cart' ? 'active' : ''}`}>
        <div className="tab-icon-wrap">
          <svg className="tab-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {itemCount > 0 && <span className="tab-badge">{itemCount}</span>}
        </div>
        <span className="tab-label">Tray</span>
      </Link>

      <Link to="/admin" className={`tab-item ${location.pathname === '/admin' ? 'active' : ''}`}>
        <svg className="tab-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="21" x2="4" y2="14"></line>
          <line x1="4" y1="10" x2="4" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="3"></line>
          <line x1="20" y1="21" x2="20" y2="16"></line>
          <line x1="20" y1="12" x2="20" y2="3"></line>
          <line x1="1" y1="14" x2="7" y2="14"></line>
          <line x1="9" y1="8" x2="15" y2="8"></line>
          <line x1="17" y1="16" x2="23" y2="16"></line>
        </svg>
        <span className="tab-label">{isAdmin ? 'Admin' : 'Kitchen'}</span>
      </Link>

      <Link to="/profile" className={`tab-item ${location.pathname === '/profile' ? 'active' : ''}`}>
        <svg className="tab-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span className="tab-label">Profile</span>
      </Link>
    </div>
  )
}

export default MobileTabBar
