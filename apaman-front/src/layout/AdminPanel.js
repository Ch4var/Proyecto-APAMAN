import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaUserFriends,
  FaUser,
  FaUserShield,
  FaFileInvoiceDollar,
  FaMedkit
} from 'react-icons/fa';
import './AdminPanel.css';

// helper para leer roles desde localStorage
const getRoles = () =>
  JSON.parse(localStorage.getItem('roles') || '[]').map(r => r.nombre);

const hasRole = rol => getRoles().includes(rol);

export default function AdminPanel() {
  const roles = getRoles();

  // definición dinámica de botones
  const botones = [
    {
      permiso: ['ADMINISTRADOR'],
      to: '/users',
      icon: <FaUser />,
      texto: 'Administrar Usuarios'
    },
    {
      permiso: ['ADMINISTRADOR'],
      to: '/roles',
      icon: <FaUserShield />,
      texto: 'Administrar Roles'
    },
    {
      permiso: ['ADMINISTRADOR','ASISTENTE','REVISOR'],
      to: '/associates',
      icon: <FaUsers />,
      texto: 'Administrar Asociados'
    },
    {
      permiso: ['ADMINISTRADOR','ASISTENTE','REVISOR'],
      to: '/beneficiaries',
      icon: <FaUserFriends />,
      texto: 'Administrar Beneficiarios'
    },
    {
      permiso: ['ADMINISTRADOR','ASISTENTE','REVISOR'],
      to: '/reports',
      icon: <FaFileInvoiceDollar />,
      texto: 'Reportes'
    },
    {
      permiso: ['ADMINISTRADOR','PROFESIONAL_SALUD'],
      to: '/health-module',
      icon: <FaMedkit />,
      texto: 'Salud'
    }
  ];

  return (
    <div className="admin-panel">
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">Logo</Link>
        </div>
        <ul className="navbar-links">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/logout">Logout</Link></li>
        </ul>
      </nav>

      <div className="content">
        <h1>Bienvenido(a)</h1>
        <div className="buttons">
          {botones.map((b, i) =>
            b.permiso.some(p => roles.includes(p)) ? (
              <Link key={i} to={b.to}>
                <button>
                  {b.icon} {b.texto}
                </button>
              </Link>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}