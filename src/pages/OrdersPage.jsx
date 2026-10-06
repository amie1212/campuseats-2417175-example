import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import Modal from '../components/Modal'

function OrdersPage() {
  const { orders, updateOrderStatus, cancelOrder } = useData()
  const { currentUser } = useAuth()
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState('active')
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null)

  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending':
        return 1
      case 'Preparing':
        return 2
      case 'Ready for Pickup':
        return 3
      case 'Completed':
        return 4
      case 'Cancelled':
        return -1
      default:
        return 1
    }
  }

  const userOrders = orders.filter(
    (o) =>
      o.matricNo === currentUser.matricNo ||
      o.customerName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0]) ||
      currentUser.role === 'admin'
  )

  const activeOrders = userOrders.filter(
    (o) => o.status === 'Pending' || o.status === 'Preparing' || o.status === 'Ready for Pickup'
  )

  const pastOrders = userOrders.filter(
    (o) => o.status === 'Completed' || o.status === 'Cancelled'
  )

  const displayedOrders =
    activeTab === 'active' ? activeOrders : activeTab === 'completed' ? pastOrders : userOrders

  const handleMarkReceived = (orderId, pickupCode) => {
    updateOrderStatus(orderId, 'Completed')
    showToast(`Order #${pickupCode} marked as picked up`, 'success')
  }

  const handleCancel = (orderId, pickupCode) => {
    const confirm = window.confirm(`Cancel order #${pickupCode}?`)
    if (confirm) {
      cancelOrder(orderId)
      showToast(`Order #${pickupCode} cancelled`, 'info')
    }
  }

  return (
    <div className="orders-page">
      <div className="orders-header-row">
        <div>
          <span className="hero-eyebrow">Real-Time Kitchen Feed</span>
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">Track preparation and present ticket at the counter</p>
        </div>

        <div className="orders-tab-switcher">
          <button
            className={`tab-switch-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active ({activeOrders.length})
          </button>
          <button
            className={`tab-switch-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Past ({pastOrders.length})
          </button>
          <button
            className={`tab-switch-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({userOrders.length})
          </button>
        </div>
      </div>

      {displayedOrders.length === 0 ? (
        <div className="empty-orders-card">
          <h3>No {activeTab} orders</h3>
          <p>
            {activeTab === 'active'
              ? 'You do not have any orders currently in preparation.'
              : 'You have not completed any past orders.'}
          </p>
          <Link to="/" className="btn">
            Browse Stalls &rarr;
          </Link>
        </div>
      ) : (
        <div className="orders-cards-list">
          {displayedOrders.map((order) => {
            const step = getStatusStep(order.status)
            const isCancelled = order.status === 'Cancelled'
            const isReady = order.status === 'Ready for Pickup'

            return (
              <article key={order.id} className={`order-card-bento ${isReady ? 'ready-pulse' : ''}`}>
                <div className="order-card-header">
                  <div className="order-stall-info">
                    <span className="order-stall-name">{order.vendorName}</span>
                    <span className="order-timestamp">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' &bull; '}
                      {new Date(order.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="order-code-badge">
                    <span className="code-label">Ticket</span>
                    <span className="code-value">{order.pickupCode}</span>
                  </div>
                </div>

                {/* Minimalist Progress Bar */}
                {!isCancelled ? (
                  <div className="order-progress-tracker">
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width:
                            step === 1
                              ? '15%'
                              : step === 2
                              ? '50%'
                              : step === 3
                              ? '85%'
                              : '100%',
                        }}
                      ></div>
                    </div>
                    <div className="progress-steps-row">
                      <div className={`step-node ${step >= 1 ? 'completed' : ''}`}>
                        <div className="node-dot">1</div>
                        <span className="node-label">Received</span>
                      </div>
                      <div className={`step-node ${step >= 2 ? 'completed' : ''}`}>
                        <div className="node-dot">2</div>
                        <span className="node-label">Cooking</span>
                      </div>
                      <div className={`step-node ${step >= 3 ? 'completed active-ready' : ''}`}>
                        <div className="node-dot">3</div>
                        <span className="node-label">Ready</span>
                      </div>
                      <div className={`step-node ${step >= 4 ? 'completed' : ''}`}>
                        <div className="node-dot">4</div>
                        <span className="node-label">Picked Up</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="order-cancelled-banner">
                    <span>Order was cancelled</span>
                  </div>
                )}

                {/* Minimalist Status Banner */}
                <div className="order-status-banner">
                  <span className="status-indicator-dot"></span>
                  <span className="status-banner-text">
                    <strong>Status: {order.status}</strong> &mdash;{' '}
                    {order.status === 'Ready for Pickup'
                      ? `Ready at ${order.vendorName} counter. Show ticket #${order.pickupCode}.`
                      : order.status === 'Preparing'
                      ? 'Kitchen staff is actively preparing your order.'
                      : order.status === 'Pending'
                      ? 'Order received in cafeteria queue.'
                      : 'Order completed.'}
                  </span>
                </div>

                {/* Items Summary */}
                <div className="order-items-preview">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-line">
                      <span className="item-name-qty">
                        <strong>{item.quantity}x</strong> {item.name}
                        {item.notes && <em className="item-note-inline">({item.notes})</em>}
                      </span>
                      <span className="item-price">
                        RM {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer with meta and actions */}
                <div className="order-card-footer">
                  <div className="order-meta-info">
                    <span className="meta-time">Pickup: {order.pickupTime}</span>
                    <span className="meta-type">({order.orderType})</span>
                    <span className="meta-total">Total: RM {order.total.toFixed(2)}</span>
                  </div>

                  <div className="order-actions-row">
                    <button
                      type="button"
                      className="btn-secondary-pill"
                      onClick={() => setSelectedReceiptOrder(order)}
                    >
                      Receipt
                    </button>

                    {order.status === 'Ready for Pickup' && (
                      <button
                        type="button"
                        className="btn btn-success-pill"
                        onClick={() => handleMarkReceived(order.id, order.pickupCode)}
                      >
                        Picked Up
                      </button>
                    )}

                    {order.status === 'Pending' && (
                      <button
                        type="button"
                        className="btn-cancel-small"
                        onClick={() => handleCancel(order.id, order.pickupCode)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Digital Receipt Modal */}
      {selectedReceiptOrder && (
        <Modal
          isOpen={Boolean(selectedReceiptOrder)}
          onClose={() => setSelectedReceiptOrder(null)}
          title={`Receipt &bull; ${selectedReceiptOrder.pickupCode}`}
        >
          <div className="receipt-modal-body">
            <div className="receipt-store-header">
              <h2>CampusEats</h2>
              <p>{selectedReceiptOrder.vendorName}</p>
              <span className="receipt-date">
                {new Date(selectedReceiptOrder.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="receipt-ticket-box">
              <span className="ticket-label">PICKUP TICKET</span>
              <span className="ticket-number">{selectedReceiptOrder.pickupCode}</span>
              <span className="ticket-name">
                {selectedReceiptOrder.customerName} &bull; {selectedReceiptOrder.matricNo}
              </span>
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-items-table">
              {selectedReceiptOrder.items.map((it, i) => (
                <div key={i} className="receipt-item-row">
                  <span>
                    {it.quantity}x {it.name}
                  </span>
                  <span>RM {(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-totals-box">
              <div className="receipt-row">
                <span>Subtotal:</span>
                <span>RM {selectedReceiptOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="receipt-row">
                <span>Packaging:</span>
                <span>RM {selectedReceiptOrder.packagingFee.toFixed(2)}</span>
              </div>
              {selectedReceiptOrder.discount > 0 && (
                <div className="receipt-row discount">
                  <span>Discount:</span>
                  <span>-RM {selectedReceiptOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="receipt-row total">
                <span>Total:</span>
                <span>RM {selectedReceiptOrder.total.toFixed(2)}</span>
              </div>
              <div className="receipt-row">
                <span>Payment:</span>
                <span>{selectedReceiptOrder.paymentMethod}</span>
              </div>
            </div>

            <div className="receipt-barcode-simulation">
              <div className="barcode-lines">||||| | |||| ||| ||||| || |||||| |||</div>
              <span className="barcode-text">ID: {selectedReceiptOrder.id}</span>
            </div>

            <div className="receipt-footer-btn">
              <button
                type="button"
                className="btn btn-primary-full"
                onClick={() => setSelectedReceiptOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default OrdersPage
