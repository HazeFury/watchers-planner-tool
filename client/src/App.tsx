import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/login/Login';
import { NavbarWatcher } from './components/watcher/NavbarWatcher';
import { NavbarAdmin } from './components/admin/NavbarAdmin';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/protection/ProtectedRoute';

const PublicLayout = () => (
  <div className="min-h-screen bg-white">
    <NavbarWatcher />
    <Outlet />
  </div>
);

const AdminLayout = () => (
  <div className="min-h-screen bg-slate-100">
    <NavbarAdmin />
    <main className="p-4 md:p-8 max-w-7xl mx-auto">
      <Outlet />
    </main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Route publique (accessible sans être connecté) */}
          <Route path="/login" element={<Login />} />

          {/* Routes protégées "User" (ou tout le monde) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Route>

          {/* Routes protégées "Admin" (strictement admin) */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route path="/dashboard" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;