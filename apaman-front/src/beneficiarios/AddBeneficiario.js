import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddBeneficiario() {
    const navigate = useNavigate();

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

    // Estado para el archivo de la foto
    const [foto, setFoto] = useState(null);

    const handleChange = (e) => {
        setBeneficiario({
            ...beneficiario,
            [e.target.name]: e.target.value
        });
    };

    // Para manejar el input file
    const handleFileChange = (e) => {
        setFoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Creamos un objeto FormData para enviar datos como multipart/form-data
        const formData = new FormData();
        for (const key in beneficiario) {
            formData.append(key, beneficiario[key]);
        }
        // Se envía el archivo con el nombre "fotoFile" para que coincida con el backend
        if (foto) {
            formData.append("fotoFile", foto);
        }
        try {
            await axios.post("http://localhost:8080/agregarBeneficiario", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            navigate("/beneficiaries");
        } catch (error) {
            console.error("Error al agregar beneficiario", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Agregar Beneficiario</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    {/* Cédula */}
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
                    {/* Nombre */}
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
                    {/* Sexo */}
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
                    {/* Fecha de Nacimiento */}
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
                    {/* Religión */}
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
                    {/* Escolaridad */}
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
                    {/* Dependencia */}
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
                    {/* Fecha de Ingreso */}
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
                    {/* Estado */}
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
                    {/* Información de Contacto */}
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
                    {/* Persona Responsable */}
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
                    {/* Teléfono Responsable */}
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
                    {/* Dirección Responsable */}
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
                    {/* Información Financiera */}
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
                    {/* Pensionado */}
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
                    {/* Presupuesto */}
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
                    {/* Observaciones */}
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
                    {/* Campo para subir la foto */}
                    <div className="col-md-12 mb-3">
                        <label>Foto</label>
                        <input
                            type="file"
                            className="form-control"
                            name="fotoFile"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">
                    Guardar
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