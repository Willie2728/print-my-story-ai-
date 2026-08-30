import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import SiteGuide from '@/components/SiteGuide';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Entrance from '@/pages/Entrance';
import Home from '@/pages/Home';
import Create from '@/pages/Create';
import Orders from '@/pages/Orders';
import OrderSuccess from '@/pages/OrderSuccess';
import CompanionEntrance from '@/pages/companion/CompanionEntrance';
import CompanionHome from '@/pages/companion/CompanionHome';
import CompanionCreate from '@/pages/companion/CompanionCreate';
import CompanionOrders from '@/pages/companion/CompanionOrders';
import CompanionOrderSuccess from '@/pages/companion/CompanionOrderSuccess';
import Commercial from '@/pages/Commercial';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      {/* Add your page Route elements here */}
      <Route path="/" element={<Entrance />} />
      <Route path="/home" element={<Home />} />
      <Route path="/create" element={<Create />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/companion" element={<CompanionEntrance />} />
      <Route path="/companion/classic" element={<CompanionHome />} />
      <Route path="/companion/create" element={<CompanionCreate />} />
      <Route path="/companion/orders" element={<CompanionOrders />} />
      <Route path="/companion/order-success" element={<CompanionOrderSuccess />} />
      <Route path="/commercial" element={<Commercial />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <SiteGuide />
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App