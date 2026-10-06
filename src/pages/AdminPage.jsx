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

  const [selectedVendorId, setSelectedVendorId] = useState('faruq')
  const [activeTab, setActiveTab] = useState('orders')

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(null)

  const [newItemForm, setNewItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Rice',
    prepTime: '10 mins',
    dietary: 'Halal, Popular',
  })

  const currentVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0]
  const [announcementText, setAnnouncementText] = useState(currentVendor?.announcement || '')

  const stallMenuItems = menuItems.filter((item) => item.vendorId === selectedVendorId)
  const stallOrders = orders.filter((order) => order.vendorId === selectedVendorId)

  const totalRevenue = stallOrders
    .filter((o) => o.status === 'Completed' || o.status === 'Ready for Pickup')
    .reduce((sum, o) => sum + o.total, 0)

  const pendingOrdersCount = stallOrders.filter(
    (o) => o.status === 'Pending' || o.status === 'Preparing'
  ).length

  if (!isAdmin) {
    return (
      <div className="admin-access-gate">
        <div className="gate-card">
          <h2>Cafeteria Portal</h2>
          <p>
            You are currently signed in as a student (<strong>{currentUser.name}</strong>). To manage
            orders and inventory, switch to Staff / Admin view.
          </p>
          <div className="gate-actions">
            <button
              onClick={() => {
                switchRole('admin')
                showToast('Switched to Staff Mode', 'success')
              }}
              className="btn btn-primary-lg"
            >
              Enter Admin Portal &rarr;
            </button>
          </div>
        </div>
      </div>
    )
  }

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

    showToast(`Added "${newItemForm.name}"`, 'success')
    setIsAddModalOpen(false)
    setNewItemForm({
      name: '',
      description: '',
      price: '',
      category: 'Rice',
      prepTime: '10 mins',
      dietary: 'Halal, Popular',
    })
  }

  const handleSaveEditDish = (e) => {
    e.preventDefault()
    if (!itemToEdit) return

    updateMenuItem(itemToEdit.id, {
      name: itemToEdit.name,
      description: itemToEdit.description,
      price: itemToEdit.price,
      category: itemToEdit.category,
      prepTime: itemToEdit.prepTime,
    })

    showToast(`Updated "${itemToEdit.name}"`, 'success')
    setIsEditModalOpen(false)
    setItemToEdit(null)
  }

  const handleDeleteDish = (id, name) => {
    const confirm = window.confirm(`Delete "${name}" from menu?`)
    if (confirm) {
      deleteMenuItem(id)
      showToast(`Deleted ${name}`, 'info')
    }
  }

  const handleSaveAnnouncement = (e) => {
    e.preventDefault()
    updateVendorAnnouncement(selectedVendorId, announcementText)
    showToast('Announcement updated', 'success')
  }

  return (
    <div className="admin-page">
      {/* Top Banner / Stall Switcher */}
      <div className="admin-header-bar">
        <div>
          <div className="admin-eyebrow-row">
            <span className="admin-role-badge">Kitchen Portal</span>
            <span className="admin-user-tag">{currentUser.name}</span>
          </div>
          <h1 className="admin-title">Stall Operations</h1>
        </div>

        <div className="vendor-switch-wrapper">
          <label className="vendor-switch-label">Stall:</label>
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
          <div className="thumb">{currentVendor.name.charAt(0)}</div>
          <div>
            <h3 className="stall-card-title">{currentVendor.name}</h3>
            <p className="stall-card-meta">{currentVendor.location}</p>
          </div>
        </div>

        <div className="status-card-right">
          <button
            onClick={() => {
              toggleVendorStatus(selectedVendorId)
              showToast(
                `${currentVendor.name} is now ${!currentVendor.isOpen ? 'Open' : 'Closed'}`,
                'info'
              )
            }}
            className={`btn-toggle-status ${currentVendor.isOpen ? 'status-open-active' : 'status-closed-active'}`}
          >
            <span className="status-indicator"></span>
            {currentVendor.isOpen ? 'Stall Open' : 'Stall Closed'}
          </button>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="admin-tabs-nav">
        <button
          className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Queue ({stallOrders.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          Inventory ({stallMenuItems.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Overview
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Configuration
        </button>
      </div>

      {/* TAB 1: KITCHEN ORDERS QUEUE */}
      {activeTab === 'orders' && (
        <section className="admin-section">
          <div className="section-header">
            <div>
              <h2>Kitchen Display System</h2>
              <p className="section-subtitle">
                Incoming student orders for {currentVendor.name}.
              </p>
            </div>
            <span className="section-badge">{pendingOrdersCount} In Queue</span>
          </div>

          {stallOrders.length === 0 ? (
            <div className="empty-state">
              <p>No orders currently in queue for this stall.</p>
            </div>
          ) : (
            <div className="admin-orders-grid">
              {stallOrders.map((ord) => (
                <div key={ord.id} className="admin-order-ticket">
                  <div className="ticket-top">
                    <div className="ticket-code-tag">#{ord.pickupCode}</div>
                    <span className="status-pill-small">
                      {ord.status}
                    </span>
                  </div>

                  <div className="ticket-customer-box">
                    <h4 className="customer-name">{ord.customerName}</h4>
                    <span className="customer-sub">
                      Matric: {ord.matricNo} &bull; {ord.phone}
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
                        {it.notes && <span className="dish-note">&bull; {it.notes}</span>}
                      </div>
                    ))}
                  </div>

                  <div className="ticket-footer">
                    <span className="ticket-amount">RM {ord.total.toFixed(2)}</span>

                    <div className="ticket-actions">
                      {ord.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => {
                              updateOrderStatus(ord.id, 'Preparing')
                              showToast(`Order #${ord.pickupCode} is Cooking`, 'info')
                            }}
                            className="btn btn-action-dark"
                          >
                            Start Cooking
                          </button>
                          <button
                            onClick={() => {
                              updateOrderStatus(ord.id, 'Cancelled')
                              showToast(`Order #${ord.pickupCode} rejected`, 'warning')
                            }}
                            className="btn btn-action-outline"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {ord.status === 'Preparing' && (
                        <button
                          onClick={() => {
                            updateOrderStatus(ord.id, 'Ready for Pickup')
                            showToast(`Order #${ord.pickupCode} Ready`, 'success')
                          }}
                          className="btn btn-action-dark"
                        >
                          Mark Ready
                        </button>
                      )}

                      {ord.status === 'Ready for Pickup' && (
                        <button
                          onClick={() => {
                            updateOrderStatus(ord.id, 'Completed')
                            showToast(`Order #${ord.pickupCode} Handed Over`, 'success')
                          }}
                          className="btn btn-action-dark"
                        >
                          Hand Over
                        </button>
                      )}

                      {ord.status === 'Completed' && (
                        <span className="order-done-text">Completed</span>
                      )}

                      {ord.status === 'Cancelled' && (
                        <span className="order-cancelled-text">Cancelled</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: MENU INVENTORY */}
      {activeTab === 'menu' && (
        <section className="admin-section">
          <div className="section-header">
            <div>
              <h2>Menu Inventory</h2>
              <p className="section-subtitle">
                Manage dishes, availability, and pricing.
              </p>
            </div>
            <button onClick={() => setIsAddModalOpen(true)} className="btn">
              Add Dish
            </button>
          </div>

          <div className="admin-menu-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stallMenuItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="table-dish-cell">
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
                        {item.available ? 'In Stock' : 'Sold Out'}
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

      {/* TAB 3: ANALYTICS */}
      {activeTab === 'analytics' && (
        <section className="admin-section">
          <div className="section-header">
            <div>
              <h2>Cafeteria Metrics</h2>
              <p className="section-subtitle">Performance for {currentVendor.name}</p>
            </div>
          </div>

          <div className="metrics-cards-grid">
            <div className="metric-bento-card">
              <span className="metric-label">Total Revenue</span>
              <h3 className="metric-val">RM {totalRevenue.toFixed(2)}</h3>
              <span className="metric-trend">Processed Orders</span>
            </div>
            <div className="metric-bento-card">
              <span className="metric-label">Total Tickets</span>
              <h3 className="metric-val">{stallOrders.length}</h3>
              <span className="metric-trend">Cumulative</span>
            </div>
            <div className="metric-bento-card">
              <span className="metric-label">Active in Queue</span>
              <h3 className="metric-val">{pendingOrdersCount}</h3>
              <span className="metric-trend">Awaiting pickup</span>
            </div>
            <div className="metric-bento-card">
              <span className="metric-label">Rating</span>
              <h3 className="metric-val">★ {currentVendor.rating}</h3>
              <span className="metric-trend">{currentVendor.reviewCount || 150} Reviews</span>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: STALL SETTINGS */}
      {activeTab === 'settings' && (
        <section className="admin-section">
          <div className="section-header">
            <div>
              <h2>Configuration</h2>
              <p className="section-subtitle">Announcement message and reset</p>
            </div>
          </div>

          <div className="settings-bento-box">
            <h3>Broadcast Notice</h3>
            <p className="box-desc">
              This message appears on the student menu view.
            </p>
            <form onSubmit={handleSaveAnnouncement} className="settings-form">
              <textarea
                className="apple-input apple-textarea"
                rows="3"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="e.g. Fresh batch of Sambal ready at 12:00 PM."
              />
              <button type="submit" className="btn btn-primary">
                Save Announcement
              </button>
            </form>
          </div>

          <div className="settings-bento-box">
            <h3>Demo Data Reset</h3>
            <p className="box-desc">
              Reset orders, stalls, and dishes back to initial seed data.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Reset all demo data back to defaults?')) {
                  resetAllData()
                  showToast('Data reset to default', 'info')
                }
              }}
              className="btn btn-secondary"
            >
              Reset Data
            </button>
          </div>
        </section>
      )}

      {/* ADD NEW DISH MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add Dish to ${currentVendor.name}`}
      >
        <form onSubmit={handleCreateDish} className="admin-form">
          <div className="form-group">
            <label className="form-label">Dish Name</label>
            <input
              type="text"
              className="apple-input"
              placeholder="e.g. Nasi Ayam Sambal"
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
            <label className="form-label">Description</label>
            <textarea
              className="apple-input apple-textarea"
              rows="2"
              placeholder="Ingredients and description..."
              value={newItemForm.description}
              onChange={(e) => setNewItemForm({ ...newItemForm, description: e.target.value })}
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
              Add Dish
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
