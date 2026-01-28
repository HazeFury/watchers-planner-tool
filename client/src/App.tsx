import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/admin/Dashboard'

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  )
}

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="p-4 bg-slate-900 text-white">NavBar Admin (Temporaire)</nav>
      <main className="p-4">
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