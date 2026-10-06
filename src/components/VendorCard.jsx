import { Link } from 'react-router-dom'

function VendorCard({ vendor }) {
  const defaultVendor = {
    id: 'faruq',
    name: 'Kafe Mahallah Faruq',
    tagline: 'Authentic Malay Breakfast & Traditional Nasi Campur',
    location: 'Mahallah Faruq, Block B (Ground Floor)',
    openHours: '7:30 AM – 10:30 PM',
    isOpen: true,
    rating: 4.8,
    reviewCount: 320,
    cuisine: 'Traditional Malay',
    image: '🍚',
    deliveryOrPickup: 'Pickup in 10-15 mins',
    announcement: 'Fresh batch of Sambal Sotong ready at 12:00 PM!',
  }

  const v = vendor || defaultVendor

  return (
    <article className="vendor-card">
      <div className="thumb">{v.image || v.name[0]}</div>
      <div className="vendor-body">
        <div className="vendor-top-row">
          <div>
            <span className="eyebrow-tag">{v.cuisine || 'Campus Dining'}</span>
            <h3 className="vendor-title">
              <Link to={`/vendor/${v.id}`} className="vendor-title-link">
                {v.name}
              </Link>
            </h3>
          </div>
          <span className={`status ${v.isOpen ? 'open' : 'closed'}`}>
            <span className="status-indicator"></span>
            {v.isOpen ? 'Open now' : 'Closed'}
          </span>
        </div>

        {v.tagline && <p className="vendor-tagline">{v.tagline}</p>}

        <div className="vendor-details-row">
          <p className="location">
            <span className="detail-icon">📍</span> {v.location}
          </p>
          <span className="dot-separator">•</span>
          <p className="hours">
            <span className="detail-icon">🕒</span> {v.openHours}
          </p>
          <span className="dot-separator">•</span>
          <p className="rating">
            <span className="star-icon">★</span> {v.rating} <span className="reviews">({v.reviewCount || 100})</span>
          </p>
        </div>

        {v.announcement && (
          <div className="vendor-announcement-chip">
            <span className="announcement-bell">📢</span>
            <span className="announcement-text">{v.announcement}</span>
          </div>
        )}

        <div className="vendor-card-footer">
          <span className="pickup-speed">⚡ {v.deliveryOrPickup || 'Pickup in 10-15 mins'}</span>
          <Link to={`/vendor/${v.id}`} className="btn-secondary-pill">
            View Menu &rarr;
          </Link>
        </div>
      </div>
    </article>
  )
}

export default VendorCard
