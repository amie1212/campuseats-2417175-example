import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useToast } from './Toast'
import Modal from './Modal'

function MenuItemCard({ item, name, description, price, available, vendorId }) {
  const { cartItems, addToCart, updateQuantity } = useCart()
  const { showToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notes, setNotes] = useState('')

  const currentItem = item || {
    id: `item-${(name || 'custom').toLowerCase().replace(/\s+/g, '-')}`,
    name: name ?? 'Nasi Lemak Ayam Berempah',
    description: description ?? 'Fragrant coconut rice, crispy spiced fried chicken, sambal, boiled egg & peanuts',
    price: price ?? 8.0,
    available: available !== undefined ? available : true,
    vendorId: vendorId || 'faruq',
    category: 'Rice',
    prepTime: '10 mins',
    dietary: ['Halal'],
  }

  const cartEntry = cartItems.find((i) => i.id === currentItem.id)
  const quantityInCart = cartEntry ? cartEntry.quantity : 0

  const handleQuickAdd = () => {
    if (!currentItem.available) return
    const success = addToCart(currentItem)
    if (success) {
      showToast(`Added ${currentItem.name} to tray`, 'success')
    }
  }

  const handleCustomizedAdd = (e) => {
    e.preventDefault()
    const success = addToCart(currentItem, notes)
    if (success) {
      showToast(`Added ${currentItem.name} with custom instructions`, 'success')
      setIsModalOpen(false)
      setNotes('')
    }
  }

  return (
    <>
      <article className={`menu-card ${!currentItem.available ? 'item-sold-out' : ''}`}>
        <div className="card-header">
          <div className="item-thumb-wrapper">
            <div className="thumb item-emoji-thumb">{currentItem.imageEmoji || '🍽️'}</div>
            {currentItem.isPopular && <span className="popular-tag">Popular</span>}
          </div>
          <span className={`stock-pill ${currentItem.available ? 'in-stock' : 'sold-out'}`}>
            {currentItem.available ? 'Available' : 'Sold out'}
          </span>
        </div>

        <div className="card-content">
          <h3 className="card-title">{currentItem.name}</h3>
          <p className="description">{currentItem.description}</p>

          <div className="dietary-tags-row">
            {currentItem.prepTime && (
              <span className="dietary-chip">{currentItem.prepTime}</span>
            )}
            {currentItem.dietary &&
              currentItem.dietary.map((tag, idx) => (
                <span key={idx} className="dietary-chip">
                  {tag}
                </span>
              ))}
          </div>
        </div>

        <div className="card-action">
          <div className="price-wrapper">
            <span className="price-label">Price</span>
            <span className="price">RM {Number(currentItem.price).toFixed(2)}</span>
          </div>

          <div className="action-buttons-group">
            {currentItem.available && (
              <button
                type="button"
                className="btn-note-small"
                onClick={() => setIsModalOpen(true)}
              >
                Customize
              </button>
            )}

            {quantityInCart > 0 && currentItem.available ? (
              <div className="stepper-control">
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => updateQuantity(currentItem.id, quantityInCart - 1)}
                  aria-label="Decrease quantity"
                >
                  &minus;
                </button>
                <span className="stepper-count">{quantityInCart}</span>
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => updateQuantity(currentItem.id, quantityInCart + 1)}
                  aria-label="Increase quantity"
                >
                  &#43;
                </button>
              </div>
            ) : (
              <button
                className="btn"
                disabled={!currentItem.available}
                onClick={handleQuickAdd}
              >
                {currentItem.available ? 'Add' : 'Sold out'}
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Special Instruction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Customize: ${currentItem.name}`}
      >
        <form onSubmit={handleCustomizedAdd} className="custom-note-form">
          <p className="note-modal-subtitle">
            Specify kitchen instructions (e.g. less sweet, separate sambal):
          </p>
          <div className="form-group">
            <textarea
              className="apple-input apple-textarea"
              rows="3"
              placeholder="e.g. Kurang manis, extra sambal on the side..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              autoFocus
            />
          </div>
          <div className="quick-suggestions-row">
            <button
              type="button"
              className="suggestion-chip"
              onClick={() => setNotes((prev) => (prev ? `${prev}, Kurang manis` : 'Kurang manis'))}
            >
              Kurang manis
            </button>
            <button
              type="button"
              className="suggestion-chip"
              onClick={() => setNotes((prev) => (prev ? `${prev}, Extra sambal` : 'Extra sambal'))}
            >
              Extra sambal
            </button>
            <button
              type="button"
              className="suggestion-chip"
              onClick={() => setNotes((prev) => (prev ? `${prev}, Kuah banjir` : 'Kuah banjir'))}
            >
              Kuah banjir
            </button>
          </div>
          <div className="modal-actions-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn">
              Add to Tray &bull; RM {Number(currentItem.price).toFixed(2)}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default MenuItemCard
