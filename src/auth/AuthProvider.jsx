import { useEffect, useState } from 'react'
import {
  deleteAccountRequest,
  getCurrentUser,
  loginRequest,
  logoutRequest,
  refreshAccessToken,
} from '../api/authApi.js'
import { AuthContext } from './authContext.js'

function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null)
  const [user, setUser] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    let isActive = true

    async function restoreSession() {
      try {
        const tokenData = await refreshAccessToken()
        const currentUser = await getCurrentUser(tokenData.accessToken)

        if (isActive) {
          setAccessToken(tokenData.accessToken)
          setUser(currentUser)
        }
      } catch {
        if (isActive) {
          setAccessToken(null)
          setUser(null)
        }
      } finally {
        if (isActive) setIsInitializing(false)
      }
    }

    restoreSession()

    return () => {
      isActive = false
    }
  }, [])

  const login = async (credentials) => {
    const data = await loginRequest(credentials)
    setAccessToken(data.accessToken)
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    await logoutRequest()
    setAccessToken(null)
    setUser(null)
  }

  const deleteAccount = async () => {
    await deleteAccountRequest(accessToken)
    setAccessToken(null)
    setUser(null)
  }

  const value = {
    accessToken,
    deleteAccount,
    isAuthenticated: Boolean(accessToken && user),
    isInitializing,
    login,
    logout,
    user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
