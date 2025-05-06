import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPanel from "./layout/AdminPanel";
import Beneficiarios from "./beneficiarios/Beneficiarios";
import AddBeneficiario from "./beneficiarios/AddBeneficiario";
import EditBeneficiario from "./beneficiarios/EditBeneficiario";
import ViewBeneficiario from "./beneficiarios/ViewBeneficiario";
import SearchBeneficiario from "./beneficiarios/SearchBeneficiario";
import ObservacionesBeneficiario from "./beneficiarios/ObservacionesBeneficiario";
import FormularioSaludBeneficiario from "./beneficiarios/FormularioSaludBeneficiario";
import FormularioEconomicoBeneficiario from "./beneficiarios/FormularioEconomicoBeneficiario";
import ExpedienteAdministrativoBeneficiario from "./beneficiarios/ExpedienteAdministrativoBeneficiario";
import HistoriaMedicaBeneficiario from "./beneficiarios/HistoriaMedicaBeneficiario";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AdminPanel />} />
                <Route path="/beneficiarios" element={<Beneficiarios />} />
                <Route path="/beneficiarios/add" element={<AddBeneficiario />} />
                <Route path="/beneficiarios/edit/:id" element={<EditBeneficiario />} />
                <Route path="/beneficiarios/view/:id" element={<ViewBeneficiario />} />
                <Route path="/beneficiarios/search" element={<SearchBeneficiario />} />
                <Route path="/beneficiarios/:id/observaciones" element={<ObservacionesBeneficiario />} />
                <Route path="/beneficiarios/:id/salud" element={<FormularioSaludBeneficiario />} />
                <Route path="/beneficiarios/:id/economico" element={<FormularioEconomicoBeneficiario />} />
                <Route path="/beneficiarios/:id/expedientes" element={<ExpedienteAdministrativoBeneficiario />} />
                <Route path="/beneficiarios/:id/historias" element={<HistoriaMedicaBeneficiario />} />
            </Routes>
        </Router>
    );
}

export default App;