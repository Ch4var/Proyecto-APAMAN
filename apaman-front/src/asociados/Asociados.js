import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Asociados() {
    const [asociados, setAsociados] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadAsociados();
    }, []);

    const loadAsociados = async () => {
        try {
            const result = await axios.get('http://localhost:8080/api/asociados');
            setAsociados(result.data);
        } catch (error) {
            console.error('Error cargando asociados', error);
        }
    };

    const deleteAsociado = async (cedula) => {
        try {
            await axios.delete(`http://localhost:8080/api/asociados/${cedula}`);
            loadAsociados();
        } catch (error) {
            console.error('Error borrando asociado', error);
        }
    };

    const confirmDelete = (cedula) => {
        if (window.confirm('¿Está seguro de que desea eliminar este asociado?')) {
            deleteAsociado(cedula);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Lista de Asociados</h2>
                <div>
                    <button
                        className="btn btn-info mx-2"
                        onClick={() => navigate('/asociados/search')}
                    >
                        Buscar Asociado
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={() => navigate('/asociados/add')}
                    >
                        Agregar Asociado
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
                        <th>Fecha Asociación</th>
                        <th>Acta</th>
                        <th>Acuerdo</th>
                        <th>Cuota Mensual</th>
                        <th>Estado</th>
                        <th>Morosidad</th>
                        <th>Meses Adeudo</th>
                        <th>Cant. Adeudo</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {asociados.map((a, idx) => (
                        <tr key={a.cedula}>
                            <td>{idx + 1}</td>
                            <td>{a.cedula}</td>
                            <td>{`${a.nombre} ${a.apellido1} ${a.apellido2}`}</td>
                            <td>{a.sexo}</td>
                            <td>{a.fechaNacimiento}</td>
                            <td>{a.edad}</td>
                            <td>{a.fechaAsociacion}</td>
                            <td>{a.actaAsociado?.numActa}</td>
                            <td>{a.actaAsociado?.numAcuerdo}</td>
                            <td>{a.cuotaMensual}</td>
                            <td>{a.estado ? 'Activo' : 'Inactivo'}</td>
                            <td>{a.estadoMorosidad ? 'Moroso' : 'Al día'}</td>
                            <td>{a.mesesAdeudo}</td>
                            <td>{a.cantidadAdeudo}</td>
                            <td>{a.correo}</td>
                            <td>{a.telefono}</td>
                            <td>{a.direccion}</td>
                            <td>
                                <button
                                    className="btn btn-primary btn-sm mx-1"
                                    onClick={() => navigate(`/asociados/view/${a.cedula}`)}
                                >
                                    Ver
                                </button>
                                <button
                                    className="btn btn-outline-primary btn-sm mx-1"
                                    onClick={() => navigate(`/asociados/edit/${a.cedula}`)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-danger btn-sm mx-1"
                                    onClick={() => confirmDelete(a.cedula)}
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
