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
        let query = '';
        if (cedula.trim()) {
            query = `cedula=${cedula}`;
        } else if (nombre.trim()) {
            query = `nombre=${nombre}`;
        }

        try {
            const res = await axios.get(`http://localhost:8080/Beneficiarios/search?${query}`);
            setBeneficiarios(res.data);
            setSearched(true);
        } catch (error) {
            console.error("Error al buscar beneficiarios", error);
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

    return (
        <div className="container mt-4">
            <h2>Buscar Beneficiario</h2>

            <div className="form-group mt-3">
                <label>Cédula:</label>
                <input
                    type="text"
                    className="form-control"
                    value={cedula}
                    onChange={handleCedulaChange}
                    disabled={nombre.length > 0}
                />
            </div>

            <div className="form-group mt-3">
                <label>Nombre:</label>
                <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={handleNombreChange}
                    disabled={cedula.length > 0}
                />
            </div>

            <button className="btn btn-primary mt-3" onClick={handleSearch}>
                Buscar
            </button>

            {/* Se muestra la tabla de resultados solo si se encontraron beneficiarios */}
            {beneficiarios.length > 0 && (
                <div className="mt-4">
                    <h4>Resultados de búsqueda:</h4>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Cédula</th>
                                <th>Nombre</th>
                                <th>Sexo</th>
                                <th>Fecha Nacimiento</th>
                                <th>Edad</th>
                                <th>Religión</th>
                                <th>Escolaridad</th>
                                <th>Dependencia</th>
                                <th>Ingreso</th>
                                <th>Estado</th>
                                <th>Contacto</th>
                                <th>Responsable</th>
                                <th>Tel. Responsable</th>
                                <th>Dirección Responsable</th>
                                <th>Info Financiera</th>
                                <th>Pensionado</th>
                                <th>Presupuesto</th>
                                <th>Observaciones</th>
                                <th>Foto</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {beneficiarios.map((b, index) => (
                                <tr key={b.cedula}>
                                    <td>{index + 1}</td>
                                    <td>{b.cedula}</td>
                                    <td>{b.nombre}</td>
                                    <td>{b.sexo}</td>
                                    <td>{b.fechaNacimiento}</td>
                                    <td>{b.edad}</td>
                                    <td>{b.religion}</td>
                                    <td>{b.gradoEscolaridad}</td>
                                    <td>{b.estadoDependencia}</td>
                                    <td>{b.fechaIngreso}</td>
                                    <td>{b.estado}</td>
                                    <td>{b.infoContacto}</td>
                                    <td>{b.personaResponsable}</td>
                                    <td>{b.telefonoResponsable}</td>
                                    <td>{b.direccionResponsable}</td>
                                    <td>{b.infoFinanciera}</td>
                                    <td>{b.pensionado}</td>
                                    <td>{b.presupuesto}</td>
                                    <td>{b.observaciones}</td>
                                    <td>
                                        {b.foto ? (
                                            <img
                                                src={`data:image/jpeg;base64,${b.foto}`}
                                                alt="Foto del beneficiario"
                                                style={{ width: '100px', height: 'auto' }}
                                            />
                                        ) : (
                                            "Sin foto"
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-primary mx-2"
                                            onClick={() => navigate(`/beneficiaries/view/${b.cedula}`)}
                                        >
                                            Ver
                                        </button>
                                        <button
                                            className="btn btn-outline-primary mx-2"
                                            onClick={() => navigate(`/beneficiaries/edit/${b.cedula}`)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger mx-2"
                                            onClick={async () => {
                                                try {
                                                    await axios.delete(`http://localhost:8080/Beneficiario/${b.cedula}`);
                                                    setBeneficiarios(beneficiarios.filter((ben) => ben.cedula !== b.cedula));
                                                } catch (err) {
                                                    console.error("Error al borrar beneficiario", err);
                                                }
                                            }}
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
            )}

            {searched && beneficiarios.length === 0 && (
                <div className="mt-4">
                    <h4>No se encontraron coincidencias</h4>
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
