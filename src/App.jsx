
import './App.css'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Events from './pages/Events'
import { Routes,Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import EventDetails from './pages/EventDetails'
import Booking from './pages/Booking'
import StripePaymentPage from './pages/Payment'
import { useLocation } from 'react-router-dom'
import BookingHistory from './pages/BookingHistory'
import VerifyQR from './admin/VerifyQR'
import AdminRoute from './components/AdminRoute'
import Footer from "./components/Footer";
import AdminPanel from './admin/AdminPanel'
import Success from './pages/Success'
import HostEvent from './pages/HostEvent'
import MyHostedEvents from './pages/MyHostedEvents'
import ScrollToTop from './components/ScrollToTop'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import SearchModal from './components/SearchModal'
import { Toaster } from "react-hot-toast";
import CategoryEvents from './pages/CategoryEvents'
import AdminDashboard from "./admin/AdminDashboard";
import AdminEvents from "./admin/AdminEvents";
import AdminBookings from "./admin/AdminBookings";
import UsersManager from "./admin/UsersManager";




function App() {

  const location=useLocation()

  const [searchOpen,setSearchOpen]=useState(false)

  const hideNavbar=
      location.pathname==='/login' ||
      location.pathname==='/register'

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
   <>
  <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
  <ScrollToTop />

<div id="app-root" className={searchOpen ? "app-blur" : ""}>
    {!hideNavbar && <Navbar onSearchOpen={()=> setSearchOpen(true)} />}

    <Routes>
      <Route path="/" element={<Navigate to="/events" replace />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/category/:category" element={<CategoryEvents />} />

      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/book/:id"
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <StripePaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <BookingHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/success"
        element={
          <ProtectedRoute>
            <Success />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verify-qr"
        element={
          <AdminRoute>
            <VerifyQR />
          </AdminRoute>
        }
      />
      <Route
        path="/host-event"
        element={
          <ProtectedRoute>
            <HostEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-events"
        element={
          <ProtectedRoute>
            <MyHostedEvents />
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminPanel />
    </AdminRoute>
  }
>
  <Route index element={<AdminDashboard />} />
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="events" element={<AdminEvents />} />
  <Route path="bookings" element={<AdminBookings />} />
  <Route path="users" element={<UsersManager />} />
</Route>

    </Routes>

    {!hideNavbar && !isAdminRoute && <Footer />}

  </div>
  <SearchModal
  open={searchOpen}
  onClose={() => setSearchOpen(false)}
/>

</>

  )
}

export default App
