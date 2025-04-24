import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AdminPanel from "./layout/AdminPanel";

import Asociados from "./asociados/Asociados";
import AddAsociado from "./asociados/AddAsociado";


import Beneficiarios from "./beneficiarios/Beneficiarios";
import AddBeneficiario from "./beneficiarios/AddBeneficiario";
import EditBeneficiario from "./beneficiarios/EditBeneficiario";
import ViewBeneficiario from "./beneficiarios/ViewBeneficiario";
import SearchBeneficiario from "./beneficiarios/SearchBeneficiario";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AdminPanel />} />

                {/* Asociados Routes */}

                <Route path="/asociados" element={<Asociados />} />
                <Route path="/asociados/add" element={<AddAsociado />} />
                <Route path="/asociados/edit/:cedula" element={<AddAsociado />} />
                <Route path="/asociados/search" element={<Asociados />} />
                <Route path="/asociados/view/:cedula" element={<Asociados />} />

                {/* Beneficiarios Routes */}

                <Route path="/beneficiarios" element={<Beneficiarios />} />
                <Route path="/beneficiarios/add" element={<AddBeneficiario />} />
                <Route path="/beneficiarios/edit/:id" element={<EditBeneficiario />} />
                <Route path="/beneficiarios/view/:id" element={<ViewBeneficiario />} />
                <Route path="/beneficiarios/search" element={<SearchBeneficiario />} />
            </Routes>
        </Router>
    );
}

export default App;