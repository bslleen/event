import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventsProvider } from './context/EventsContext';
import { ToastProvider } from './components/Toast';
import Login        from './pages/Login';
import Home         from './pages/Home';
import MyEvents     from './pages/MyEvents';
import CreateEvent  from './pages/CreateEvent';
import AdminDashboard from './pages/AdminDashboard';
import AdminEvents  from './pages/AdminEvents';
import AdminUsers   from './pages/AdminUsers';
import Layout       from './components/Layout';
import './App.css';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index        element={<Home />} />
        <Route path="my-events"     element={<MyEvents />} />
        <Route path="create-event"  element={<CreateEvent />} />
      </Route>
      <Route path="/admin" element={<ProtectedRoute adminOnly><Layout isAdmin /></ProtectedRoute>}>
        <Route index        element={<AdminDashboard />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="users"  element={<AdminUsers />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <EventsProvider>
            <AppRoutes />
          </EventsProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
