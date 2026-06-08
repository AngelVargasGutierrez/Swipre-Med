import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Pill, ClipboardList, Bell,
  LogOut, AlertTriangle, FileText, BarChart2, Users,
} from 'lucide-react';

const ALL_ITEMS = [
  { key:'dashboard',      label:'Dashboard',          icon:LayoutDashboard },
  { key:'medicamentos',   label:'Medicamentos',        icon:Pill            },
  { key:'inventario',     label:'Control Inventario',  icon:ClipboardList   },

  { key:'reportes',       label:'Reportes',            icon:FileText        },
  { key:'analytics',      label:'ANALÍTICAS',          icon:BarChart2       },
  { key:'usuarios',       label:'Usuarios',            icon:Users           },
];

export default function Sidebar({ currentPage, onNavigate }) {
  const { user, logout } = useAuth();
  const items = ALL_ITEMS.filter(i => user.menu.includes(i.key));

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <AlertTriangle size={22} />
        </div>
        <div className="sidebar-logo-text">
          <h2>MOPGIMED</h2>
          <span>Sistema de Inventario</span>
        </div>
      </div>

      {/* User info */}
      <div className="sidebar-user">
        <div className="sidebar-user-greeting">Bienvenido/a</div>
        <div className="sidebar-user-name">{user.name}</div>
        <div className="sidebar-user-role">{user.roleLabel}</div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {items.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={`nav-item${currentPage === key ? ' active' : ''}`}
            onClick={() => onNavigate(key)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
