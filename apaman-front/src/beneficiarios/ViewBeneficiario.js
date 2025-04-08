import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ViewBeneficiario() {
    const { id } = useParams();
    const [beneficiario, setBeneficiario] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBeneficiario = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/Beneficiario/${id}`);
                setBeneficiario(res.data);
            } catch (error) {
                console.error("Error al cargar el beneficiario", error);
            }
        };

        fetchBeneficiario();
    }, [id]);

    if (!beneficiario) {
        return <div className="container mt-4">Cargando...</div>;
    }

    return (
        <div className="container mt-4">
            <h2>Detalles del Beneficiario</h2>
            <table className="table table-bordered mt-3">
                <tbody>
                <tr><th>Cédula</th><td>{beneficiario.cedula}</td></tr>
                <tr><th>Nombre</th><td>{beneficiario.nombre}</td></tr>
                <tr><th>Sexo</th><td>{beneficiario.sexo}</td></tr>
                <tr><th>Fecha Nacimiento</th><td>{beneficiario.fechaNacimiento}</td></tr>
                <tr><th>Edad</th><td>{beneficiario.edad}</td></tr>
                <tr><th>Religión</th><td>{beneficiario.religion}</td></tr>
                <tr><th>Escolaridad</th><td>{beneficiario.gradoEscolaridad}</td></tr>
                <tr><th>Dependencia</th><td>{beneficiario.estadoDependencia}</td></tr>
                <tr><th>Ingreso</th><td>{beneficiario.fechaIngreso}</td></tr>
                <tr><th>Estado</th><td>{beneficiario.estado}</td></tr>
                <tr><th>Contacto</th><td>{beneficiario.infoContacto}</td></tr>
                <tr><th>Responsable</th><td>{beneficiario.personaResponsable}</td></tr>
                <tr><th>Tel. Responsable</th><td>{beneficiario.telefonoResponsable}</td></tr>
                <tr><th>Dirección Responsable</th><td>{beneficiario.direccionResponsable}</td></tr>
                <tr><th>Info Financiera</th><td>{beneficiario.infoFinanciera}</td></tr>
                <tr><th>Pensionado</th><td>{beneficiario.pensionado ? "Sí" : "No"}</td></tr>
                <tr><th>Presupuesto</th><td>{beneficiario.presupuesto}</td></tr>
                <tr><th>Observaciones</th><td>{beneficiario.observaciones}</td></tr>
                </tbody>
            </table>
            <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>Volver</button>
        </div>
    );
}