import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useData } from '../context/DataContext'
import { useToast } from '../components/Toast'

function CartPage() {
  const {
    cartItems,
    currentVendorId,
    orderType,
    setOrderType,
    pickupTime,
    setPickupTime,
    specialInstructions,
    setSpecialInstructions,
    voucherCode,
    voucherDiscount,
    applyVoucher,
    removeVoucher,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    packagingFee,
    total,
  } = useCart()

  const { getVendor } = useData()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [inputCode, setInputCode] = useState('')
  const currentVendor = currentVendorId ? getVendor(currentVendorId) : null

  const handleApplyVoucher = (e) => {
    e.preventDefault()
    if (!inputCode.trim()) return
    const res = applyVoucher(inputCode)
    if (res.success) {
      showToast(res.message, 'success')
      setInputCode('')
    } else {
      showToast(res.message, 'warning')
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-page">
        <div className="empty-cart-card">
          <h2>Your tray is empty</h2>
          <p>Explore mahallah food stalls and add dishes to pre-order.</p>
          <Link to="/" className="btn btn-primary-lg">
            Explore Stalls &rarr;
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-header-row">
        <div>
          <span className="hero-eyebrow">Checkout Tray</span>
          <h1 className="page-title">Your Order Tray</h1>
        </div>
        <button onClick={clearCart} className="btn-text-danger" title="Remove all items">
          Clear Tray
        </button>
      </div>

      <div className="cart-layout-grid">
        {/* Left Column: Cart Items List */}
        <div className="cart-items-section">
          {currentVendor && (
            <div className="cart-vendor-banner">
              <span className="vendor-avatar-mini">{currentVendor.image || '🍽️'}</span>
              <div>
                <p className="cart-vendor-label">Ordering from</p>
                <h4 className="cart-vendor-name">{currentVendor.name}</h4>
                <span className="cart-vendor-loc">{currentVendor.location}</span>
              </div>
            </div>
          )}

          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-row">
                <div className="cart-item-thumb">{item.imageEmoji || '🍽️'}</div>
                <div className="cart-item-details">
                  <div className="cart-item-title-row">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-price">
                      RM {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <p className="cart-item-unit-price">RM {Number(item.price).toFixed(2)} each</p>

                  {item.notes && (
                    <div className="cart-item-note-pill">
                      <span>Note: {item.notes}</span>
                    </div>
                  )}

                  <div className="cart-item-actions">
                    <div className="stepper-control stepper-control-sm">
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        &minus;
                      </button>
                      <span className="stepper-count">{item.quantity}</span>
                      <button
                        type="button"
                        className="stepper-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        &#43;
                      </button>
                    </div>

                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => {
                        removeFromCart(item.id)
                        showToast(`Removed ${item.name}`, 'info')
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dining Option (Segmented Switch) */}
          <div className="cart-config-box">
            <h4 className="config-box-title">Dining Option</h4>
            <div className="apple-segmented-control">
              <button
                type="button"
                className={`segment-btn ${orderType === 'Takeaway' ? 'active' : ''}`}
                onClick={() => setOrderType('Takeaway')}
              >
                Takeaway (+RM 0.50)
              </button>
              <button
                type="button"
                className={`segment-btn ${orderType === 'Dine-In' ? 'active' : ''}`}
                onClick={() => setOrderType('Dine-In')}
              >
                Dine-In
              </button>
            </div>
          </div>

          {/* Pickup Time Selection */}
          <div className="cart-config-box">
            <h4 className="config-box-title">Estimated Pickup Time</h4>
            <div className="pickup-times-grid">
              {[
                '10-15 mins (Standard)',
                '12:30 PM (Zohor)',
                '1:15 PM (Lunch Rush)',
                '5:30 PM (After Class)',
                '8:00 PM (Supper)',
              ].map((time) => (
                <button
                  key={time}
                  type="button"
                  className={`pickup-time-pill ${pickupTime === time ? 'active' : ''}`}
                  onClick={() => setPickupTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Overall Order Notes */}
          <div className="cart-config-box">
            <h4 className="config-box-title">Kitchen Instructions</h4>
            <input
              type="text"
              className="apple-input"
              placeholder="e.g. Please separate packaging, extra cutlery..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>
        </div>

        {/* Right Column: Bill Summary & Checkout */}
        <div className="cart-summary-section">
          <div className="summary-card">
            <h3 className="summary-title">Summary</h3>

            {/* Voucher Code Form */}
            <form onSubmit={handleApplyVoucher} className="voucher-form">
              <div className="voucher-input-group">
                <input
                  type="text"
                  className="apple-input voucher-input"
                  placeholder="Code (e.g. IIUMEATS)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                />
                <button type="submit" className="btn btn-secondary">
                  Apply
                </button>
              </div>
              <p className="voucher-hint">Use code <strong>IIUMEATS</strong> for RM 2.00 off.</p>
            </form>

            {voucherCode && (
              <div className="applied-voucher-badge">
                <span>Code <strong>{voucherCode}</strong> applied (-RM {voucherDiscount.toFixed(2)})</span>
                <button type="button" onClick={removeVoucher} className="remove-voucher-btn">
                  &times;
                </button>
              </div>
            )}

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
                  <span>Student Discount</span>
                  <span>-RM {voucherDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-divider"></div>
              <div className="summary-row total-row">
                <span>Estimated Total</span>
                <span className="total-amount">RM {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary-full"
            >
              Continue to Checkout &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
