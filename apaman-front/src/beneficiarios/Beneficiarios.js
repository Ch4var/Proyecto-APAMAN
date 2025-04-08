import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Beneficiarios() {
    const [beneficiarios, setBeneficiarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadBeneficiarios();
    }, []);

    const loadBeneficiarios = async () => {
        try {
            const result = await axios.get("http://localhost:8080/Beneficiarios");
            setBeneficiarios(result.data);
        } catch (error) {
            console.error("Error cargando beneficiarios", error);
        }
    };

    const deleteBeneficiario = async (id) => {
        await axios.delete(`http://localhost:8080/Beneficiario/${id}`)
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Lista de Beneficiarios</h2>
                <button
                    className="btn btn-success"
                    onClick={() => navigate("/beneficiaries/add")}
                >
                    Agregar Beneficiario
                </button>
            </div>

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
                                        await deleteBeneficiario(b.cedula);
                                        loadBeneficiarios();
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
    );
}
