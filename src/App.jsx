import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './components/Toast'

import Header from './components/Header'
import MobileTabBar from './components/MobileTabBar'
import Footer from './components/Footer'

import HomePage from './pages/HomePage'
import VendorDetailPage from './pages/VendorDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import AdminPage from './pages/AdminPage'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <ToastProvider>
              <div className="app-shell">
                <Header />
                <main className="container app-main-content">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/vendor/:id" element={<VendorDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
                <MobileTabBar />
              </div>
            </ToastProvider>
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </HashRouter>
  )
}

export default App
