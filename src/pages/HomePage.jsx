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
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false
      }
      if (selectedFilter === 'Budget' && item.price > 5.0) {
        return false
      }
      if (selectedFilter === 'Popular' && !item.isPopular) {
        return false
      }
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
      {/* Hero Showcase */}
      <section className="hero-section">
        <span className="hero-eyebrow">CampusEats &bull; IIUM Dining</span>
        <h2 className="hero-headline">
          Skip the queue.<br />Pick up warm & ready.
        </h2>
        <p className="hero-subheadline">
          Pre-order meals from Mahallah cafeterias before walking over between classes.
        </p>

        {/* Minimal Search Bar */}
        <div className="search-bar-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search dishes or stalls..."
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

        {/* Minimalist Category Pills */}
        <div className="category-scroll-container">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Vendors Section */}
      <section className="section-group">
        <div className="section-header">
          <div>
            <h2>Mahallah Stalls</h2>
            <p className="section-subtitle">Real-time status across campus</p>
          </div>
          <span className="section-badge">{filteredVendors.length} Stalls</span>
        </div>

        <div className="vendors-grid">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </section>

      {/* Food Items Section */}
      <section className="section-group">
        <div className="section-header">
          <div>
            <h2>
              {searchQuery ? `Results for "${searchQuery}"` : `${selectedCategory} Menu`}
            </h2>
            <p className="section-subtitle">
              {filteredItems.length} dishes available
            </p>
          </div>

          {/* Quick Filter */}
          <div className="filter-chips-row">
            <button
              className={`filter-chip ${selectedFilter === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('All')}
            >
              All
            </button>
            <button
              className={`filter-chip ${selectedFilter === 'Popular' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('Popular')}
            >
              Popular
            </button>
            <button
              className={`filter-chip ${selectedFilter === 'Budget' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('Budget')}
            >
              Under RM 5
            </button>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="empty-search-state">
            <h3>No dishes found</h3>
            <p>Try searching for another dish or reset filters.</p>
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

      {/* Minimalist Voucher Banner */}
      <section className="campus-banner-bento">
        <div className="banner-content">
          <span className="banner-badge">Student Privilege</span>
          <h3>Use Code "IIUMEATS" for RM 2.00 Off</h3>
          <p>Valid for all registered IIUM students across participating Mahallah cafeterias.</p>
        </div>
        <Link to="/cart" className="banner-cta-btn">
          View Tray &rarr;
        </Link>
      </section>
    </div>
  )
}

export default HomePage
