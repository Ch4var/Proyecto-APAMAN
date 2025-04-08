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

    const [foto, setFoto] = useState(null);

    const handleChange = (e) => {
        setBeneficiario({
            ...beneficiario,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setFoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const regexSoloNumeros = /^\d+$/;
        const regexSoloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        const regexLetrasNumeros = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]+$/;
        const regexTelefono = /^[0-9\-\+\(\)\s]+$/;

        if (!beneficiario.cedula || !regexSoloNumeros.test(beneficiario.cedula)) {
            alert("La cédula debe contener solo números y no estar vacía.");
            return;
        }

        if (!beneficiario.nombre || !regexSoloLetras.test(beneficiario.nombre)) {
            alert("El nombre debe contener solo letras y no estar vacío.");
            return;
        }

        if (!beneficiario.sexo) {
            alert("Debe seleccionar una opción válida para Sexo.");
            return;
        }

        if (!beneficiario.religion || !regexSoloLetras.test(beneficiario.religion)) {
            alert("La religión debe contener solo letras y no estar vacía.");
            return;
        }

        if (!beneficiario.gradoEscolaridad || !regexLetrasNumeros.test(beneficiario.gradoEscolaridad)) {
            alert("La escolaridad debe contener una combinación de números y letras y no estar vacía.");
            return;
        }

        if (!["DEPENDIENTE", "MODERADAMENTE_DEPENDIENTE", "INDEPENDIENTE"].includes(beneficiario.estadoDependencia)) {
            alert("En dependencia se debe elegir entre DEPENDIENTE, MODERADAMENTE_DEPENDIENTE o INDEPENDIENTE.");
            return;
        }

        if (!["ACTIVO", "INACTIVO"].includes(beneficiario.estado)) {
            alert("El estado debe ser ACTIVO o INACTIVO.");
            return;
        }

        if (!beneficiario.infoContacto) {
            alert("La información de contacto no puede estar vacía.");
            return;
        }

        if (!beneficiario.personaResponsable || !regexSoloLetras.test(beneficiario.personaResponsable)) {
            alert("El responsable debe contener solo letras y no estar vacío.");
            return;
        }

        if (!beneficiario.telefonoResponsable || !regexTelefono.test(beneficiario.telefonoResponsable)) {
            alert("El teléfono del responsable debe contener solo números o caracteres especiales y no estar vacío.");
            return;
        }

        if (!beneficiario.direccionResponsable) {
            alert("La dirección del responsable no puede estar vacía.");
            return;
        }

        if (!["JPS", "CONAPAM", "Otro"].includes(beneficiario.infoFinanciera)) {
            alert("La información financiera debe ser JPS, CONAPAM u Otro.");
            return;
        }

        if (!["No", "IVM", "RNC"].includes(beneficiario.pensionado)) {
            alert("Pensionado debe ser No, IVM o RNC.");
            return;
        }

        const formData = new FormData();
        for (const key in beneficiario) {
            formData.append(key, beneficiario[key]);
        }
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
                        <select
                            className="form-control"
                            name="estadoDependencia"
                            value={beneficiario.estadoDependencia}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione</option>
                            <option value="DEPENDIENTE">DEPENDIENTE</option>
                            <option value="MODERADAMENTE_DEPENDIENTE">MODERADAMENTE_DEPENDIENTE</option>
                            <option value="INDEPENDIENTE">INDEPENDIENTE</option>
                        </select>
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
                        <select
                            className="form-control"
                            name="estado"
                            value={beneficiario.estado}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione</option>
                            <option value="ACTIVO">ACTIVO</option>
                            <option value="INACTIVO">INACTIVO</option>
                        </select>
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
                        <select
                            className="form-control"
                            name="infoFinanciera"
                            value={beneficiario.infoFinanciera}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione</option>
                            <option value="JPS">JPS</option>
                            <option value="CONAPAM">CONAPAM</option>
                            <option value="Otro">Otro</option>
                        </select>
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
                            <option value="No">No</option>
                            <option value="IVM">IVM</option>
                            <option value="RNC">RNC</option>
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