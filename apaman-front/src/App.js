import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPanel from "./layout/AdminPanel";
import Beneficiarios from "./beneficiarios/Beneficiarios";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AdminPanel />} />
                <Route path="/beneficiaries" element={<Beneficiarios />} />
            </Routes>
        </Router>
    );
}

export default App;