import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaUserFriends,
  FaUser,
  FaFileInvoiceDollar,
  FaMedkit
} from 'react-icons/fa';

import './AdminPanel.css';

export default function AdminPanel() {
  return (
    <div className="admin-panel">
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">Logo</Link>
        </div>
        <ul className="navbar-links">
          <li><Link to="/logout">Logout</Link></li>
        </ul>
      </nav>

      <div className="content text-center">
        <h1 className="mb-4">Menú Principal</h1>
        <div className="buttons">
          <Link to="/associates">
            <button><FaUsers /> Administrar Asociados</button>
          </Link>
          <Link to="/beneficiaries">
            <button><FaUserFriends /> Administrar Beneficiarios</button>
          </Link>
          <Link to="/users">
            <button><FaUser /> Administrar Usuarios</button>
          </Link>
          <Link to="/reports">
            <button><FaFileInvoiceDollar /> Reportes</button>
          </Link>
          <Link to="/health-module">
            <button><FaMedkit /> Salud</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
