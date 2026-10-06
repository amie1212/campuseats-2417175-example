import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { useToast } from '../components/Toast'
import { isFirebaseConfigured } from '../firebase'

function ProfilePage() {
  const { currentUser, isAdmin, switchRole, loginWithGoogle, logout, updateProfile } = useAuth()
  const { orders } = useData()
  const { showToast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    matricNo: currentUser.matricNo || '',
    phone: currentUser.phone || '',
    mahallah: currentUser.mahallah || '',
  })

  const userOrdersCount = orders.filter(
    (o) => o.matricNo === currentUser.matricNo || o.customerName === currentUser.name
  ).length

  const handleSaveProfile = (e) => {
    e.preventDefault()
    updateProfile(formData)
    setIsEditing(false)
    showToast('Profile updated successfully!', 'success')
  }

  const handleGoogleSignIn = async () => {
    const res = await loginWithGoogle()
    if (res.success) {
      showToast(`Welcome back, ${res.user.name}!`, 'success')
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <span className="hero-eyebrow">Student Account & Preferences</span>
        <h1 className="page-title">Profile & Settings</h1>
      </div>

      <div className="profile-layout-grid">
        {/* Left Card: User ID & Avatar */}
        <div className="profile-avatar-card">
          <div className="profile-avatar-large">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt={currentUser.name} className="avatar-img" />
            ) : (
              <span className="avatar-char">{currentUser.name.charAt(0)}</span>
            )}
          </div>

          <h2 className="profile-name">{currentUser.name}</h2>
          <span className="profile-role-pill">
            {isAdmin ? '👨‍🍳 Cafeteria Manager' : '🎓 IIUM Student'}
          </span>

          <p className="profile-matric">Matric: {currentUser.matricNo}</p>
          <p className="profile-email">{currentUser.email}</p>

          <div className="profile-divider"></div>

          {/* Quick Role Switcher Button */}
          <div className="role-switch-container">
            <span className="switch-label">Current View Mode:</span>
            <button
              onClick={() => {
                const nextRole = isAdmin ? 'student' : 'admin'
                switchRole(nextRole)
                showToast(`Switched view to ${nextRole.toUpperCase()}`, 'info')
              }}
              className="btn btn-secondary-full"
            >
              {isAdmin ? 'Switch to Student View 🎓' : 'Switch to Cafe Admin View 👨‍🍳'}
            </button>
          </div>

          {/* Google Sign-in */}
          <div className="auth-action-box">
            <button onClick={handleGoogleSignIn} className="google-auth-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" className="google-g-icon">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isFirebaseConfigured ? 'Sign in with Google (Firebase)' : 'Sign In with Google (Demo)'}</span>
            </button>

            <button onClick={logout} className="logout-btn">
              Reset Session
            </button>
          </div>
        </div>

        {/* Right Card: Account Details & Editing */}
        <div className="profile-details-col">
          {/* Quick Metrics */}
          <div className="profile-stats-row">
            <div className="stat-card">
              <span className="stat-num">{userOrdersCount}</span>
              <span className="stat-desc">Total Orders Placed</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">Kafe Faruq</span>
              <span className="stat-desc">Favorite Mahallah Stall</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">RM 2.00</span>
              <span className="stat-desc">Voucher Savings</span>
            </div>
          </div>

          {/* Details Form Card */}
          <div className="profile-info-card">
            <div className="card-top-header">
              <h3>Personal & Delivery Details</h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="btn-edit-small">
                  ✏️ Edit Details
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="profile-edit-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="apple-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Matric Number</label>
                    <input
                      type="text"
                      className="apple-input"
                      value={formData.matricNo}
                      onChange={(e) => setFormData({ ...formData, matricNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">WhatsApp Contact</label>
                    <input
                      type="text"
                      className="apple-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Hostel / Mahallah Room</label>
                  <input
                    type="text"
                    className="apple-input"
                    value={formData.mahallah}
                    onChange={(e) => setFormData({ ...formData, mahallah: e.target.value })}
                  />
                </div>

                <div className="profile-form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn">
                    Save Profile
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-read-list">
                <div className="profile-data-row">
                  <span className="label">Full Name:</span>
                  <span className="val">{currentUser.name}</span>
                </div>
                <div className="profile-data-row">
                  <span className="label">Matric ID:</span>
                  <span className="val">{currentUser.matricNo}</span>
                </div>
                <div className="profile-data-row">
                  <span className="label">IIUM Email:</span>
                  <span className="val">{currentUser.email}</span>
                </div>
                <div className="profile-data-row">
                  <span className="label">Phone / WhatsApp:</span>
                  <span className="val">{currentUser.phone}</span>
                </div>
                <div className="profile-data-row">
                  <span className="label">Hostel Room:</span>
                  <span className="val">{currentUser.mahallah || 'Not specified'}</span>
                </div>
              </div>
            )}
          </div>

          {/* System & Architecture Info Box */}
          <div className="system-info-bento">
            <h4>📱 CampusEats App Architecture</h4>
            <div className="sys-items-grid">
              <div className="sys-item">
                <span className="sys-bullet">✓</span>
                <div>
                  <strong>BICS 3301 Course Project</strong>
                  <p>Cross-Platform App Architecture &bull; IIUM Kulliyyah of ICT</p>
                </div>
              </div>
              <div className="sys-item">
                <span className="sys-bullet">✓</span>
                <div>
                  <strong>Hybrid Cloud & Local Persistence</strong>
                  <p>
                    {isFirebaseConfigured
                      ? 'Connected to Firebase Firestore & Google Auth.'
                      : 'Dual-layer local persistence with ready Firebase SDK hooks.'}
                  </p>
                </div>
              </div>
              <div className="sys-item">
                <span className="sys-bullet">✓</span>
                <div>
                  <strong>Apple Human Interface Inspired</strong>
                  <p>Frosted glass, SF Pro typography, Dynamic Island notifications, and iOS safe area padding.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
