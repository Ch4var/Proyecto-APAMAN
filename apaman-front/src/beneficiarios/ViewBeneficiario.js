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
                const res = await axios.get(`http://localhost:8080/beneficiarios/${id}`);
                setBeneficiario(res.data);
            } catch (error) {
                console.error('Error al cargar el beneficiario', error);
            }
        };

        fetchBeneficiario();
    }, [id]);

    if (!beneficiario) {
        return <div className="container mt-4">Cargando...</div>;
    }

    const {
        cedula,
        nombre,
        apellido1,
        apellido2,
        sexo,
        fechaNacimiento,
        edad,
        religion,
        escolaridad,
        estadoDependencia,
        fechaIngreso,
        estado,
        responsableNombre,
        responsableApellido1,
        responsableApellido2,
        responsableTelefono,
        responsableDireccion,
        fondo,
        pension,
        presupuesto,
        foto
    } = beneficiario;

    return (
        <div className="container mt-4">
            <h2>Detalles del Beneficiario</h2>
            <div className="card mt-3 shadow-sm">
                <div className="row g-0">
                    <div className="col-md-4 text-center p-3">
                        {foto ? (
                            <img
                                src={`data:image/jpeg;base64,${foto}`}
                                alt="Foto del beneficiario"
                                className="img-fluid rounded"
                            />
                        ) : (
                            <div className="text-muted">Sin foto</div>
                        )}
                    </div>
                    <div className="col-md-8">
                        <table className="table table-borderless mb-0 p-3">
                            <tbody>
                            <tr><th>Cédula</th><td>{cedula}</td></tr>
                            <tr><th>Nombre Completo</th><td>{`${nombre} ${apellido1} ${apellido2}`}</td></tr>
                            <tr><th>Sexo</th><td>{sexo}</td></tr>
                            <tr><th>Fecha Nac.</th><td>{fechaNacimiento}</td></tr>
                            <tr><th>Edad</th><td>{edad}</td></tr>
                            <tr><th>Religión</th><td>{religion}</td></tr>
                            <tr><th>Escolaridad</th><td>{escolaridad}</td></tr>
                            <tr><th>Dependencia</th><td>{estadoDependencia}</td></tr>
                            <tr><th>Fecha Ingreso</th><td>{fechaIngreso}</td></tr>
                            <tr><th>Estado</th><td>{estado ? 'Activo' : 'Inactivo'}</td></tr>
                            <tr><th>Responsable</th><td>{`${responsableNombre} ${responsableApellido1} ${responsableApellido2}`}</td></tr>
                            <tr><th>Tel. Responsable</th><td>{responsableTelefono}</td></tr>
                            <tr><th>Dir. Responsable</th><td>{responsableDireccion}</td></tr>
                            <tr><th>Fondo</th><td>{fondo?.tipo || 'N/A'}</td></tr>
                            <tr><th>Pensión</th><td>{pension?.tipo || 'N/A'}</td></tr>
                            <tr><th>Presupuesto</th><td>{presupuesto}</td></tr>
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-end p-3">
                            <button
                                className="btn btn-outline-primary me-2"
                                onClick={() => navigate(`/beneficiarios/edit/${cedula}`)}
                            >
                                Editar
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate(-1)}
                            >
                                Volver
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}