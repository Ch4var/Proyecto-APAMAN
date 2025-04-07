import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditBeneficiario() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [beneficiario, setBeneficiario] = useState({
        cedula: "",
        nombre: "",
        sexo: "",
        fechaNacimiento: "",
        religion: "",
        gradoEscolaridad: "",
        estadoDependencia: "",
        fechaIngreso: "",
        estado: "",
        infoContacto: "",
        personaResponsable: "",
        telefonoResponsable: "",
        direccionResponsable: "",
        infoFinanciera: "",
        pensionado: "",
        presupuesto: "",
        observaciones: ""
    });

    // Obtener datos del beneficiario al montar el componente
    useEffect(() => {
        axios.get(`http://localhost:8080/Beneficiario/${id}`)
            .then((response) => {
                setBeneficiario(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener beneficiario", error);
            });
    }, [id]);

    const handleChange = (e) => {
        setBeneficiario({
            ...beneficiario,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/Beneficiario/${id}`, beneficiario);
            navigate("/beneficiaries");
        } catch (error) {
            console.error("Error al editar beneficiario", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Editar Beneficiario</h2>
            <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Cédula</label>
                            <input
                                type="text"
                                className="form-control"
                                name="cedula"
                                value={beneficiario.cedula}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                value={beneficiario.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Sexo</label>
                            <select
                                className="form-control"
                                name="sexo"
                                value={beneficiario.sexo}
                                onChange={handleChange}
                            >
                                <option value="">Seleccione</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Fecha de Nacimiento</label>
                            <input
                                type="date"
                                className="form-control"
                                name="fechaNacimiento"
                                value={beneficiario.fechaNacimiento}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Religión</label>
                            <input
                                type="text"
                                className="form-control"
                                name="religion"
                                value={beneficiario.religion}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Escolaridad</label>
                            <input
                                type="text"
                                className="form-control"
                                name="gradoEscolaridad"
                                value={beneficiario.gradoEscolaridad}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Dependencia</label>
                            <input
                                type="text"
                                className="form-control"
                                name="estadoDependencia"
                                value={beneficiario.estadoDependencia}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Fecha de Ingreso</label>
                            <input
                                type="date"
                                className="form-control"
                                name="fechaIngreso"
                                value={beneficiario.fechaIngreso}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Estado</label>
                            <input
                                type="text"
                                className="form-control"
                                name="estado"
                                value={beneficiario.estado}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <label>Información de Contacto</label>
                            <input
                                type="text"
                                className="form-control"
                                name="infoContacto"
                                value={beneficiario.infoContacto}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Responsable</label>
                            <input
                                type="text"
                                className="form-control"
                                name="personaResponsable"
                                value={beneficiario.personaResponsable}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-3 mb-3">
                            <label>Teléfono Responsable</label>
                            <input
                                type="text"
                                className="form-control"
                                name="telefonoResponsable"
                                value={beneficiario.telefonoResponsable}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-3 mb-3">
                            <label>Dirección Responsable</label>
                            <input
                                type="text"
                                className="form-control"
                                name="direccionResponsable"
                                value={beneficiario.direccionResponsable}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Info Financiera</label>
                            <input
                                type="text"
                                className="form-control"
                                name="infoFinanciera"
                                value={beneficiario.infoFinanciera}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Pensionado</label>
                            <select
                                className="form-control"
                                name="pensionado"
                                value={beneficiario.pensionado}
                                onChange={handleChange}
                            >
                                <option value="">Seleccione</option>
                                <option value="Sí">Sí</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Presupuesto</label>
                            <input
                                type="number"
                                className="form-control"
                                name="presupuesto"
                                value={beneficiario.presupuesto}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <label>Observaciones</label>
                            <textarea
                                className="form-control"
                                name="observaciones"
                                rows="3"
                                value={beneficiario.observaciones}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                <button type="submit" className="btn btn-primary">
                    Guardar Cambios
                </button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate("/beneficiaries")}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
}
