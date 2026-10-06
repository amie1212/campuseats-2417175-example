import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import VendorCard from '../components/VendorCard'
import MenuItemCard from '../components/MenuItemCard'

function HomePage() {
  const { vendors, menuItems } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedFilter, setSelectedFilter] = useState('All')

  const categories = ['All', 'Rice', 'Noodles', 'Western', 'Beverages', 'Snacks']

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false
      }
      // Quick special filter
      if (selectedFilter === 'Budget Saver' && item.price > 5.0) {
        return false
      }
      if (selectedFilter === 'Popular Only' && !item.isPopular) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesName = item.name.toLowerCase().includes(query)
        const matchesDesc = item.description.toLowerCase().includes(query)
        const matchesCategory = item.category.toLowerCase().includes(query)
        return matchesName || matchesDesc || matchesCategory
      }
      return true
    })
  }, [menuItems, selectedCategory, selectedFilter, searchQuery])

  // Filtered vendors based on search query
  const filteredVendors = useMemo(() => {
    if (!searchQuery.trim()) return vendors
    const q = searchQuery.toLowerCase()
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.cuisine.toLowerCase().includes(q)
    )
  }, [vendors, searchQuery])

  return (
    <div className="home-page">
      {/* Apple-style Hero Showcase */}
      <section className="hero-section">
        <span className="hero-eyebrow">CampusEats &bull; IIUM Mahallah Dining</span>
        <h2 className="hero-headline">
          Skip the queue.<br />Pick up warm & ready.
        </h2>
        <p className="hero-subheadline">
          Order breakfast, lunch, and late-night supper from your favourite mahallah cafeterias before walking over.
        </p>

        {/* Global Search Bar */}
        <div className="search-bar-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search dishes (e.g. Nasi Lemak, Roti Canai, Milo Dinosaur)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search dishes and stalls"
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="category-scroll-container">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'All' && '✨ '}
              {cat === 'Rice' && '🍚 '}
              {cat === 'Noodles' && '🍜 '}
              {cat === 'Western' && '🍔 '}
              {cat === 'Beverages' && '🧋 '}
              {cat === 'Snacks' && '🥟 '}
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Vendors Section */}
      <section className="section-group">
        <div className="section-header">
          <div>
            <h2>Campus Mahallah Stalls</h2>
            <p className="section-subtitle">Real-time open & prep times across campus</p>
          </div>
          <span className="section-badge">{filteredVendors.length} Stalls Active</span>
        </div>

        <div className="vendors-grid">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </section>

      {/* Popular & Filtered Food Items Section */}
      <section className="section-group">
        <div className="section-header">
          <div>
            <h2>
              {searchQuery ? `Search Results for "${searchQuery}"` : `${selectedCategory} Specials`}
            </h2>
            <p className="section-subtitle">
              {filteredItems.length} dishes available for quick pickup
            </p>
          </div>

          {/* Quick Filter Segmented Control */}
          <div className="filter-chips-row">
            <button
              className={`filter-chip ${selectedFilter === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('All')}
            >
              All Items
            </button>
            <button
              className={`filter-chip ${selectedFilter === 'Popular Only' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('Popular Only')}
            >
              🔥 Popular
            </button>
            <button
              className={`filter-chip ${selectedFilter === 'Budget Saver' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('Budget Saver')}
            >
              🪙 Under RM 5
            </button>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="empty-search-state">
            <span className="empty-emoji">🥣</span>
            <h3>No dishes found</h3>
            <p>Try searching for a different dish name or reset filters.</p>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setSelectedFilter('All')
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Campus Highlight Banner */}
      <section className="campus-banner-bento">
        <div className="banner-content">
          <span className="banner-badge">IIUM Student Deal</span>
          <h3>Use Voucher "IIUMEATS" for RM 2.00 OFF</h3>
          <p>Valid for all registered IIUM students across all participating Mahallah cafeterias.</p>
        </div>
        <Link to="/cart" className="banner-cta-btn">
          View Cart &rarr;
        </Link>
      </section>
    </div>
  )
}

export default HomePage
