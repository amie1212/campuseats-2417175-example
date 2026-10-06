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
        <span className="tab-icon">🏠</span>
        <span className="tab-label">Explore</span>
      </Link>

      <Link to="/orders" className={`tab-item ${location.pathname === '/orders' ? 'active' : ''}`}>
        <span className="tab-icon tab-icon-badge-wrap">
          🧾
          {activeOrders > 0 && <span className="tab-badge">{activeOrders}</span>}
        </span>
        <span className="tab-label">Orders</span>
      </Link>

      <Link to="/cart" className={`tab-item ${location.pathname === '/cart' ? 'active' : ''}`}>
        <span className="tab-icon tab-icon-badge-wrap">
          🛒
          {itemCount > 0 && <span className="tab-badge">{itemCount}</span>}
        </span>
        <span className="tab-label">Cart</span>
      </Link>

      <Link to="/admin" className={`tab-item ${location.pathname === '/admin' ? 'active' : ''}`}>
        <span className="tab-icon">{isAdmin ? '⚙️' : '👨‍🍳'}</span>
        <span className="tab-label">{isAdmin ? 'Admin' : 'Kitchen'}</span>
      </Link>

      <Link to="/profile" className={`tab-item ${location.pathname === '/profile' ? 'active' : ''}`}>
        <span className="tab-icon">👤</span>
        <span className="tab-label">Profile</span>
      </Link>
    </div>
  )
}

export default MobileTabBar
