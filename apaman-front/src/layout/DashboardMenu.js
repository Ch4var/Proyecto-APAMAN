import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardMenu.css'; // Opcional: si quieres estilos propios

export default function DashboardMenu() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-menu container mt-5 text-center">
      <h1 className="mb-4">Menú Principal</h1>
      <div className="row g-3 justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <button
            className="btn btn-primary w-100 py-3"
            onClick={() => navigate('/asociados')}
          >
            Administrar Asociados
          </button>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <button
            className="btn btn-secondary w-100 py-3"
            onClick={() => navigate('/beneficiaries')}
          >
            Administrar Beneficiarios
          </button>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <button
            className="btn btn-success w-100 py-3"
            onClick={() => navigate('/users')}
          >
            Administrar Usuarios
          </button>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <button
            className="btn btn-warning w-100 py-3"
            onClick={() => navigate('/reports')}
          >
            Reportes
          </button>
        </div>
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
