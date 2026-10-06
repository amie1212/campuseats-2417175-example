import { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_VENDORS, INITIAL_MENU_ITEMS, INITIAL_ORDERS } from '../data/mockData'
import { db, isFirebaseConfigured } from '../firebase'
import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  // 1. Vendors state
  const [vendors, setVendors] = useState(() => {
    const saved = localStorage.getItem('campuseats_vendors')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse cached vendors', e)
      }
    }
    return INITIAL_VENDORS
  })

  // 2. Menu Items state
  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('campuseats_menu_items')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse cached menu items', e)
      }
    }
    return INITIAL_MENU_ITEMS
  })

  // 3. Orders state
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('campuseats_orders')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse cached orders', e)
      }
    }
    return INITIAL_ORDERS
  })

  // Auto-persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('campuseats_vendors', JSON.stringify(vendors))
  }, [vendors])

  useEffect(() => {
    localStorage.setItem('campuseats_menu_items', JSON.stringify(menuItems))
  }, [menuItems])

  useEffect(() => {
    localStorage.setItem('campuseats_orders', JSON.stringify(orders))
  }, [orders])

  // Optional Firestore sync if credentials are provided
  useEffect(() => {
    if (isFirebaseConfigured && db) {
      const syncWithFirestore = async () => {
        try {
          const vendorsSnap = await getDocs(collection(db, 'vendors'))
          if (!vendorsSnap.empty) {
            const fbVendors = vendorsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
            setVendors(fbVendors)
          }

          const menuSnap = await getDocs(collection(db, 'menuItems'))
          if (!menuSnap.empty) {
            const fbItems = menuSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
            setMenuItems(fbItems)
          }
        } catch (err) {
          console.warn('Firestore fetch notice (using robust local store):', err.message)
        }
      }
      syncWithFirestore()
    }
  }, [])

  // Helper getters
  const getVendor = (id) => vendors.find((v) => v.id === id) || vendors[0]
  const getMenuItemsByVendor = (vendorId) => menuItems.filter((i) => i.vendorId === vendorId)

  // ================= ADMIN ACTIONS =================
  // Toggle Open/Closed status of vendor
  const toggleVendorStatus = (vendorId) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, isOpen: !v.isOpen } : v))
    )
  }

  // Update announcement
  const updateVendorAnnouncement = (vendorId, announcement) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, announcement } : v))
    )
  }

  // Toggle item in stock / sold out
  const toggleItemAvailability = (itemId) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, available: !item.available } : item))
    )
  }

  // Add new menu item
  const addMenuItem = (itemData) => {
    const newItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      rating: 5.0,
      price: parseFloat(itemData.price) || 0,
      available: itemData.available !== undefined ? itemData.available : true,
      imageEmoji: itemData.imageEmoji || '🍽️',
      dietary: itemData.dietary || ['Halal'],
    }

    setMenuItems((prev) => [newItem, ...prev])

    // Sync to Firestore if available
    if (isFirebaseConfigured && db) {
      try {
        setDoc(doc(db, 'menuItems', newItem.id), newItem).catch((e) => console.warn(e))
      } catch (e) {
        console.warn(e)
      }
    }

    return newItem
  }

  // Edit existing menu item
  const updateMenuItem = (itemId, updatedFields) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updated = {
            ...item,
            ...updatedFields,
            price: updatedFields.price !== undefined ? parseFloat(updatedFields.price) : item.price,
          }
          if (isFirebaseConfigured && db) {
            updateDoc(doc(db, 'menuItems', itemId), updated).catch((e) => console.warn(e))
          }
          return updated
        }
        return item
      })
    )
  }

  // Delete menu item
  const deleteMenuItem = (itemId) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  // ================= ORDER ACTIONS =================
  // Place new order
  const placeOrder = (orderData) => {
    const now = new Date()
    const pickupNumber = Math.floor(1000 + Math.random() * 9000)
    const codePrefix = orderData.vendorId === 'faruq' ? 'FE' : orderData.vendorId === 'ali' ? 'AL' : 'HL'

    const newOrder = {
      ...orderData,
      id: `ORD-${pickupNumber}`,
      pickupCode: `${codePrefix}-${pickupNumber.toString().slice(-4)}`,
      status: 'Pending',
      createdAt: now.toISOString(),
    }

    setOrders((prev) => [newOrder, ...prev])

    // Sync to Firestore if available
    if (isFirebaseConfigured && db) {
      try {
        setDoc(doc(db, 'orders', newOrder.id), newOrder).catch((e) => console.warn(e))
      } catch (e) {
        console.warn(e)
      }
    }

    return newOrder
  }

  // Update order status (Admin & workflow)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    )
    if (isFirebaseConfigured && db) {
      try {
        updateDoc(doc(db, 'orders', orderId), { status: newStatus }).catch((e) => console.warn(e))
      } catch (e) {
        console.warn(e)
      }
    }
  }

  // Cancel order
  const cancelOrder = (orderId) => {
    updateOrderStatus(orderId, 'Cancelled')
  }

  // Factory reset to seed data
  const resetAllData = () => {
    localStorage.removeItem('campuseats_vendors')
    localStorage.removeItem('campuseats_menu_items')
    localStorage.removeItem('campuseats_orders')
    setVendors(INITIAL_VENDORS)
    setMenuItems(INITIAL_MENU_ITEMS)
    setOrders(INITIAL_ORDERS)
  }

  return (
    <DataContext.Provider
      value={{
        vendors,
        menuItems,
        orders,
        getVendor,
        getMenuItemsByVendor,
        toggleVendorStatus,
        updateVendorAnnouncement,
        toggleItemAvailability,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        resetAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
