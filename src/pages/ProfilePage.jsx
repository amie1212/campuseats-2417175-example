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
    showToast('Profile updated', 'success')
  }

  const handleGoogleSignIn = async () => {
    const res = await loginWithGoogle()
    if (res.success) {
      showToast(`Signed in as ${res.user.name}`, 'success')
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <span className="hero-eyebrow">Student Preferences</span>
        <h1 className="page-title">Profile & Settings</h1>
      </div>

      <div className="profile-layout-grid">
        {/* Left Card: User ID & Avatar */}
        <div className="profile-avatar-card">
          <div className="profile-avatar-large">
            <span className="avatar-char">{currentUser.name.charAt(0)}</span>
          </div>

          <h2 className="profile-name">{currentUser.name}</h2>
          <span className="profile-role-pill">
            {isAdmin ? 'Staff / Manager' : 'Student'}
          </span>

          <p className="profile-matric">Matric: {currentUser.matricNo}</p>
          <p className="profile-email">{currentUser.email}</p>

          <div className="profile-divider"></div>

          {/* Role Switcher */}
          <div className="role-switch-container">
            <span className="switch-label">View Mode:</span>
            <button
              onClick={() => {
                const nextRole = isAdmin ? 'student' : 'admin'
                switchRole(nextRole)
                showToast(`Switched to ${nextRole.toUpperCase()}`, 'info')
              }}
              className="btn btn-secondary-full"
            >
              {isAdmin ? 'Switch to Student View' : 'Switch to Admin View'}
            </button>
          </div>

          {/* Google Sign-in */}
          <div className="auth-action-box">
            <button onClick={handleGoogleSignIn} className="google-auth-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
              </svg>
              <span>{isFirebaseConfigured ? 'Sign in with Google' : 'Google Sign In (Demo)'}</span>
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
              <span className="stat-desc">Orders Placed</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">Kafe Faruq</span>
              <span className="stat-desc">Favorite Stall</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">RM 2.00</span>
              <span className="stat-desc">Voucher Savings</span>
            </div>
          </div>

          {/* Details Form Card */}
          <div className="profile-info-card">
            <div className="card-top-header">
              <h3>Contact Details</h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="btn-edit-small">
                  Edit
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
                    <label className="form-label">Matric ID</label>
                    <input
                      type="text"
                      className="apple-input"
                      value={formData.matricNo}
                      onChange={(e) => setFormData({ ...formData, matricNo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
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
                  <label className="form-label">Hostel Room</label>
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
                  <span className="label">Name:</span>
                  <span className="val">{currentUser.name}</span>
                </div>
                <div className="profile-data-row">
                  <span className="label">Matric ID:</span>
                  <span className="val">{currentUser.matricNo}</span>
                </div>
                <div className="profile-data-row">
                  <span className="label">Email:</span>
                  <span className="val">{currentUser.email}</span>
                </div>
                <div className="profile-data-row">
                  <span className="label">Phone:</span>
                  <span className="val">{currentUser.phone}</span>
                </div>
                <div className="profile-data-row">
                  <span className="label">Hostel Room:</span>
                  <span className="val">{currentUser.mahallah || 'Not specified'}</span>
                </div>
              </div>
            )}
          </div>

          {/* System Info Box */}
          <div className="system-info-bento">
            <h4>System Architecture</h4>
            <div className="sys-items-grid">
              <div className="sys-item">
                <span className="sys-bullet">&bull;</span>
                <div>
                  <strong>BICS 3301 Architecture</strong>
                  <p>Cross-Platform App Development &bull; IIUM</p>
                </div>
              </div>
              <div className="sys-item">
                <span className="sys-bullet">&bull;</span>
                <div>
                  <strong>Hybrid Cloud & Local Persistence</strong>
                  <p>
                    {isFirebaseConfigured
                      ? 'Connected to Firebase Firestore & Google Auth.'
                      : 'Dual-layer local persistence with Firebase SDK integration.'}
                  </p>
                </div>
              </div>
              <div className="sys-item">
                <span className="sys-bullet">&bull;</span>
                <div>
                  <strong>Minimalist Design System</strong>
                  <p>Strict 3-color palette: Canvas White, Ink Charcoal, and Precision Blue.</p>
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
