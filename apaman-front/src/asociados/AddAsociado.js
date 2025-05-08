import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Formulario de alta para un nuevo Asociado.
 * Nota: El backend espera un JSON plano (no multipart),
 *       por lo que no se gestiona carga de fotos en esta vista.
 */
export default function AddAsociado() {
    const navigate = useNavigate();

    /* ──────────────────── Estado del formulario ──────────────────── */
    const [asociado, setAsociado] = useState({
        cedula: '',
        nombre: '',
        apellido1: '',
        apellido2: '',
        sexo: '',
        fechaNacimiento: '',
        telefono: '',
        correo: '',
        fechaAsociacion: '',
        cuotaMensual: '',
        estado: true
    });

    /* ──────────────────── Manejadores ──────────────────── */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAsociado((prev) => ({ ...prev, [name]: value }));
    };

    /* ──────────────────── Validaciones básicas ──────────────────── */
    const validate = () => {
        const onlyNums = /^\d+$/;
        const onlyLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        const phoneRe = /^[0-9\-\+\(\)\s]+$/;
        const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

        if (!onlyNums.test(asociado.cedula)) return 'Cédula inválida (solo números)';
        if (!onlyLetters.test(asociado.nombre) || !onlyLetters.test(asociado.apellido1) || !onlyLetters.test(asociado.apellido2)) return 'Nombre y apellidos deben contener solo letras';
        if (!['Masculino', 'Femenina', 'Otro'].includes(asociado.sexo)) return 'Seleccione un sexo válido';
        if (!asociado.fechaNacimiento) return 'Fecha de nacimiento requerida';
        if (asociado.telefono && !phoneRe.test(asociado.telefono)) return 'Teléfono inválido';
        if (asociado.correo && !emailRe.test(asociado.correo)) return 'Correo electrónico inválido';
        if (!asociado.fechaAsociacion) return 'Fecha de asociación requerida';
        if (isNaN(parseFloat(asociado.cuotaMensual))) return 'Cuota mensual inválida';
        return null;
    };

    /* ──────────────────── Envío ──────────────────── */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errorMsg = validate();
        if (errorMsg) {
            alert(errorMsg);
            return;
        }

        try {
            await axios.post('http://localhost:8080/asociados', {
                ...asociado,
                estado: asociado.estado === 'true' || asociado.estado === true
            });
            navigate('/asociados');
        } catch (err) {
            console.error('Error al agregar asociado', err);
            const msg = err.response?.data?.message || 'Ocurrió un error al guardar el asociado';
            alert(msg);
        }
    };

    /* ──────────────────── Render ──────────────────── */
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
                    {/* Nombre y apellidos */}
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
                    <div className="col-md-3 mb-3">
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
                    <div className="col-md-3 mb-3">
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
                    {/* Teléfono */}
                    <div className="col-md-3 mb-3">
                        <label>Teléfono</label>
                        <input
                            type="text"
                            className="form-control"
                            name="telefono"
                            value={asociado.telefono}
                            onChange={handleChange}
                        />
                    </div>
                    {/* Correo */}
                    <div className="col-md-3 mb-3">
                        <label>Correo</label>
                        <input
                            type="email"
                            className="form-control"
                            name="correo"
                            value={asociado.correo}
                            onChange={handleChange}
                        />
                    </div>
                    {/* Fecha Asociación */}
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
                    {/* Cuota mensual */}
                    <div className="col-md-4 mb-3">
                        <label>Cuota Mensual (¢)</label>
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
                            <option value={true}>Activo</option>
                            <option value={false}>Inactivo</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Guardar</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/asociados')}>Cancelar</button>
            </form>
        </div>
    );
}
