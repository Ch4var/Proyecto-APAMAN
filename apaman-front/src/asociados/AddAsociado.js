import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Alta de Asociado + Acta (y hasta dos referentes).
 */
export default function AddAsociado() {
    const navigate = useNavigate();

    /*─────────────── state ───────────────*/
    const [asociado, setAsociado] = useState({
        cedula: '',
        nombre: '',
        apellido1: '',
        apellido2: '',
        sexo: '',
        fechaNacimiento: '',
        cuotaMensual: '',
        correo: '',
        telefono: '',
        direccion: ''
    });

    const [acta, setActa] = useState({
        fechaSolicitud: '',
        fechaAprobacion: '',
        numActa: '',
        numAcuerdo: ''
    });

    const [referentes, setReferentes] = useState({ ref1: '', ref2: '' });

    /*─────────────── utils ───────────────*/
    const normalizeDate = (val, prev) => {
        const digits = val.replace(/\D/g, '');
        const prevDigits = prev.replace(/\D/g, '');
        let t = digits.slice(0, 8);
        if (prevDigits.length === 8 && digits.length > 8) {
            t = prevDigits.slice(0, 7) + digits.slice(-1);
        }
        if (t.length > 4) return `${t.slice(0,2)}/${t.slice(2,4)}/${t.slice(4)}`;
        if (t.length > 2) return `${t.slice(0,2)}/${t.slice(2)}`;
        return t;
    };

    /*─────────────── handlers ───────────────*/
    const handleAsociadoChange = (e) => {
        const { name, value } = e.target;
        if (name === 'fechaNacimiento') {
            const fmt = normalizeDate(value, asociado.fechaNacimiento);
            setAsociado(p => ({ ...p, fechaNacimiento: fmt }));
            return;
        }
        setAsociado(p => ({ ...p, [name]: value }));
    };

    const handleActaChange = (e) => {
        const { name, value } = e.target;
        if (name === 'fechaSolicitud' || name === 'fechaAprobacion') {
            const fmt = normalizeDate(value, acta[name]);
            setActa(p => ({ ...p, [name]: fmt }));
            return;
        }
        setActa(p => ({ ...p, [name]: value }));
    };

    const handleReferenteChange = (e) => {
        const { name, value } = e.target;
        setReferentes(p => ({ ...p, [name]: value }));
    };

    /*─────────────── validación ───────────────*/
    const validate = () => {
        const nums    = /^\d+$/;
        const letters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        const mail    = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

        if (!nums.test(asociado.cedula))                                                                 return 'Cédula numérica';
        if (![asociado.nombre, asociado.apellido1, asociado.apellido2].every(s => letters.test(s)))       return 'Nombres solo letras';
        if (asociado.fechaNacimiento.length !== 10)                                                        return 'Fecha de nacimiento incompleta';
        if (!mail.test(asociado.correo))                                                                   return 'Correo inválido';
        if (isNaN(+asociado.cuotaMensual) || isNaN(+asociado.mesesAdeudo) || isNaN(+asociado.cantidadAdeudo))
            return 'Montos numéricos inválidos';
        if (acta.fechaSolicitud.length !== 10)                                                             return 'Fecha de solicitud incompleta';
        if (acta.fechaAprobacion.length !== 10)                                                            return 'Fecha de aprobación incompleta';
        if (!acta.numActa || !nums.test(acta.numActa))                                                     return 'Número de acta inválido';
        if (!acta.numAcuerdo || !nums.test(acta.numAcuerdo))                                               return 'Número de acuerdo inválido';
        return null;
    };

    /*─────────────── submit ───────────────*/
    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) return alert(err);

        // El DTO unificado espera:
        // { ...asociado fields..., fechaSolicitud, fechaAprobacion, numActa, numAcuerdo }
        const payload = {
            ...asociado,
            ...acta
        };

        try {
            await axios.post('http://localhost:8080/asociados', payload);

            if (referentes.ref1)
                await axios.post(
                    `http://localhost:8080/asociados/${asociado.cedula}/referentes/${referentes.ref1}`
                );
            if (referentes.ref2 && referentes.ref2 !== referentes.ref1)
                await axios.post(
                    `http://localhost:8080/asociados/${asociado.cedula}/referentes/${referentes.ref2}`
                );

            alert('Asociado creado');
            navigate('/asociados');
        } catch (e2) {
            console.error(e2);
            alert(e2.response?.data?.message || 'Error al crear');
        }
    };

    /*─────────────── render ───────────────*/
    return (
        <div className="container mt-4">
            <h2>Agregar Asociado</h2>
            <form onSubmit={handleSubmit}>

                {/* Datos personales */}
                <h4 className="mt-3">Datos personales</h4>
                <div className="row g-3">
                    <div className="col-md-3">
                        <label>Cédula</label>
                        <input
                            name="cedula"
                            className="form-control"
                            value={asociado.cedula}
                            onChange={handleAsociadoChange}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <label>Nombre</label>
                        <input
                            name="nombre"
                            className="form-control"
                            value={asociado.nombre}
                            onChange={handleAsociadoChange}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <label>Apellido 1</label>
                        <input
                            name="apellido1"
                            className="form-control"
                            value={asociado.apellido1}
                            onChange={handleAsociadoChange}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <label>Apellido 2</label>
                        <input
                            name="apellido2"
                            className="form-control"
                            value={asociado.apellido2}
                            onChange={handleAsociadoChange}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <label>Sexo</label>
                        <select
                            name="sexo"
                            className="form-control"
                            value={asociado.sexo}
                            onChange={handleAsociadoChange}
                            required
                        >
                            <option value="">Seleccione</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label>Fecha Nac.</label>
                        <input
                            name="fechaNacimiento"
                            placeholder="dd/mm/yyyy"
                            maxLength="10"
                            className="form-control"
                            value={asociado.fechaNacimiento}
                            onChange={handleAsociadoChange}
                            required
                        />
                    </div>
                </div>

                {/* Informacion de contacto */}
                <h4 className="mt-3">Información de contacto</h4>
                <div className="row g-3">
                    <div className="col-md-3">
                        <label>Teléfono</label>
                        <input
                            name="telefono"
                            className="form-control"
                            value={asociado.telefono}
                            onChange={handleAsociadoChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <label>Correo</label>
                        <input
                            type="email"
                            name="correo"
                            className="form-control"
                            value={asociado.correo}
                            onChange={handleAsociadoChange}
                            required
                        />
                    </div>
                    <div className="col-md-12">
                        <label>Dirección</label>
                        <input
                            name="direccion"
                            className="form-control"
                            value={asociado.direccion}
                            onChange={handleAsociadoChange}
                        />
                    </div>
                </div>

                {/* Datos de asociado */}
                <h4 className="mt-4">Datos de asociado</h4>
                <div className="row g-3">
                    <div className="col-md-3">
                        <label>Fecha Solicitud</label>
                        <input
                            name="fechaSolicitud"
                            placeholder="dd/mm/yyyy"
                            maxLength="10"
                            className="form-control"
                            value={acta.fechaSolicitud}
                            onChange={handleActaChange}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <label>Fecha Aprobación</label>
                        <input
                            name="fechaAprobacion"
                            placeholder="dd/mm/yyyy"
                            maxLength="10"
                            className="form-control"
                            value={acta.fechaAprobacion}
                            onChange={handleActaChange}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <label>Cuota Mensual (¢)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="cuotaMensual"
                            className="form-control"
                            value={asociado.cuotaMensual}
                            onChange={handleAsociadoChange}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <label>Número Acta</label>
                        <input
                            name="numActa"
                            className="form-control"
                            value={acta.numActa}
                            onChange={handleActaChange}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <label>Número Acuerdo</label>
                        <input
                            name="numAcuerdo"
                            className="form-control"
                            value={acta.numAcuerdo}
                            onChange={handleActaChange}
                            required
                        />
                    </div>
                </div>

                {/* Referentes */}
                <h4 className="mt-4">Referentes Asociado</h4>
                <div className="row g-3 mb-4">
                    <div className="col-md-6">
                        <label>Cédula Referente 1</label>
                        <input
                            name="ref1"
                            className="form-control"
                            value={referentes.ref1}
                            onChange={handleReferenteChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label>Cédula Referente 2</label>
                        <input
                            name="ref2"
                            className="form-control"
                            value={referentes.ref2}
                            onChange={handleReferenteChange}
                        />
                    </div>
                </div>

                {/* botones */}
                <button type="submit" className="btn btn-primary me-2">
                    Guardar
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/asociados')}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
}
