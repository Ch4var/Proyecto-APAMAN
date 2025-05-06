import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function FormularioEconomicoBeneficiario() {
    const { id: cedula } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        pensionRnc: false,
        montoPensionRnc: '',
        pensionIvm: false,
        montoPensionIvm: '',
        pensionOtro: false,
        montoPensionOtro: '',
        aporteFamiliar: false,
        montoAporteFamiliar: '',
        ingresosPropios: false,
        montoIngresosPropios: '',
        aporteHogar: false,
        montoAporteHogar: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Carga inicial del formulario si existe
    useEffect(() => {
        if (!cedula) {
            setError('No se pudo obtener la cédula.');
            return;
        }
        (async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:8080/beneficiarios/${cedula}/economico`
                );
                setForm({
                    pensionRnc: !!data.pensionRnc,
                    montoPensionRnc: data.montoPensionRnc ?? '',
                    pensionIvm: !!data.pensionIvm,
                    montoPensionIvm: data.montoPensionIvm ?? '',
                    pensionOtro: !!data.pensionOtro,
                    montoPensionOtro: data.montoPensionOtro ?? '',
                    aporteFamiliar: !!data.aporteFamiliar,
                    montoAporteFamiliar: data.montoAporteFamiliar ?? '',
                    ingresosPropios: !!data.ingresosPropios,
                    montoIngresosPropios: data.montoIngresosPropios ?? '',
                    aporteHogar: !!data.aporteHogar,
                    montoAporteHogar: data.montoAporteHogar ?? '',
                });
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Error cargando el formulario económico.');
            }
        })();
    }, [cedula]);

    const handleChange = e => {
        const { name, type, checked, value } = e.target;
        setForm(f => ({
            ...f,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post(
                `http://localhost:8080/beneficiarios/${cedula}/economico`,
                form
            );
            setSuccess('Formulario económico guardado.');
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al guardar el formulario económico.');
            setSuccess(null);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('¿Eliminar este formulario económico?')) return;
        try {
            await axios.delete(
                `http://localhost:8080/beneficiarios/${cedula}/economico`
            );
            setSuccess('Formulario económico eliminado.');
            setForm({
                pensionRnc: false,
                montoPensionRnc: '',
                pensionIvm: false,
                montoPensionIvm: '',
                pensionOtro: false,
                montoPensionOtro: '',
                aporteFamiliar: false,
                montoAporteFamiliar: '',
                ingresosPropios: false,
                montoIngresosPropios: '',
                aporteHogar: false,
                montoAporteHogar: '',
            });
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al eliminar el formulario económico.');
            setSuccess(null);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Formulario Económico — Beneficiario {cedula}</h2>
                <button className="btn btn-secondary" onClick={() => navigate('/beneficiarios')}>
                    Volver
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
                {/* Pensión RNC */}
                <div className="form-check mb-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="pensionRnc"
                        checked={form.pensionRnc}
                        onChange={handleChange}
                    />
                    <label className="form-check-label">Pensión RNC</label>
                </div>
                {form.pensionRnc && (
                    <div className="mb-3">
                        <label>Monto Pensión RNC</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            name="montoPensionRnc"
                            value={form.montoPensionRnc}
                            onChange={handleChange}
                        />
                    </div>
                )}

                {/* Pensión IVM */}
                <div className="form-check mb-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="pensionIvm"
                        checked={form.pensionIvm}
                        onChange={handleChange}
                    />
                    <label className="form-check-label">Pensión IVM</label>
                </div>
                {form.pensionIvm && (
                    <div className="mb-3">
                        <label>Monto Pensión IVM</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            name="montoPensionIvm"
                            value={form.montoPensionIvm}
                            onChange={handleChange}
                        />
                    </div>
                )}

                {/* Otra pensión */}
                <div className="form-check mb-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="pensionOtro"
                        checked={form.pensionOtro}
                        onChange={handleChange}
                    />
                    <label className="form-check-label">Otro tipo de pensión mensual</label>
                </div>
                {form.pensionOtro && (
                    <div className="mb-3">
                        <label>Monto Otra Pensión</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            name="montoPensionOtro"
                            value={form.montoPensionOtro}
                            onChange={handleChange}
                        />
                    </div>
                )}

                {/* Aporte familiar */}
                <div className="form-check mb-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="aporteFamiliar"
                        checked={form.aporteFamiliar}
                        onChange={handleChange}
                    />
                    <label className="form-check-label">Aporte familiar mensual</label>
                </div>
                {form.aporteFamiliar && (
                    <div className="mb-3">
                        <label>Monto Aporte Familiar</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            name="montoAporteFamiliar"
                            value={form.montoAporteFamiliar}
                            onChange={handleChange}
                        />
                    </div>
                )}

                {/* Ingresos propios */}
                <div className="form-check mb-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="ingresosPropios"
                        checked={form.ingresosPropios}
                        onChange={handleChange}
                    />
                    <label className="form-check-label">Ingresos propios mensuales</label>
                </div>
                {form.ingresosPropios && (
                    <div className="mb-3">
                        <label>Monto Ingresos Propios</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            name="montoIngresosPropios"
                            value={form.montoIngresosPropios}
                            onChange={handleChange}
                        />
                    </div>
                )}

                {/* Aporte al hogar */}
                <div className="form-check mb-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="aporteHogar"
                        checked={form.aporteHogar}
                        onChange={handleChange}
                    />
                    <label className="form-check-label">Aporte mensual al Hogar de Larga Estancia</label>
                </div>
                {form.aporteHogar && (
                    <div className="mb-3">
                        <label>Monto Aporte Hogar</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            name="montoAporteHogar"
                            value={form.montoAporteHogar}
                            onChange={handleChange}
                        />
                    </div>
                )}

                <button type="submit" className="btn btn-primary me-2">
                    Guardar
                </button>
                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleDelete}
                >
                    Eliminar formulario
                </button>
            </form>
        </div>
    );
}