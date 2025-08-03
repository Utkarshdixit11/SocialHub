import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PostProvider } from './context/PostContext'
import { MobileMenuProvider } from './context/MobileMenuContext'
import ProtectedRoute from './Components/ProtectedRoute'
import ErrorBoundary from './Components/ErrorBoundary'
import LoginPage from './Components/login/login'
import './App.css'
import HomePage from "./Components/pages/Home/HomePage.jsx"
import PostsPage from "./Components/pages/Post/post.jsx"
import ProfilePage from "./Components/pages/Profile/Profile.jsx"

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PostProvider>
          <MobileMenuProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/post"
                  element={
                    <ProtectedRoute>
                      <PostsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/home" replace />} />
              </Routes>
            </Router>
          </MobileMenuProvider>
        </PostProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
