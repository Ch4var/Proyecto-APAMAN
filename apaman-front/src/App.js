import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Login from './auth/Login';
import Logout from './pages/Logout';
import RutaPrivada from './RutaPrivada';

import DashboardMenu from './layout/DashboardMenu';
import Usuarios from './usuarios/Usuarios';

import Asociados from './asociados/Asociados';
import AddAsociado from './asociados/AddAsociado';

import Beneficiarios from './beneficiarios/Beneficiarios';
import AddBeneficiario from './beneficiarios/AddBeneficiario';
import EditBeneficiario from './beneficiarios/EditBeneficiario';
import ViewBeneficiario from './beneficiarios/ViewBeneficiario';
import SearchBeneficiario from './beneficiarios/SearchBeneficiario';
import ObservacionesBeneficiario from './beneficiarios/ObservacionesBeneficiario';
import FormularioSaludBeneficiario from './beneficiarios/FormularioSaludBeneficiario';
import FormularioEconomicoBeneficiario from './beneficiarios/FormularioEconomicoBeneficiario';
import ExpedienteAdministrativoBeneficiario from './beneficiarios/ExpedienteAdministrativoBeneficiario';
import HistoriaMedicaBeneficiario from './beneficiarios/HistoriaMedicaBeneficiario';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Dashboard principal */}
        <Route
          path="/"
          element={
            <RutaPrivada>
              <DashboardMenu />
            </RutaPrivada>
          }
        />

        {/* Rutas privadas */}
        <Route
          path="/usuarios"
          element={
            <RutaPrivada>
              <Usuarios />
            </RutaPrivada>
          }
        />

        <Route
          path="/asociados"
          element={
            <RutaPrivada>
              <Asociados />
            </RutaPrivada>
          }
        />
        <Route
          path="/asociados/add"
          element={
            <RutaPrivada>
              <AddAsociado />
            </RutaPrivada>
          }
        />

        <Route
          path="/beneficiarios"
          element={
            <RutaPrivada>
              <Beneficiarios />
            </RutaPrivada>
          }
        />
        <Route
          path="/beneficiarios/add"
          element={
            <RutaPrivada>
              <AddBeneficiario />
            </RutaPrivada>
          }
        />
        <Route
          path="/beneficiarios/edit/:id"
          element={
            <RutaPrivada>
              <EditBeneficiario />
            </RutaPrivada>
          }
        />
        <Route
          path="/beneficiarios/view/:id"
          element={
            <RutaPrivada>
              <ViewBeneficiario />
            </RutaPrivada>
          }
        />
        <Route
          path="/beneficiarios/search"
          element={
            <RutaPrivada>
              <SearchBeneficiario />
            </RutaPrivada>
          }
        />
        <Route
          path="/beneficiarios/:id/observaciones"
          element={
            <RutaPrivada>
              <ObservacionesBeneficiario />
            </RutaPrivada>
          }
        />
        <Route
          path="/beneficiarios/:id/salud"
          element={
            <RutaPrivada>
              <FormularioSaludBeneficiario />
            </RutaPrivada>
          }
        />
        <Route
          path="/beneficiarios/:id/economico"
          element={
            <RutaPrivada>
              <FormularioEconomicoBeneficiario />
            </RutaPrivada>
          }
        />
        <Route
          path="/beneficiarios/:id/expedientes"
          element={
            <RutaPrivada>
              <ExpedienteAdministrativoBeneficiario />
            </RutaPrivada>
          }
        />
        <Route
          path="/beneficiarios/:id/historias"
          element={
            <RutaPrivada>
              <HistoriaMedicaBeneficiario />
            </RutaPrivada>
          }
        />

        {/* 4) Cualquier otra ruta */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
