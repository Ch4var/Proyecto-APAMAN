import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaUserFriends, FaUsers, FaFileInvoiceDollar, FaMedkit } from 'react-icons/fa';
import './AdminPanel.css';

export default function AdminPanel() {
    return (
        <div className="admin-panel">
            <nav className="navbar">
                <div className="navbar-logo">
                    <Link to="/">Logo</Link>
                </div>
                <ul className="navbar-links">
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                </ul>
            </nav>
            <div className="content">
                <h1>Bienvenido(a), Marieta</h1>
                <div className="buttons">
                    <Link to="/users">
                        <button>
                            <FaUser /> Administrar Usuarios
                        </button>
                    </Link>
                    <Link to="/beneficiarios">
                        <button>
                            <FaUserFriends /> Administrar Beneficiarios
                        </button>
                    </Link>
                    <Link to="/asociados">
                        <button>
                            <FaUsers /> Administrar Asociados
                        </button>
                    </Link>
                    <Link to="/reportes">
                        <button>
                            <FaFileInvoiceDollar /> Reportes
                        </button>
                    </Link>
                    <Link to="/health-module">
                        <button>
                            <FaMedkit /> Módulo Salud
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}