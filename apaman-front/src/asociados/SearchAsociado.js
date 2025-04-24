import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SearchAsociado() {
    const [cedula, setCedula] = useState('');
    const [nombre, setNombre] = useState('');
    const [asociados, setAsociados] = useState([]);
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async () => {
        try {
            const params = {};
            if (cedula.trim()) {
                params.cedula = cedula.trim();
            } else if (nombre.trim()) {
                params.nombre = nombre.trim();
            }

            const res = await axios.get(
                'http://localhost:8080/asociados/search',
                { params }
            );
            setAsociados(res.data);
            setSearched(true);
        } catch (error) {
            console.error('Error al buscar asociados', error);
            alert('Ocurrió un error al buscar asociados.');
        }
    };

    const handleCedulaChange = (e) => {
        setCedula(e.target.value);
        if (e.target.value) setNombre('');
    };

    const handleNombreChange = (e) => {
        setNombre(e.target.value);
        if (e.target.value) setCedula('');
    };

    const deleteAsociado = async (cedulaToDelete) => {
        if (!window.confirm('¿Está seguro de que desea eliminar este asociado?')) return;
        try {
            await axios.delete(`http://localhost:8080/asociados/${cedulaToDelete}`);
            setAsociados(prev => prev.filter(a => a.cedula !== cedulaToDelete));
        } catch (err) {
            console.error('Error al borrar asociado', err);
            alert('No se pudo eliminar el asociado.');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Buscar Asociado</h2>

            <div className="row mt-3">
                <div className="col-md-6">
                    <label className="form-label">Cédula:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={cedula}
                        onChange={handleCedulaChange}
                        disabled={nombre.length > 0}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Nombre:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nombre}
                        onChange={handleNombreChange}
                        disabled={cedula.length > 0}
                    />
                </div>
            </div>

            <button className="btn btn-primary mt-3" onClick={handleSearch}>
                Buscar
            </button>

            {searched && asociados.length === 0 && (
                <div className="mt-4">
                    <h4>No se encontraron coincidencias</h4>
                </div>
            )}

            {asociados.length > 0 && (
                <div className="mt-4 table-responsive">
                    <h4>Resultados de búsqueda:</h4>
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Cédula</th>
                                <th>Nombre Completo</th>
                                <th>Sexo</th>
                                <th>Fecha Nac.</th>
                                <th>Edad</th>
                                <th>Estado</th>
                                <th>Fecha Asociación</th>
                                <th>Cuota Mensual</th>
                                <th>Morosidad</th>
                                <th>Meses Adeudo</th>
                                <th>Cantidad Adeudo</th>
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
                                    <td>{a.fechaNacimiento?.split('T')[0] || ''}</td>
                                    <td>{a.edad}</td>
                                    <td>{a.estado ? 'Activo' : 'Inactivo'}</td>
                                    <td>{a.fechaAsociacion?.split('T')[0] || ''}</td>
                                    <td>{a.cuotaMensual}</td>
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
                                            onClick={() => deleteAsociado(a.cedula)}
                                        >
                                            Borrar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-3">
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Volver
                </button>
            </div>
        </div>
    );
}
