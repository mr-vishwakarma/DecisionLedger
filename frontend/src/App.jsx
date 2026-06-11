import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import LandingPage from './features/landing/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './features/dashboard/DashboardPage';
import DecisionsListPage from './features/decisions/DecisionsListPage';
import NewDecisionPage from './features/decisions/NewDecisionPage';
import DecisionDetailPage from './features/decisions/DecisionDetailPage';
import TimelinePage from './features/timeline/TimelinePage';
import AnalyticsPage from './features/analytics/AnalyticsPage';
import AuthPage from './features/auth/AuthPage';
import { FeaturesPage, PricingPage, DocumentationPage, CommunityPage } from './features/marketing/MarketingPages';
import DemoPage from './features/marketing/DemoPage';
import CommandCenter from './features/intelligence/CommandCenter';
import { LogoutPage, MyVotesPage, ProfilePage, SettingsPage, TeamPage } from './features/account/WorkspacePages';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './routes/RouteGuards';
import SkipNavigation from './components/SkipNavigation';
import ScrollToTop from './components/ScrollToTop';
import AIChatWidget from './components/AIChatWidget';
import CompanyNameModal from './components/CompanyNameModal';

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
        <Route path="/login" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/systems" element={<CommandCenter />} />
        <Route path="/logout" element={<LogoutPage />} />

        
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/decisions" element={<DecisionsListPage />} />
            <Route path="/decisions/new" element={<NewDecisionPage />} />
            <Route path="/decisions/:id" element={<DecisionDetailPage />} />
            <Route path="/votes" element={<MyVotesPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/teams" element={<TeamPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SkipNavigation />
        <ScrollToTop />
        <AppRoutes />
        <AIChatWidget />
        <CompanyNameModal />
        <ToastContainer
          position="top-right"
          autoClose={2600}
          closeOnClick
          pauseOnFocusLoss={false}
          newestOnTop
          theme="dark"
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
