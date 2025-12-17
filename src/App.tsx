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
import GoogleCallback from './pages/GoogleCallback';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/verifyEmail';
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

// Exam Mode (Student)
import ExamLayout from './layouts/ExamLayout';
import ExamDashboard from './pages/exam/ExamDashboard';
import MyExams from './pages/exam/MyExams';
import ExamResults from './pages/exam/ExamResults';
import Certificates from './pages/exam/Certificates';
import TakeExam from './pages/exam/TakeExam';
import RegisterExam from './pages/exam/RegisterExam';

// Examiner Mode
import ExaminerLayout from './layouts/ExaminerLayout';
import ExaminerDashboard from './pages/examiner/ExaminerDashboard';
import ExamList from './pages/examiner/ExamList';
import CreateExam from './pages/examiner/CreateExam';
import ExamDetail from './pages/examiner/ExamDetail';
import EditExam from './pages/examiner/EditExam';
import AddQuestion from './pages/examiner/AddQuestion';
import EditQuestion from './pages/examiner/EditQuestion';
import Grading from './pages/examiner/Grading';
import Analytics from './pages/examiner/Analytics';
import Proctoring from './pages/examiner/Proctoring';
import ExaminerStudents from './pages/examiner/ExaminerStudents';
import ExaminerSettings from './pages/examiner/ExaminerSettings';
import ExaminerQuestions from './pages/examiner/ExaminerQuestions';
import Profile from './pages/exam/Profile';
import Settings from './pages/exam/Settings';


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
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<GoogleCallback />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
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
                <Layout>
                  <CreateForm />
                </Layout>
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
                <Layout>
                  <ViewForm />
                </Layout>
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

          {/* Exam Mode Routes (Student) */}
          <Route
            path="/exam"
            element={
              <ProtectedRoute>
                <ExamLayout>
                  <ExamDashboard />
                </ExamLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/exam/my-exams"
            element={
              <ProtectedRoute>
                <ExamLayout>
                  <MyExams />
                </ExamLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/exam/results"
            element={
              <ProtectedRoute>
                <ExamLayout>
                  <ExamResults />
                </ExamLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/exam/certificates"
            element={
              <ProtectedRoute>
                <ExamLayout>
                  <Certificates />
                </ExamLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/exam/take/:examId"
            element={
              <ProtectedRoute>
                <TakeExam />
              </ProtectedRoute>
            }
          />

          <Route
            path="/exam/register"
            element={
              <ProtectedRoute>
                <RegisterExam />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ExamLayout>
                  <Profile />
                </ExamLayout>
              </ProtectedRoute>
            }
          />

           <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ExamLayout>
                  <Settings />
                </ExamLayout>
              </ProtectedRoute>
            }
          />

          {/* Examiner Mode Routes */}
          <Route
            path="/examiner"
            element={
              <ProtectedRoute>
                <ExaminerLayout>
                  <ExaminerDashboard />
                </ExaminerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/examiner/exams"
            element={
              <ProtectedRoute>
                <ExaminerLayout>
                  <ExamList />
                </ExaminerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/examiner/exams/new"
            element={
              <ProtectedRoute>
                <ExaminerLayout>
                  <CreateExam />
                </ExaminerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/examiner/exams/:examId/edit"
            element={
              <ProtectedRoute>
                <ExaminerLayout>
                  <EditExam />
                </ExaminerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/examiner/exams/:examId/questions/add"
            element={
              <ProtectedRoute>
                <ExaminerLayout>
                  <AddQuestion />
                </ExaminerLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/examiner/exams/:examId/questions/:questionId/edit"
            element={
              <ProtectedRoute>
                <ExaminerLayout>
                  <EditQuestion />
                </ExaminerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/examiner/exams/:examId"
            element={
              <ProtectedRoute>
                <ExaminerLayout>
                  <ExamDetail />
                </ExaminerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/examiner/grading"
            element={
              <ProtectedRoute>
                <ExaminerLayout>
                  <Grading />
                </ExaminerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/examiner/analytics"
            element={
              <ProtectedRoute>
                <ExaminerLayout>
                  <Analytics />
                </ExaminerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/examiner/proctoring"
            element={
              <ProtectedRoute>
                <ExaminerLayout>
                  <Proctoring />
                </ExaminerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/examiner/students"
            element={
              <ProtectedRoute>
                <ExaminerLayout>
                  <ExaminerStudents />
                </ExaminerLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/examiner/questions"
            element={
              <ProtectedRoute>
                <ExaminerLayout>
                  <ExaminerQuestions />
                </ExaminerLayout>
              </ProtectedRoute>
            }
          />

           <Route
            path="/examiner/settings"
            element={
              <ProtectedRoute>
                <ExaminerLayout>
                  <ExaminerSettings />
                </ExaminerLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;