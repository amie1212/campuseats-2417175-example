import { createContext, useContext, useState, useEffect } from 'react'
import { auth, googleProvider, signInWithPopup, signOut, isFirebaseConfigured } from '../firebase'

const AuthContext = createContext(null)

const DEFAULT_STUDENT = {
  id: 'usr-2417175',
  name: 'Abdullah Najmi',
  email: 'abdullah.najmi@live.iium.edu.my',
  matricNo: '2417175',
  role: 'student', // 'student' or 'admin'
  phone: '+60 11-2345 6789',
  mahallah: 'Mahallah Faruq, Block B',
  isDemoUser: true,
}

const DEFAULT_ADMIN = {
  id: 'adm-faruq-01',
  name: 'Kafe Faruq Admin (Manager)',
  email: 'admin.faruq@campuseats.iium.my',
  matricNo: 'STAFF-9021',
  role: 'admin',
  phone: '+60 19-8765 4321',
  mahallah: 'Faruq Cafeteria Management',
  isDemoUser: true,
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('campuseats_user')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Error parsing stored user', e)
      }
    }
    return DEFAULT_STUDENT
  })

  const [loading, setLoading] = useState(false)

  // Listen to Firebase auth state if configured
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = auth.onAuthStateChanged((fbUser) => {
        if (fbUser) {
          const mappedUser = {
            id: fbUser.uid,
            name: fbUser.displayName || 'IIUM Student',
            email: fbUser.email,
            matricNo: fbUser.email?.includes('iium.edu.my') ? fbUser.email.split('@')[0] : '2417175',
            role: fbUser.email?.includes('admin') ? 'admin' : (currentUser?.role || 'student'),
            phone: fbUser.phoneNumber || '+60 11-2345 6789',
            photoURL: fbUser.photoURL,
            isDemoUser: false,
          }
          setCurrentUser(mappedUser)
          localStorage.setItem('campuseats_user', JSON.stringify(mappedUser))
        }
      })
      return () => unsubscribe()
    }
  }, [currentUser?.role])

  const saveUser = (user) => {
    setCurrentUser(user)
    localStorage.setItem('campuseats_user', JSON.stringify(user))
  }

  // Quick switch between Student and Admin mode
  const switchRole = (newRole) => {
    if (newRole === 'admin') {
      saveUser({ ...DEFAULT_ADMIN })
    } else {
      saveUser({ ...DEFAULT_STUDENT })
    }
  }

  // Google sign in via Firebase
  const loginWithGoogle = async () => {
    setLoading(true)
    if (isFirebaseConfigured && auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider)
        const user = result.user
        const mapped = {
          id: user.uid,
          name: user.displayName || 'Google User',
          email: user.email,
          matricNo: '2417175',
          role: 'student',
          photoURL: user.photoURL,
          isDemoUser: false,
        }
        saveUser(mapped)
        setLoading(false)
        return { success: true, user: mapped }
      } catch (err) {
        setLoading(false)
        console.warn('Google sign-in fallback triggered:', err.message)
      }
    }

    // Friendly fallback when Firebase credentials are not yet pasted
    const simulated = {
      ...DEFAULT_STUDENT,
      name: 'Abdullah Najmi (Google Demo)',
      isDemoUser: true,
    }
    saveUser(simulated)
    setLoading(false)
    return { success: true, user: simulated }
  }

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth)
      } catch (e) {
        console.error(e)
      }
    }
    saveUser(DEFAULT_STUDENT)
  }

  const updateProfile = (updates) => {
    const updated = { ...currentUser, ...updates }
    saveUser(updated)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser?.role === 'admin',
        loading,
        switchRole,
        loginWithGoogle,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
