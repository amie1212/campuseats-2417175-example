import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

function CheckoutPage() {
  const {
    cartItems,
    currentVendorId,
    orderType,
    pickupTime,
    specialInstructions,
    voucherCode,
    voucherDiscount,
    subtotal,
    packagingFee,
    total,
    clearCart,
  } = useCart()

  const { getVendor, placeOrder } = useData()
  const { currentUser } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState(currentUser.name || 'Abdullah Najmi')
  const [matricNo, setMatricNo] = useState(currentUser.matricNo || '2417175')
  const [phone, setPhone] = useState(currentUser.phone || '+60 11-2345 6789')
  const [mahallah, setMahallah] = useState(currentUser.mahallah || 'Mahallah Faruq, Block B')
  const [paymentMethod, setPaymentMethod] = useState('DuitNow QR')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentVendor = currentVendorId ? getVendor(currentVendorId) : null

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-page">
        <div className="empty-cart-card">
          <h2>No items to checkout</h2>
          <p>Please select items from a mahallah stall before checkout.</p>
          <Link to="/" className="btn">
            Browse Stalls
          </Link>
        </div>
      </div>
    )
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    if (!customerName.trim() || !phone.trim()) {
      showToast('Please enter your name and phone number', 'warning')
      return
    }

    setIsSubmitting(true)

    const orderPayload = {
      vendorId: currentVendorId || 'faruq',
      vendorName: currentVendor?.name || 'Kafe Mahallah Faruq',
      customerName,
      matricNo,
      phone,
      mahallah,
      orderType,
      pickupTime,
      specialInstructions,
      paymentMethod,
      voucherCode,
      subtotal,
      packagingFee,
      discount: voucherDiscount,
      total,
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes || '',
      })),
    }

    setTimeout(() => {
      const createdOrder = placeOrder(orderPayload)
      clearCart()
      setIsSubmitting(false)
      showToast(`Order #${createdOrder.pickupCode} placed successfully`, 'success')
      navigate('/orders')
    }, 600)
  }

  return (
    <div className="checkout-page">
      <div className="page-nav-back">
        <Link to="/cart" className="back-link">
          &larr; Back to Order Tray
        </Link>
      </div>

      <div className="checkout-header">
        <span className="hero-eyebrow">Express Checkout</span>
        <h1 className="page-title">Confirm & Pay</h1>
        <p className="page-subtitle">Verify pickup timing and student details</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="checkout-form-grid">
        {/* Left Column: Student Details & Payment */}
        <div className="checkout-main-col">
          {/* Student Info Card */}
          <div className="checkout-card">
            <h3 className="card-heading">1. Contact Information</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="apple-input"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Matric ID</label>
                <input
                  type="text"
                  className="apple-input"
                  value={matricNo}
                  onChange={(e) => setMatricNo(e.target.value)}
                  placeholder="e.g. 2417175"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="apple-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+601X-XXXXXXX"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hostel / Mahallah Room</label>
                <input
                  type="text"
                  className="apple-input"
                  value={mahallah}
                  onChange={(e) => setMahallah(e.target.value)}
                  placeholder="e.g. Mahallah Faruq, Block B-3-12"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="checkout-card">
            <h3 className="card-heading">2. Payment Method</h3>
            <div className="payment-options-list">
              {[
                {
                  id: 'DuitNow QR',
                  title: 'DuitNow QR Pay',
                  desc: 'Scan QR at pickup counter (Touch n Go / Maybank / CIMB)',
                },
                {
                  id: 'Campus Cash',
                  title: 'Cash upon Pickup',
                  desc: 'Pay cash directly at the cafeteria counter',
                },
                {
                  id: 'Apple Pay',
                  title: 'Apple Pay',
                  desc: 'One-touch wallet verification',
                },
                {
                  id: 'FPX Online Banking',
                  title: 'FPX Online Banking',
                  desc: 'Online bank transfer',
                },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`payment-radio-label ${paymentMethod === opt.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.id}
                    checked={paymentMethod === opt.id}
                    onChange={() => setPaymentMethod(opt.id)}
                  />
                  <div className="payment-text-wrap">
                    <span className="payment-title">{opt.title}</span>
                    <span className="payment-desc">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Review */}
        <div className="checkout-summary-col">
          <div className="summary-card">
            <h3 className="summary-title">Order Overview</h3>

            <div className="checkout-vendor-snippet">
              <span className="snippet-stall-name">{currentVendor?.name}</span>
              <div className="snippet-meta">
                <span>{pickupTime}</span>
                <span>&bull;</span>
                <span>{orderType}</span>
              </div>
            </div>

            <div className="checkout-item-rows">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-item-row">
                  <div className="item-qty-name">
                    <span className="qty-tag">{item.quantity}x</span>
                    <span className="name-tag">{item.name}</span>
                  </div>
                  <span className="price-tag">
                    RM {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {specialInstructions && (
              <div className="checkout-notes-box">
                <span className="notes-label">Instruction:</span>
                <p className="notes-content">"{specialInstructions}"</p>
              </div>
            )}

            <div className="summary-divider"></div>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>RM {subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Packaging ({orderType})</span>
                <span>RM {packagingFee.toFixed(2)}</span>
              </div>
              {voucherDiscount > 0 && (
                <div className="summary-row discount-row">
                  <span>Voucher ({voucherCode})</span>
                  <span>-RM {voucherDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-divider"></div>
              <div className="summary-row total-row">
                <span>Total Due</span>
                <span className="total-amount">RM {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary-full submit-order-btn"
            >
              {isSubmitting ? 'Placing Order...' : `Place Order &bull; RM ${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CheckoutPage
