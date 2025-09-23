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

// Forms
import Forms from './pages/Forms';
import CreateForm from './pages/CreateForm';
import FormDetail from './pages/FormDetail';
import FormResults from './pages/FormResults';
import FormAnalytics from './pages/FormAnalytics';
import ViewForm from './pages/ViewForm';
import PublicForm from './pages/PublicForm';
import EditForm from './pages/EditForm';


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

          <Route
            path="/forms"
            element={
              <ProtectedRoute>
                <Layout><Forms /></Layout>
              </ProtectedRoute>
            }
          />

          <Route 
            path="/forms/new"
            element={
              <ProtectedRoute>
                <CreateForm />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/forms/:formId/results"
            element={
              <ProtectedRoute>
                <Layout><FormResults /></Layout>
              </ProtectedRoute>
            }
          />

          <Route 
            path="/forms/:formId/analytics"
            element={
              <ProtectedRoute>
                <Layout><FormAnalytics /></Layout>
              </ProtectedRoute>
            }
          />

          <Route 
            path="/forms/:formId/view"
            element={
              <ProtectedRoute>
                <ViewForm />
              </ProtectedRoute>
            }
          />

          <Route path="/p/:slug" element={<PublicForm />} />

          <Route path="/forms/:formId" element={<FormDetail />} />
          
          <Route 
            path="/forms/:formId/edit"
            element={
              <ProtectedRoute>
                <Layout><EditForm /></Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;