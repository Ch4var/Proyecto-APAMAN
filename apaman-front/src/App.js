import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminPanel from './layout/AdminPanel';
import LoginUsuario from './usuarios/LoginUsuario';
import Logout from './pages/Logout';
import RutaPrivada from './RutaPrivada';

// Beneficiarios
import Beneficiarios from './beneficiarios/Beneficiarios';
import AddBeneficiario from './beneficiarios/AddBeneficiario';
import EditBeneficiario from './beneficiarios/EditBeneficiario';
import ViewBeneficiario from './beneficiarios/ViewBeneficiario';
import SearchBeneficiario from './beneficiarios/SearchBeneficiario';

// Asociados (placeholder)
const AsociadosPlaceholder = () => (
  <div className="container mt-5">
    <h2>Administrar Asociados (en desarrollo)</h2>
  </div>
);

// Usuarios y Roles
import UsuariosPanel from './usuarios/UsuariosPanel';
import AddUsuario from './usuarios/AddUsuario';
import RolesPanel from './roles/RolesPanel';

// Reportes y Salud (placeholders)
const ReportesPlaceholder = () => (
  <div className="container mt-5"><h2>Reportes (en desarrollo)</h2></div>
);
const SaludPlaceholder = () => (
  <div className="container mt-5"><h2>Módulo Salud (en desarrollo)</h2></div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* públicas */}
        <Route path="/login" element={<LoginUsuario />} />
        <Route path="/logout" element={<Logout />} />

        {/* panel principal */}
        <Route
          path="/"
          element={
            <RutaPrivada>
              <AdminPanel />
            </RutaPrivada>
          }
        />

        {/* asociados */}
        <Route
          path="/associates"
          element={
            <RutaPrivada>
              <AsociadosPlaceholder />
            </RutaPrivada>
          }
        />

        {/* beneficiarios */}
        <Route path="/beneficiaries" element={<RutaPrivada><Beneficiarios/></RutaPrivada>} />
        <Route path="/beneficiaries/add" element={<RutaPrivada><AddBeneficiario/></RutaPrivada>} />
        <Route path="/beneficiaries/edit/:id" element={<RutaPrivada><EditBeneficiario/></RutaPrivada>} />
        <Route path="/beneficiaries/view/:id" element={<RutaPrivada><ViewBeneficiario/></RutaPrivada>} />
        <Route path="/beneficiaries/search" element={<RutaPrivada><SearchBeneficiario/></RutaPrivada>} />

        {/* usuarios y roles */}
        <Route path="/users" element={<RutaPrivada><UsuariosPanel/></RutaPrivada>} />
        <Route path="/users/add" element={<RutaPrivada><AddUsuario/></RutaPrivada>} />
        <Route path="/roles" element={<RutaPrivada><RolesPanel/></RutaPrivada>} />

        {/* reportes y salud */}
        <Route path="/reports" element={<RutaPrivada><ReportesPlaceholder/></RutaPrivada>} />
        <Route path="/health-module" element={<RutaPrivada><SaludPlaceholder/></RutaPrivada>} />
      </Routes>
    </Router>
  );
}

export default App;