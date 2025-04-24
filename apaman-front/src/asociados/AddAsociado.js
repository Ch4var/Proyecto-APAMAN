import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddAsociado() {
    const navigate = useNavigate();

    const [asociado, setAsociado] = useState({
        cedula: "",
        nombre: "",
        apellido1: "",
        apellido2: "",
        sexo: "",
        fechaNacimiento: "",
        fechaAsociacion: "",
        numActa: "",
        numAcuerdo: "",
        cuotaMensual: "",
        estado: "true",           // true = Activo, false = Inactivo
        estadoMorosidad: "false", // true = Moroso, false = Al día
        correo: "",
        telefono: "",
        direccion: ""
    });

    const handleChange = (e) => {
        setAsociado({
            ...asociado,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones básicas
        const onlyNums = /^\d+$/;
        const onlyLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        const decimalRe = /^\d+(\.\d{1,2})?$/;

        if (!onlyNums.test(asociado.cedula)) {
            alert("Cédula inválida (solo números).");
            return;
        }
        if (!onlyLetters.test(asociado.nombre)
            || !onlyLetters.test(asociado.apellido1)
            || !onlyLetters.test(asociado.apellido2)) {
            alert("Nombre y apellidos deben contener solo letras.");
            return;
        }
        if (!["Masculino", "Femenina", "Otro"].includes(asociado.sexo)) {
            alert("Seleccione un Sexo válido.");
            return;
        }
        if (!asociado.fechaNacimiento) {
            alert("Fecha de nacimiento requerida.");
            return;
        }
        if (!asociado.fechaAsociacion) {
            alert("Fecha de asociación requerida.");
            return;
        }
        if (!asociado.numActa.trim()) {
            alert("Número de acta requerido.");
            return;
        }
        if (!asociado.numAcuerdo.trim()) {
            alert("Número de acuerdo requerido.");
            return;
        }
        if (!decimalRe.test(asociado.cuotaMensual)) {
            alert("Cuota mensual inválida (número con hasta 2 decimales).");
            return;
        }
        if (!["true", "false"].includes(asociado.estado)) {
            alert("Seleccione Estado Activo/Inactivo.");
            return;
        }
        if (!["true", "false"].includes(asociado.estadoMorosidad)) {
            alert("Seleccione Estado de morosidad.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(asociado.correo)) {
            alert("Correo inválido.");
            return;
        }
        if (!onlyNums.test(asociado.telefono)) {
            alert("Teléfono inválido (solo números).");
            return;
        }
        if (!asociado.direccion.trim()) {
            alert("Dirección requerida.");
            return;
        }

        try {
            await axios.post(
                "http://localhost:8080/api/asociados",
                {
                    ...asociado,
                    // convertir booleanos
                    estado: asociado.estado === "true",
                    estadoMorosidad: asociado.estadoMorosidad === "true",
                    cuotaMensual: parseFloat(asociado.cuotaMensual)
                }
            );
            navigate("/asociados");
        } catch (error) {
            console.error("Error al agregar asociado:", error);
            alert("Ocurrió un error al guardar el asociado.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Agregar Asociado</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    {/* Cédula */}
                    <div className="col-md-4 mb-3">
                        <label>Cédula</label>
                        <input
                            type="text"
                            className="form-control"
                            name="cedula"
                            value={asociado.cedula}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Nombre */}
                    <div className="col-md-4 mb-3">
                        <label>Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            value={asociado.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Apellidos */}
                    <div className="col-md-2 mb-3">
                        <label>Apellido 1</label>
                        <input
                            type="text"
                            className="form-control"
                            name="apellido1"
                            value={asociado.apellido1}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-2 mb-3">
                        <label>Apellido 2</label>
                        <input
                            type="text"
                            className="form-control"
                            name="apellido2"
                            value={asociado.apellido2}
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
                            value={asociado.sexo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenina">Femenina</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    {/* Fecha de nacimiento */}
                    <div className="col-md-4 mb-3">
                        <label>Fecha de Nacimiento</label>
                        <input
                            type="date"
                            className="form-control"
                            name="fechaNacimiento"
                            value={asociado.fechaNacimiento}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Fecha de asociación */}
                    <div className="col-md-4 mb-3">
                        <label>Fecha de Asociación</label>
                        <input
                            type="date"
                            className="form-control"
                            name="fechaAsociacion"
                            value={asociado.fechaAsociacion}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Acta y Acuerdo */}
                    <div className="col-md-6 mb-3">
                        <label>Número de Acta</label>
                        <input
                            type="text"
                            className="form-control"
                            name="numActa"
                            value={asociado.numActa}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Número de Acuerdo</label>
                        <input
                            type="text"
                            className="form-control"
                            name="numAcuerdo"
                            value={asociado.numAcuerdo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Cuota Mensual */}
                    <div className="col-md-4 mb-3">
                        <label>Cuota Mensual</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            name="cuotaMensual"
                            value={asociado.cuotaMensual}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Estado */}
                    <div className="col-md-4 mb-3">
                        <label>Estado</label>
                        <select
                            className="form-control"
                            name="estado"
                            value={asociado.estado}
                            onChange={handleChange}
                        >
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                        </select>
                    </div>
                    {/* Morosidad */}
                    <div className="col-md-4 mb-3">
                        <label>Estado Morosidad</label>
                        <select
                            className="form-control"
                            name="estadoMorosidad"
                            value={asociado.estadoMorosidad}
                            onChange={handleChange}
                        >
                            <option value="false">Al día</option>
                            <option value="true">Moroso</option>
                        </select>
                    </div>
                    {/* Contacto */}
                    <div className="col-md-4 mb-3">
                        <label>Correo</label>
                        <input
                            type="email"
                            className="form-control"
                            name="correo"
                            value={asociado.correo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label>Teléfono</label>
                        <input
                            type="text"
                            className="form-control"
                            name="telefono"
                            value={asociado.telefono}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label>Dirección</label>
                        <input
                            type="text"
                            className="form-control"
                            name="direccion"
                            value={asociado.direccion}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">
                    Guardar
                </button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate("/asociados")}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
}
