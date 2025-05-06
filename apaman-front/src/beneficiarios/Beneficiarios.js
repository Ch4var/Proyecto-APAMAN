import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Beneficiarios() {
    const [beneficiarios, setBeneficiarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadBeneficiarios();
    }, []);

    const loadBeneficiarios = async () => {
        try {
            const result = await axios.get('http://localhost:8080/beneficiarios');
            setBeneficiarios(result.data);
        } catch (error) {
            console.error('Error cargando beneficiarios', error);
        }
    };

    const deleteBeneficiario = async (cedula) => {
        try {
            await axios.delete(`http://localhost:8080/beneficiarios/${cedula}`);
            loadBeneficiarios();
        } catch (error) {
            console.error('Error borrando beneficiario', error);
        }
    };

    const confirmDelete = (cedula) => {
        if (window.confirm('¿Está seguro de que desea eliminar este beneficiario?')) {
            deleteBeneficiario(cedula);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Lista de Beneficiarios</h2>
                <div>
                    <button
                        className="btn btn-info mx-2"
                        onClick={() => navigate('/beneficiarios/search')}
                    >
                        Buscar Beneficiario
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={() => navigate('/beneficiarios/add')}
                    >
                        Agregar Beneficiario
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Cédula</th>
                        <th>Nombre Completo</th>
                        <th>Sexo</th>
                        <th>Fecha Nac.</th>
                        <th>Edad</th>
                        <th>Religión</th>
                        <th>Escolaridad</th>
                        <th>Dependencia</th>
                        <th>Ingreso</th>
                        <th>Estado</th>
                        <th>Responsable</th>
                        <th>Tel. Responsable</th>
                        <th>Dir. Responsable</th>
                        <th>Fondo</th>
                        <th>Pensión</th>
                        <th>Presupuesto</th>
                        <th>Foto</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {beneficiarios.map((b, idx) => (
                        <tr key={b.cedula}>
                            <td>{idx + 1}</td>
                            <td>{b.cedula}</td>
                            <td>{`${b.nombre} ${b.apellido1} ${b.apellido2}`}</td>
                            <td>{b.sexo}</td>
                            <td>{b.fechaNacimiento}</td>
                            <td>{b.edad}</td>
                            <td>{b.religion}</td>
                            <td>{b.escolaridad}</td>
                            <td>{b.estadoDependencia}</td>
                            <td>{b.fechaIngreso}</td>
                            <td>{b.estado ? 'Activo' : 'Inactivo'}</td>
                            <td>{`${b.responsableNombre} ${b.responsableApellido1} ${b.responsableApellido2}`}</td>
                            <td>{b.responsableTelefono}</td>
                            <td>{b.responsableDireccion}</td>
                            <td>{b.fondo?.tipo}</td>
                            <td>{b.pension?.tipo}</td>
                            <td>{b.presupuesto}</td>
                            <td>
                                {b.foto ? (
                                    <img
                                        src={`data:image/jpeg;base64,${b.foto}`}
                                        alt="Foto del beneficiario"
                                        style={{ width: '100px', height: 'auto' }}
                                    />
                                ) : (
                                    'Sin foto'
                                )}
                            </td>
                            <td>
                                <button
                                    className="btn btn-primary mx-1"
                                    onClick={() => navigate(`/beneficiarios/view/${b.cedula}`)}
                                >
                                    Ver
                                </button>
                                <button
                                    className="btn btn-outline-primary mx-1"
                                    onClick={() => navigate(`/beneficiarios/edit/${b.cedula}`)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-info mx-1"
                                    onClick={() => navigate(`/beneficiarios/${b.cedula}/observaciones`)}
                                >
                                    Observaciones
                                </button>
                                <button
                                    className="btn btn-warning mx-1"
                                    onClick={() => navigate(`/beneficiarios/${b.cedula}/salud`)}
                                >
                                    Salud
                                </button>
                                <button
                                    className="btn btn-success mx-1"
                                    onClick={() => navigate(`/beneficiarios/${b.cedula}/economico`)}
                                >
                                    Económico
                                </button>
                                <button
                                    className="btn btn-secondary mx-1"
                                    onClick={() => navigate(`/beneficiarios/${b.cedula}/expedientes`)}
                                >
                                    Expedientes
                                </button>
                                <button
                                    className="btn btn-dark mx-1"
                                    onClick={() => navigate(`/beneficiarios/${b.cedula}/historias`)}
                                >
                                    Historias Médicas
                                </button>
                                <button
                                    className="btn btn-danger mx-1"
                                    onClick={() => confirmDelete(b.cedula)}
                                >
                                    Borrar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}