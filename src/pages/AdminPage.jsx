import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import Modal from '../components/Modal'

function AdminPage() {
  const {
    vendors,
    menuItems,
    orders,
    toggleVendorStatus,
    updateVendorAnnouncement,
    toggleItemAvailability,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateOrderStatus,
    resetAllData,
  } = useData()

  const { currentUser, isAdmin, switchRole } = useAuth()
  const { showToast } = useToast()

  // Selected vendor to manage
  const [selectedVendorId, setSelectedVendorId] = useState('faruq')
  const [activeTab, setActiveTab] = useState('orders') // 'orders', 'menu', 'analytics', 'settings'

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(null)

  // New item form
  const [newItemForm, setNewItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Rice',
    prepTime: '10 mins',
    dietary: 'Halal, Popular',
    imageEmoji: '🍲',
  })

  // Stall announcement state
  const currentVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0]
  const [announcementText, setAnnouncementText] = useState(currentVendor?.announcement || '')

  // Menu items for current vendor
  const stallMenuItems = menuItems.filter((item) => item.vendorId === selectedVendorId)

  // Orders for current vendor
  const stallOrders = orders.filter((order) => order.vendorId === selectedVendorId)

  // Orders metrics
  const totalRevenue = stallOrders
    .filter((o) => o.status === 'Completed' || o.status === 'Ready for Pickup')
    .reduce((sum, o) => sum + o.total, 0)

  const pendingOrdersCount = stallOrders.filter(
    (o) => o.status === 'Pending' || o.status === 'Preparing'
  ).length

  // Quick switch role if not admin
  if (!isAdmin) {
    return (
      <div className="admin-access-gate">
        <div className="gate-card">
          <span className="gate-icon">🔐</span>
          <h2>CampusEats Cafeteria Portal</h2>
          <p>
            You are currently signed in as a student (<strong>{currentUser.name}</strong>). To manage
            cafeteria kitchen orders, toggle food availability, and edit menus, switch to Staff / Admin mode.
          </p>
          <div className="gate-actions">
            <button
              onClick={() => {
                switchRole('admin')
                showToast('Switched to Cafeteria Staff & Admin Mode', 'success')
              }}
              className="btn btn-primary-lg"
            >
              Enter as Mahallah Cafe Manager &rarr;
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Handle adding new item
  const handleCreateDish = (e) => {
    e.preventDefault()
    if (!newItemForm.name || !newItemForm.price) {
      showToast('Please fill in dish name and price', 'warning')
      return
    }

    const dietaryArray = newItemForm.dietary
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    addMenuItem({
      ...newItemForm,
      vendorId: selectedVendorId,
      dietary: dietaryArray,
    })

    showToast(`Added "${newItemForm.name}" to menu`, 'success')
    setIsAddModalOpen(false)
    setNewItemForm({
      name: '',
      description: '',
      price: '',
      category: 'Rice',
      prepTime: '10 mins',
      dietary: 'Halal, Popular',
      imageEmoji: '🍲',
    })
  }

  // Handle updating item
  const handleSaveEditDish = (e) => {
    e.preventDefault()
    if (!itemToEdit) return

    updateMenuItem(itemToEdit.id, {
      name: itemToEdit.name,
      description: itemToEdit.description,
      price: itemToEdit.price,
      category: itemToEdit.category,
      prepTime: itemToEdit.prepTime,
      imageEmoji: itemToEdit.imageEmoji,
    })

    showToast(`Updated "${itemToEdit.name}"`, 'success')
    setIsEditModalOpen(false)
    setItemToEdit(null)
  }

  const handleDeleteDish = (id, name) => {
    const confirm = window.confirm(`Delete "${name}" from stall menu?`)
    if (confirm) {
      deleteMenuItem(id)
      showToast(`Deleted ${name}`, 'info')
    }
  }

  const handleSaveAnnouncement = (e) => {
    e.preventDefault()
    updateVendorAnnouncement(selectedVendorId, announcementText)
    showToast('Announcement broadcasted to students!', 'success')
  }

  return (
    <div className="admin-page">
      {/* Top Banner / Stall Switcher */}
      <div className="admin-header-bar">
        <div>
          <div className="admin-eyebrow-row">
            <span className="admin-role-badge">Cafeteria Kitchen Control</span>
            <span className="admin-user-tag">{currentUser.name}</span>
          </div>
          <h1 className="admin-title">Stall Operations Dashboard</h1>
        </div>

        {/* Vendor Selector dropdown */}
        <div className="vendor-switch-wrapper">
          <label className="vendor-switch-label">Managing Stall:</label>
          <select
            className="apple-select"
            value={selectedVendorId}
            onChange={(e) => {
              setSelectedVendorId(e.target.value)
              const v = vendors.find((vend) => vend.id === e.target.value)
              setAnnouncementText(v?.announcement || '')
            }}
          >
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.isOpen ? 'Open' : 'Closed'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stall Status Card */}
      <div className="stall-quick-status-card">
        <div className="status-card-left">
          <span className="stall-large-avatar">{currentVendor.image || '🍽️'}</span>
          <div>
            <h3 className="stall-card-title">{currentVendor.name}</h3>
            <p className="stall-card-meta">📍 {currentVendor.location}</p>
          </div>
        </div>

        <div className="status-card-right">
          <button
            onClick={() => {
              toggleVendorStatus(selectedVendorId)
              showToast(
                `${currentVendor.name} is now ${!currentVendor.isOpen ? 'OPEN' : 'CLOSED'}`,
                'info'
              )
            }}
            className={`btn-toggle-status ${currentVendor.isOpen ? 'status-open-active' : 'status-closed-active'}`}
          >
            {currentVendor.isOpen ? '🟢 Stall Open for Orders' : '🔴 Stall Closed (Paused)'}
          </button>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="admin-tabs-nav">
        <button
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          🍳 Kitchen Orders Queue ({stallOrders.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          📋 Menu Management ({stallMenuItems.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Sales & Performance
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Stall Settings
        </button>
      </div>

      {/* TAB 1: KITCHEN ORDERS QUEUE */}
      {activeTab === 'orders' && (
        <section className="admin-section">
          <div className="section-header">
            <div>
              <h2>Live Kitchen Display System (KDS)</h2>
              <p className="section-subtitle">
                Incoming student orders for {currentVendor.name}. Advance status as food is prepared.
              </p>
            </div>
            <span className="section-badge">{pendingOrdersCount} In Progress</span>
          </div>

          {stallOrders.length === 0 ? (
            <div className="empty-state">
              <p>No orders placed yet for this cafeteria.</p>
            </div>
          ) : (
            <div className="admin-orders-grid">
              {stallOrders.map((ord) => (
                <div key={ord.id} className="admin-order-ticket">
                  <div className="ticket-top">
                    <div className="ticket-code-tag">#{ord.pickupCode}</div>
                    <span className={`status-pill-small status-${ord.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {ord.status}
                    </span>
                  </div>

                  <div className="ticket-customer-box">
                    <h4 className="customer-name">{ord.customerName}</h4>
                    <span className="customer-sub">
                      Matric: {ord.matricNo} &bull; 📞 {ord.phone}
                    </span>
                    <span className="customer-time">
                      Pickup: <strong>{ord.pickupTime}</strong> ({ord.orderType})
                    </span>
                  </div>

                  {ord.specialInstructions && (
                    <div className="ticket-instruction">
                      <strong>Note:</strong> "{ord.specialInstructions}"
                    </div>
                  )}

                  <div className="ticket-items-box">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="ticket-dish-row">
                        <span className="dish-qty-name">
                          <strong>{it.quantity}x</strong> {it.name}
                        </span>
                        {it.notes && <span className="dish-note">👉 {it.notes}</span>}
                      </div>
                    ))}
                  </div>

                  <div className="ticket-footer">
                    <span className="ticket-amount">Total: RM {ord.total.toFixed(2)}</span>

                    {/* Fast Status Action Buttons */}
                    <div className="ticket-actions">
                      {ord.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => {
                              updateOrderStatus(ord.id, 'Preparing')
                              showToast(`Order #${ord.pickupCode} is now Cooking!`, 'info')
                            }}
                            className="btn-status-action btn-cook"
                          >
                            🍳 Start Cooking
                          </button>
                          <button
                            onClick={() => {
                              updateOrderStatus(ord.id, 'Cancelled')
                              showToast(`Order #${ord.pickupCode} cancelled`, 'warning')
                            }}
                            className="btn-status-action btn-cancel"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {ord.status === 'Preparing' && (
                        <button
                          onClick={() => {
                            updateOrderStatus(ord.id, 'Ready for Pickup')
                            showToast(`Order #${ord.pickupCode} marked Ready for Pickup!`, 'success')
                          }}
                          className="btn-status-action btn-ready"
                        >
                          🔔 Mark Ready
                        </button>
                      )}

                      {ord.status === 'Ready for Pickup' && (
                        <button
                          onClick={() => {
                            updateOrderStatus(ord.id, 'Completed')
                            showToast(`Order #${ord.pickupCode} completed!`, 'success')
                          }}
                          className="btn-status-action btn-complete"
                        >
                          ✓ Handed Over
                        </button>
                      )}

                      {ord.status === 'Completed' && (
                        <span className="order-done-text">✓ Completed</span>
                      )}

                      {ord.status === 'Cancelled' && (
                        <span className="order-cancelled-text">✕ Cancelled</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: MENU INVENTORY MANAGEMENT */}
      {activeTab === 'menu' && (
        <section className="admin-section">
          <div className="section-header">
            <div>
              <h2>Menu Items Inventory</h2>
              <p className="section-subtitle">
                Add dishes, toggle in-stock/sold-out status, or update pricing.
              </p>
            </div>
            <button onClick={() => setIsAddModalOpen(true)} className="btn">
              + Add New Dish
            </button>
          </div>

          <div className="admin-menu-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stallMenuItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="table-dish-cell">
                        <span className="dish-icon">{item.imageEmoji || '🍲'}</span>
                        <div>
                          <strong>{item.name}</strong>
                          <p className="table-dish-desc">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">{item.category}</span>
                    </td>
                    <td>
                      <strong>RM {Number(item.price).toFixed(2)}</strong>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          toggleItemAvailability(item.id)
                          showToast(
                            `"${item.name}" marked ${!item.available ? 'In Stock' : 'Sold Out'}`,
                            'info'
                          )
                        }}
                        className={`stock-toggle-pill ${item.available ? 'in-stock' : 'sold-out'}`}
                      >
                        {item.available ? '✓ In Stock' : '✕ Sold Out'}
                      </button>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <button
                          onClick={() => {
                            setItemToEdit({ ...item })
                            setIsEditModalOpen(true)
                          }}
                          className="btn-action-edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDish(item.id, item.name)}
                          className="btn-action-del"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 3: SALES & ANALYTICS */}
      {activeTab === 'analytics' && (
        <section className="admin-section">
          <div className="section-header">
            <div>
              <h2>Cafeteria Performance</h2>
              <p className="section-subtitle">Real-time metrics for {currentVendor.name}</p>
            </div>
          </div>

          <div className="metrics-cards-grid">
            <div className="metric-bento-card">
              <span className="metric-label">Total Revenue</span>
              <h3 className="metric-val">RM {totalRevenue.toFixed(2)}</h3>
              <span className="metric-trend green">↑ Active Orders Counted</span>
            </div>
            <div className="metric-bento-card">
              <span className="metric-label">Total Orders</span>
              <h3 className="metric-val">{stallOrders.length}</h3>
              <span className="metric-trend blue">All-time tickets</span>
            </div>
            <div className="metric-bento-card">
              <span className="metric-label">Active Kitchen Queue</span>
              <h3 className="metric-val">{pendingOrdersCount}</h3>
              <span className="metric-trend orange">Awaiting cooking/pickup</span>
            </div>
            <div className="metric-bento-card">
              <span className="metric-label">Customer Rating</span>
              <h3 className="metric-val">★ {currentVendor.rating}</h3>
              <span className="metric-trend green">{currentVendor.reviewCount || 150} Reviews</span>
            </div>
          </div>

          <div className="analytics-insights-box">
            <h4>💡 Operational Tips for Peak Hours</h4>
            <ul>
              <li>Lunch rush typically peaks between <strong>12:45 PM – 2:00 PM</strong>.</li>
              <li>Keep top-sellers (Nasi Lemak & Roti Canai) pre-portioned to maintain sub-10 minute wait times.</li>
              <li>Toggle out-of-stock items immediately so students do not place unfulfillable orders.</li>
            </ul>
          </div>
        </section>
      )}

      {/* TAB 4: STALL SETTINGS */}
      {activeTab === 'settings' && (
        <section className="admin-section">
          <div className="section-header">
            <div>
              <h2>Stall Configuration</h2>
              <p className="section-subtitle">Announcement message and data reset</p>
            </div>
          </div>

          {/* Announcement banner broadcast */}
          <div className="settings-bento-box">
            <h3>📢 Broadcast Kitchen Announcement</h3>
            <p className="box-desc">
              This message appears prominently on the homepage and stall menu for all students.
            </p>
            <form onSubmit={handleSaveAnnouncement} className="settings-form">
              <textarea
                className="apple-input apple-textarea"
                rows="3"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="e.g. Fresh batch of Sambal Sotong ready at 12:00 PM!"
              />
              <button type="submit" className="btn btn-primary">
                Broadcast Announcement
              </button>
            </form>
          </div>

          {/* Factory Reset */}
          <div className="settings-bento-box danger-zone">
            <h3>⚠️ Demo Data Management</h3>
            <p className="box-desc">
              Reset orders, vendors, and dishes back to original course seed data.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Reset all demo data back to defaults?')) {
                  resetAllData()
                  showToast('Data reset to original seed state', 'info')
                }
              }}
              className="btn btn-danger"
            >
              Reset All Demo Data
            </button>
          </div>
        </section>
      )}

      {/* ADD NEW DISH MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add New Dish to ${currentVendor.name}`}
      >
        <form onSubmit={handleCreateDish} className="admin-form">
          <div className="form-group">
            <label className="form-label">Dish Name</label>
            <input
              type="text"
              className="apple-input"
              placeholder="e.g. Nasi Ayam Penyet Sambal Ijo"
              value={newItemForm.name}
              onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Price (RM)</label>
              <input
                type="number"
                step="0.10"
                className="apple-input"
                placeholder="8.50"
                value={newItemForm.price}
                onChange={(e) => setNewItemForm({ ...newItemForm, price: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="apple-select"
                value={newItemForm.category}
                onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value })}
              >
                <option value="Rice">Rice</option>
                <option value="Noodles">Noodles</option>
                <option value="Western">Western</option>
                <option value="Beverages">Beverages</option>
                <option value="Snacks">Snacks</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Prep Time</label>
              <input
                type="text"
                className="apple-input"
                placeholder="e.g. 10 mins"
                value={newItemForm.prepTime}
                onChange={(e) => setNewItemForm({ ...newItemForm, prepTime: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Icon Emoji</label>
              <input
                type="text"
                className="apple-input"
                placeholder="🍲"
                value={newItemForm.imageEmoji}
                onChange={(e) => setNewItemForm({ ...newItemForm, imageEmoji: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="apple-input apple-textarea"
              rows="2"
              placeholder="Describe ingredients, cooking style, or flavor profile..."
              value={newItemForm.description}
              onChange={(e) => setNewItemForm({ ...newItemForm, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Dietary Tags (comma separated)</label>
            <input
              type="text"
              className="apple-input"
              placeholder="Halal, Spicy, Popular"
              value={newItemForm.dietary}
              onChange={(e) => setNewItemForm({ ...newItemForm, dietary: e.target.value })}
            />
          </div>

          <div className="modal-actions-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn">
              Add Dish to Menu
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT DISH MODAL */}
      {itemToEdit && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit: ${itemToEdit.name}`}
        >
          <form onSubmit={handleSaveEditDish} className="admin-form">
            <div className="form-group">
              <label className="form-label">Dish Name</label>
              <input
                type="text"
                className="apple-input"
                value={itemToEdit.name}
                onChange={(e) => setItemToEdit({ ...itemToEdit, name: e.target.value })}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Price (RM)</label>
                <input
                  type="number"
                  step="0.10"
                  className="apple-input"
                  value={itemToEdit.price}
                  onChange={(e) => setItemToEdit({ ...itemToEdit, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="apple-select"
                  value={itemToEdit.category}
                  onChange={(e) => setItemToEdit({ ...itemToEdit, category: e.target.value })}
                >
                  <option value="Rice">Rice</option>
                  <option value="Noodles">Noodles</option>
                  <option value="Western">Western</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="apple-input apple-textarea"
                rows="2"
                value={itemToEdit.description}
                onChange={(e) => setItemToEdit({ ...itemToEdit, description: e.target.value })}
              />
            </div>

            <div className="modal-actions-row">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default AdminPage
