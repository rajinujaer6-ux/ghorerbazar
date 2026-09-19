import React, { Component, useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastContainer } from './components/Toast';
import { FloatingWidgets } from './components/FloatingWidgets';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { CartPage } from './pages/CartPage';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { TrackOrder } from './pages/TrackOrder';
import { Login } from './pages/Login';
import { UserAccount } from './pages/UserAccount';
import { WishlistPage } from './pages/WishlistPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage, FaqPage, ContactPage, PrivacyPage, TermsPage } from './pages/StaticPages';

const MainApp: React.FC = () => {
  const { isAdmin } = useStore();
  const [currentView, setCurrentView] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string | undefined>(undefined);

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    setRouteParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'shop':
        return <Shop initialQuery={routeParam} onNavigate={handleNavigate} />;
      case 'product':
        return (
          <ProductDetails
            productSlug={routeParam || 'raw-sundarban-wild-honey'}
            onNavigate={handleNavigate}
          />
        );
      case 'cart':
        return <CartPage onNavigate={handleNavigate} />;
      case 'checkout':
        return <Checkout onNavigate={handleNavigate} />;
      case 'order-success':
        return <OrderSuccess orderNumber={routeParam} onNavigate={handleNavigate} />;
      case 'track-order':
        return <TrackOrder initialOrderNumber={routeParam} onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'account':
        return <UserAccount initialTab={routeParam} onNavigate={handleNavigate} />;
      case 'wishlist':
        return <WishlistPage onNavigate={handleNavigate} />;
      case 'admin':
        if (!isAdmin) {
          return (
            <div className="w-full max-w-2xl mx-auto px-4 py-20 text-center">
              <div className="bg-white rounded-3xl border border-red-100 shadow-xl p-8 sm:p-12">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-4">
                  <span className="text-2xl font-bold">🔒</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
                  অ্যাডমিন প্যানেল সংরক্ষিত
                </h1>
                <p className="text-sm text-slate-600 mb-6">
                  শুধুমাত্র অনুমোদিত আইডি <strong>rajinujaer6@gmail.com</strong> দিয়ে লগইন করলে অ্যাডমিন প্যানেল দেখা যাবে।
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleNavigate('home')}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    হোমে ফিরে যান
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate('login')}
                    className="px-5 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    লগইন করুন
                  </button>
                </div>
              </div>
            </div>
          );
        }
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'faq':
        return <FaqPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      case 'privacy':
        return <PrivacyPage onNavigate={handleNavigate} />;
      case 'terms':
        return <TermsPage onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1E293B] font-['Plus_Jakarta_Sans'] selection:bg-orange-500 selection:text-white">
      {/* Global Navigation Header */}
      <Header onNavigate={handleNavigate} currentView={currentView} />

      {/* Main Page Body */}
      <main className="flex-1">{renderView()}</main>

      {/* Global Modals & Drawers */}
      <CartDrawer onNavigate={handleNavigate} />
      <QuickViewModal onNavigate={handleNavigate} />
      <ToastContainer />
      <FloatingWidgets onNavigate={handleNavigate} />

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  props: ErrorBoundaryProps;
  state: ErrorBoundaryState = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application Error Boundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4 font-['Plus_Jakarta_Sans']">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
              !
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-500 mb-6">
              An unexpected error occurred while rendering the page. You can try refreshing or resetting the store data.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-[#EA580C] text-white font-bold text-sm rounded-xl hover:bg-[#C2410C] transition-colors"
              >
                Refresh Page
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors"
              >
                Reset Store Data
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <MainApp />
      </StoreProvider>
    </ErrorBoundary>
  );
}
