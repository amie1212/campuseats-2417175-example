import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useCart } from '../context/CartContext'
import MenuItemCard from '../components/MenuItemCard'

function VendorDetailPage() {
  const { id } = useParams()
  const { vendors, getMenuItemsByVendor } = useData()
  const { itemCount, total, currentVendorId } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('All')

  const vendor = vendors.find((v) => v.id === id) || vendors[0]
  const vendorItems = getMenuItemsByVendor(vendor.id)

  const categories = ['All', ...new Set(vendorItems.map((i) => i.category))]

  const filteredItems =
    selectedCategory === 'All'
      ? vendorItems
      : vendorItems.filter((i) => i.category === selectedCategory)

  return (
    <div className="vendor-detail-page">
      {/* Back Link */}
      <div className="page-nav-back">
        <Link to="/" className="back-link">
          &larr; Back to all stalls
        </Link>
      </div>

      {/* Vendor Hero Banner */}
      <section className="vendor-hero-card">
        <div className="vendor-hero-header">
          <div className="vendor-hero-avatar">{vendor.name.charAt(0)}</div>
          <div className="vendor-hero-info">
            <div className="vendor-hero-badges">
              <span className="eyebrow-tag">{vendor.cuisine}</span>
              <span className={`status ${vendor.isOpen ? 'open' : 'closed'}`}>
                <span className="status-indicator"></span>
                {vendor.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
            <h1 className="vendor-hero-title">{vendor.name}</h1>
            <p className="vendor-hero-tagline">{vendor.tagline}</p>

            <div className="vendor-hero-meta">
              <span>{vendor.location}</span>
              <span>&bull;</span>
              <span>{vendor.openHours}</span>
              <span>&bull;</span>
              <span>★ {vendor.rating} ({vendor.reviewCount || 150})</span>
              <span>&bull;</span>
              <span>{vendor.deliveryOrPickup}</span>
            </div>
          </div>
        </div>

        {vendor.announcement && (
          <div className="vendor-hero-announcement">
            <span className="announcement-msg">{vendor.announcement}</span>
          </div>
        )}
      </section>

      {/* Category Navigation Pills */}
      <div className="stall-category-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`stall-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat} ({cat === 'All' ? vendorItems.length : vendorItems.filter((i) => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <section className="section-group">
        <div className="section-header">
          <h2>Menu</h2>
          <span className="section-badge">{filteredItems.length} items</span>
        </div>

        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <p>No items found under this category.</p>
          </div>
        ) : (
          <div className="grid">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Sticky Bottom Cart Bar on Mobile when items are present */}
      {itemCount > 0 && currentVendorId === vendor.id && (
        <div className="sticky-mobile-cart-bar">
          <div className="sticky-cart-summary">
            <span className="sticky-count">{itemCount} items in tray</span>
            <span className="sticky-total">RM {total.toFixed(2)}</span>
          </div>
          <Link to="/cart" className="btn sticky-cart-btn">
            View Tray &rarr;
          </Link>
        </div>
      )}
    </div>
  )
}

export default VendorDetailPage
