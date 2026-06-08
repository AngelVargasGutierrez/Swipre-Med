import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Medicamentos from './pages/Medicamentos';
import NuevoMedicamento from './pages/NuevoMedicamento';
import ControlInventario from './pages/ControlInventario';

import Reportes from './pages/Reportes';
import Analytics from './pages/Analytics';
import Usuarios from './pages/Usuarios';
import Sidebar from './components/Sidebar';

function AppContent() {
  const { user } = useAuth();
  const [page, setPage] = useState('dashboard');

  useEffect(() => {
    if (!user) return;
    const basePage = page === 'nuevo-medicamento' ? 'medicamentos' : page;
    if (!user.menu.includes(basePage)) {
      setPage(user.menu[0]);
    }
  }, [user, page]);

  if (!user) return <Login />;

  const navPage = page === 'nuevo-medicamento' ? 'medicamentos' : page;

  const renderPage = () => {
    switch (page) {
      case 'dashboard':         return <Dashboard />;
      case 'medicamentos':      return <Medicamentos onNuevo={() => setPage('nuevo-medicamento')} />;
      case 'nuevo-medicamento': return <NuevoMedicamento onBack={() => setPage('medicamentos')} />;
      case 'inventario':        return <ControlInventario />;

      case 'reportes':          return <Reportes />;
      case 'analytics':         return <Analytics />;
      case 'usuarios':          return <Usuarios />;
      default:                  return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar currentPage={navPage} onNavigate={setPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
