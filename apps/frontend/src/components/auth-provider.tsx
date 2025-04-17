"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  isPendingVerification: boolean
  isFirstVisit: boolean
  setFirstVisit: (value: boolean) => void
  login: (username: string, password: string, rememberMe: boolean) => Promise<boolean>
  verifyCode: (code: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isPendingVerification, setIsPendingVerification] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [isFirstVisit, setIsFirstVisit] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem("isAuthenticated")
    const verificationStatus = localStorage.getItem("isPendingVerification")
    const savedUsername = localStorage.getItem("username")
    const rememberMe = localStorage.getItem("rememberMe") === "true"
    const firstVisitStatus = localStorage.getItem("isFirstVisit")

    // 初回アクセスフラグを確認
    if (firstVisitStatus === null) {
      localStorage.setItem("isFirstVisit", "true")
      setIsFirstVisit(true)
    } else {
      setIsFirstVisit(firstVisitStatus === "true")
    }

    // Only restore session if rememberMe is true or not checking yet
    if (rememberMe || !localStorage.getItem("rememberMe")) {
      setIsAuthenticated(authStatus === "true")
      setIsPendingVerification(verificationStatus === "true")
      if (savedUsername) setUsername(savedUsername)
    } else {
      // Clear any existing session if rememberMe is false
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("isPendingVerification")
      localStorage.removeItem("username")
    }

    setIsLoading(false)
  }, [])

  const login = async (usernameInput: string, password: string, rememberMe: boolean) => {
    // In a real app, you would validate credentials against a backend
    // For this demo, we'll accept any non-empty username and password
    if (usernameInput.trim() && password.trim()) {
      setUsername(usernameInput)
      setIsPendingVerification(true)
      localStorage.setItem("isPendingVerification", "true")
      localStorage.setItem("username", usernameInput)
      localStorage.setItem("rememberMe", rememberMe.toString())
      return true
    }
    return false
  }

  const verifyCode = async (code: string) => {
    // In a real app, you would validate the code against a backend
    // For this demo, we'll accept any 6-digit code
    if (code.length === 6 && /^\d+$/.test(code)) {
      setIsAuthenticated(true)
      setIsPendingVerification(false)
      // 認証成功時に初回アクセスフラグをfalseに設定
      setIsFirstVisit(false)
      localStorage.setItem("isFirstVisit", "false")
      localStorage.setItem("isAuthenticated", "true")
      localStorage.removeItem("isPendingVerification")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setIsPendingVerification(false)
    setUsername("")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("isPendingVerification")
    localStorage.removeItem("username")
    // Keep rememberMe setting for next login
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isPendingVerification,
        isFirstVisit,
        setFirstVisit: (value) => {
          setIsFirstVisit(value)
          localStorage.setItem("isFirstVisit", value.toString())
        },
        login,
        verifyCode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
