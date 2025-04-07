import React, { useEffect, useState } from 'react';
import axios from "axios";

export default function Beneficiarios() {
    const [beneficiarios, setBeneficiarios] = useState([]);

    useEffect(() => {
        loadBeneficiarios();
    }, []);

    const loadBeneficiarios = async () => {
        try {
            const result = await axios.get("http://localhost:8080/Beneficiarios");
            setBeneficiarios(result.data);
            console.log(result.data);
        } catch (error) {
            console.error("Error cargando beneficiarios", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Beneficiarios</h2>
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
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}