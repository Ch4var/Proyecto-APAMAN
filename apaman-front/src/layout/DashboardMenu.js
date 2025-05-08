import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardMenu.css';

export default function DashboardMenu() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-menu container mt-5 text-center">
      <h1 className="mb-4">Menú Principal</h1>
      <div className="row g-3 justify-content-center">
        {/* Asociados */}
        <div className="col-12 col-md-6 col-lg-4">
          <button
            className="btn btn-primary w-100 py-3"
            onClick={() => navigate('/asociados')}
          >
            Administrar Asociados
          </button>
        </div>
        {/* Beneficiarios */}
        <div className="col-12 col-md-6 col-lg-4">
          <button
            className="btn btn-secondary w-100 py-3"
            onClick={() => navigate('/beneficiarios')}
          >
            Administrar Beneficiarios
          </button>
        </div>
        {/* Usuarios */}
        <div className="col-12 col-md-6 col-lg-4">
          <button
            className="btn btn-success w-100 py-3"
            onClick={() => navigate('/usuarios')}
          >
            Administrar Usuarios
          </button>
        </div>
        {/* Reportes (si lo implementarás luego) */}
        <div className="col-12 col-md-6 col-lg-4">
          <button
            className="btn btn-warning w-100 py-3"
            onClick={() => navigate('/reports')}
          >
            Reportes
          </button>
        </div>
        {/* Salud (si lo implementarás luego) */}
        <div className="col-12 col-md-6 col-lg-4">
          <button
            className="btn btn-danger w-100 py-3"
            onClick={() => navigate('/health-module')}
          >
            Salud
          </button>
        </div>
      </div>
    </div>
  );
}
