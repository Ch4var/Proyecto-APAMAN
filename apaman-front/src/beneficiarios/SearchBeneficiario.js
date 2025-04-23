import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SearchBeneficiario() {
    const [cedula, setCedula] = useState('');
    const [nombre, setNombre] = useState('');
    const [beneficiarios, setBeneficiarios] = useState([]);
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async () => {
        try {
            const params = {};
            if (cedula.trim()) params.cedula = cedula;
            else if (nombre.trim()) params.nombre = nombre;

            const res = await axios.get(
                'http://localhost:8080/beneficiarios/search',
                { params }
            );
            setBeneficiarios(res.data);
            setSearched(true);
        } catch (error) {
            console.error('Error al buscar beneficiarios', error);
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

    const deleteBeneficiario = async (cedulaToDelete) => {
        if (!window.confirm('¿Está seguro de que desea eliminar este beneficiario?')) return;
        try {
            await axios.delete(`http://localhost:8080/beneficiarios/${cedulaToDelete}`);
            setBeneficiarios((prev) => prev.filter((b) => b.cedula !== cedulaToDelete));
        } catch (err) {
            console.error('Error al borrar beneficiario', err);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Buscar Beneficiario</h2>

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

            {searched && beneficiarios.length === 0 && (
                <div className="mt-4">
                    <h4>No se encontraron coincidencias</h4>
                </div>
            )}

            {beneficiarios.length > 0 && (
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
                                <td>{b.fondo?.tipo || 'N/A'}</td>
                                <td>{b.pension?.tipo || 'N/A'}</td>
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
                                        className="btn btn-primary btn-sm mx-1"
                                        onClick={() => navigate(`/beneficiarios/view/${b.cedula}`)}
                                    >
                                        Ver
                                    </button>
                                    <button
                                        className="btn btn-outline-primary btn-sm mx-1"
                                        onClick={() => navigate(`/beneficiarios/edit/${b.cedula}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm mx-1"
                                        onClick={() => deleteBeneficiario(b.cedula)}
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
