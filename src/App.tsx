import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Links from './pages/Links';
import CreateLink from './pages/CreateLink';
import AnonymousLinks from './pages/AnonymousLinks';
import CreateAnonymousLink from './pages/CreateAnonymousLink';
import Feedback from './pages/Feedback';
import AnonymousMessages from './pages/AnonymousMessages';
import PublicFeedback from './pages/PublicFeedback';
import PublicAnonymous from './pages/PublicAnonymous';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/f/:slug" element={<PublicFeedback />} />
          <Route path="/a/:slug" element={<PublicAnonymous />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/links"
            element={
              <ProtectedRoute>
                <Layout>
                  <Links />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <Layout>
                  <Feedback />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/anonymous-links"
            element={
              <ProtectedRoute>
                <Layout>
                  <AnonymousLinks />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/anonymous-links/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <CreateAnonymousLink />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/anonymous-messages"
            element={
              <ProtectedRoute>
                <Layout>
                  <AnonymousMessages />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/links/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <CreateLink />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Default redirect */}
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;