import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/admin/Dashboard'
import { NavbarWatcher } from './components/watcher/NavbarWatcher'
import { NavbarAdmin } from './components/admin/NavbarAdmin'

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white">
		<NavbarWatcher />
      <Outlet />
    </div>
  )
}

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <NavbarAdmin />
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App