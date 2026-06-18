import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import ModernNavbar from './components/ModernNavbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import FlightsPage from './pages/FlightsPage';
import HotelsPage from './pages/HotelsPage';
import HotelsResults from './pages/HotelsResults';
import HotelDetails from './pages/HotelDetails';
import HotelCheckout from './pages/HotelCheckout';
import ExploreDetails from './pages/ExploreDetails';
import PackagesPage from './pages/PackagesPage';
import PackageDetails from './pages/PackageDetails';
import PackageCheckout from './pages/PackageCheckout';
import TourDetails from './pages/TourDetails';
import TourCheckout from './pages/TourCheckout';
import TrainsPage from './pages/TrainsPage';
import CabsPage from './pages/CabsPage';
import ToursPage from './pages/ToursPage';
import SearchResults from './pages/SearchResults';
import Checkout from './pages/Checkout';
import TrainCheckout from './pages/TrainCheckout';
import { Demo } from './pages/Demo';
import Help from './pages/Help';
import { AuthContext } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chatbot from './components/Chatbot';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'Admin') return <Navigate to="/" />;

  return children;
};

function App() {
  const location = useLocation();

  // Routes where Navbar and Footer should be hidden
  const hideLayoutRoutes = ['/login', '/register'];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!shouldHideLayout && <ModernNavbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Direct service routes */}
          <Route path="/flights" element={<FlightsPage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/results/hotels" element={<HotelsResults />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/trains" element={<TrainsPage />} />
          <Route path="/cabs" element={<CabsPage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/demo" element={<Demo />} />

          {/* Search results (with query params) - supports flights, trains, packages */}
          <Route path="/results/:type" element={<SearchResults />} />

          <Route path="/checkout" element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } />

          <Route path="/train-checkout" element={
            <PrivateRoute>
              <TrainCheckout />
            </PrivateRoute>
          } />
          <Route path="/help" element={<Help />} />
          <Route path="/hotel-details" element={
            <PrivateRoute>
              <HotelDetails />
            </PrivateRoute>
          } />

          <Route path="/explore-details" element={
            <PrivateRoute>
              <ExploreDetails />
            </PrivateRoute>
          } />

          <Route path="/hotel-checkout" element={
            <PrivateRoute>
              <HotelCheckout />
            </PrivateRoute>
          } />

          <Route path="/package-details" element={
            <PrivateRoute>
              <PackageDetails />
            </PrivateRoute>
          } />

          <Route path="/package-checkout" element={
            <PrivateRoute>
              <PackageCheckout />
            </PrivateRoute>
          } />

          <Route path="/tour-details" element={
            <PrivateRoute>
              <TourDetails />
            </PrivateRoute>
          } />

          <Route path="/tour-checkout" element={
            <PrivateRoute>
              <TourCheckout />
            </PrivateRoute>
          } />

          {/* Redirect /profile to dashboard profile */}
          <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />

          <Route path="/dashboard/*" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/admin/dashboard/*" element={
            <PrivateRoute adminOnly={true}>
              <AdminDashboard />
            </PrivateRoute>
          } />

        </Routes>
      </main>
      {!shouldHideLayout && <Footer />}
      <Chatbot />
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
