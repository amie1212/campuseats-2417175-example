import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('campuseats_cart')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Error parsing cart from storage', e)
      }
    }
    return []
  })

  const [currentVendorId, setCurrentVendorId] = useState(() => {
    return localStorage.getItem('campuseats_cart_vendor') || null
  })

  const [orderType, setOrderType] = useState('Takeaway')
  const [pickupTime, setPickupTime] = useState('10-15 mins (Fastest)')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [voucherCode, setVoucherCode] = useState('')
  const [voucherDiscount, setVoucherDiscount] = useState(0)

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('campuseats_cart', JSON.stringify(cartItems))
    if (cartItems.length === 0) {
      setCurrentVendorId(null)
      localStorage.removeItem('campuseats_cart_vendor')
    }
  }, [cartItems])

  const addToCart = (item, notes = '') => {
    // If cart has items from another vendor, reset and start fresh with new vendor
    if (currentVendorId && currentVendorId !== item.vendorId && cartItems.length > 0) {
      const confirmSwitch = window.confirm(
        'Your cart contains dishes from another stall. Clear cart and order from this stall instead?'
      )
      if (!confirmSwitch) return false
      setCartItems([{ ...item, quantity: 1, notes: notes || '' }])
      setCurrentVendorId(item.vendorId)
      localStorage.setItem('campuseats_cart_vendor', item.vendorId)
      return true
    }

    setCurrentVendorId(item.vendorId)
    localStorage.setItem('campuseats_cart_vendor', item.vendorId)

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.id === item.id)
      if (existingIndex > -1) {
        const updated = [...prevItems]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
          notes: notes || updated[existingIndex].notes,
        }
        return updated
      } else {
        return [...prevItems, { ...item, quantity: 1, notes: notes || '' }]
      }
    })
    return true
  }

  const updateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId)
      return
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    )
  }

  const updateItemNotes = (itemId, notes) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, notes } : item))
    )
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const clearCart = () => {
    setCartItems([])
    setCurrentVendorId(null)
    setVoucherCode('')
    setVoucherDiscount(0)
    setSpecialInstructions('')
    localStorage.removeItem('campuseats_cart')
    localStorage.removeItem('campuseats_cart_vendor')
  }

  const applyVoucher = (code) => {
    const cleanCode = (code || '').trim().toUpperCase()
    if (cleanCode === 'IIUMEATS') {
      setVoucherCode('IIUMEATS')
      setVoucherDiscount(2.0)
      return { success: true, message: 'RM 2.00 IIUM Student discount applied!' }
    } else if (cleanCode === 'FARUQDEAL') {
      setVoucherCode('FARUQDEAL')
      setVoucherDiscount(1.5)
      return { success: true, message: 'RM 1.50 Mahallah Faruq special voucher applied!' }
    } else if (cleanCode === 'FREESHIP') {
      setVoucherCode('FREESHIP')
      setVoucherDiscount(0.5)
      return { success: true, message: 'Packaging fee waived!' }
    } else {
      return { success: false, message: 'Invalid or expired voucher code. Try "IIUMEATS"' }
    }
  }

  const removeVoucher = () => {
    setVoucherCode('')
    setVoucherDiscount(0)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const packagingFee = orderType === 'Takeaway' && cartItems.length > 0 ? 0.5 : 0
  const finalDiscount = Math.min(voucherDiscount, subtotal + packagingFee)
  const total = Math.max(0, subtotal + packagingFee - finalDiscount)
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        currentVendorId,
        orderType,
        setOrderType,
        pickupTime,
        setPickupTime,
        specialInstructions,
        setSpecialInstructions,
        voucherCode,
        voucherDiscount: finalDiscount,
        applyVoucher,
        removeVoucher,
        addToCart,
        updateQuantity,
        updateItemNotes,
        removeFromCart,
        clearCart,
        subtotal,
        packagingFee,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
