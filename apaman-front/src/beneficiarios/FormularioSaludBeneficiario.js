import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function FormularioSaludBeneficiario() {
    const { id: cedula } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        limitacion: 'Ninguna',
        padecimientos: '',
        lugaresAtencion: '',
        reconoceMedicamentos: false,
        medicamentos: '',
        tieneDieta: false,
        dieta: '',
        utilizaOrtopedicos: false,
        ortopedicos: '',
        utilizaAnteojos: false,
        utilizaAudifonos: false,
        otro: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (!cedula) {
            setError('No se pudo obtener la cédula.');
            return;
        }
        (async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:8080/beneficiarios/${cedula}/salud`
                );

                setForm({
                    limitacion: data.limitacion ?? 'Ninguna',
                    padecimientos: data.padecimientos ?? '',
                    lugaresAtencion: data.lugaresAtencion ?? '',
                    reconoceMedicamentos: data.reconoceMedicamentos ?? false,
                    medicamentos: data.medicamentos ?? '',
                    tieneDieta: data.tieneDieta ?? false,
                    dieta: data.dieta ?? '',
                    utilizaOrtopedicos: data.utilizaOrtopedicos ?? false,
                    ortopedicos: data.ortopedicos ?? '',
                    utilizaAnteojos: data.utilizaAnteojos ?? false,
                    utilizaAudifonos: data.utilizaAudifonos ?? false,
                    otro: data.otro ?? ''
                });
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Error cargando el formulario de salud.');
            }
        })();
    }, [cedula]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({
            ...f,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `http://localhost:8080/beneficiarios/${cedula}/salud`,
                form
            );
            setSuccess('Formulario guardado correctamente.');
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al guardar el formulario.');
            setSuccess(null);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('¿Eliminar por completo el formulario de salud?')) return;
        try {
            await axios.delete(
                `http://localhost:8080/beneficiarios/${cedula}/salud`
            );
            setSuccess('Formulario eliminado.');
            setForm({
                limitacion: 'Ninguna',
                padecimientos: '',
                lugaresAtencion: '',
                reconoceMedicamentos: false,
                medicamentos: '',
                tieneDieta: false,
                dieta: '',
                utilizaOrtopedicos: false,
                ortopedicos: '',
                utilizaAnteojos: false,
                utilizaAudifonos: false,
                otro: ''
            });
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al eliminar el formulario.');
            setSuccess(null);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Formulario de Salud — Beneficiario {cedula}</h2>
                <button className="btn btn-secondary" onClick={() => navigate('/beneficiarios')}>
                    Volver
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Presenta alguna limitación</label>
                    <select
                        className="form-select"
                        name="limitacion"
                        value={form.limitacion}
                        onChange={handleChange}
                    >
                        <option>Física</option>
                        <option>Mental</option>
                        <option>Ninguna</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Principales padecimientos</label>
                    <textarea
                        className="form-control"
                        name="padecimientos"
                        value={form.padecimientos}
                        onChange={handleChange}
                        rows={2}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Lugares de atención médica</label>
                    <textarea
                        className="form-control"
                        name="lugaresAtencion"
                        value={form.lugaresAtencion}
                        onChange={handleChange}
                        rows={2}
                    />
                </div>

                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="reconoceMedicamentos"
                        checked={form.reconoceMedicamentos}
                        onChange={handleChange}
                    />
                    <label className="form-check-label">
                        Reconoce los medicamentos que utiliza
                    </label>
                </div>

                {form.reconoceMedicamentos && (
                    <div className="mb-3">
                        <label className="form-label">Medicamentos que utiliza</label>
                        <textarea
                            className="form-control"
                            name="medicamentos"
                            value={form.medicamentos}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div>
                )}

                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="tieneDieta"
                        checked={form.tieneDieta}
                        onChange={handleChange}
                    />
                    <label className="form-check-label">Tiene dieta recomendada</label>
                </div>

                {form.tieneDieta && (
                    <div className="mb-3">
                        <label className="form-label">¿Cuál es la dieta?</label>
                        <textarea
                            className="form-control"
                            name="dieta"
                            value={form.dieta}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div>
                )}

                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="utilizaOrtopedicos"
                        checked={form.utilizaOrtopedicos}
                        onChange={handleChange}
                    />
                    <label className="form-check-label">Utiliza aparatos ortopédicos</label>
                </div>

                {form.utilizaOrtopedicos && (
                    <div className="mb-3">
                        <label className="form-label">
                            Aparatos ortopédicos que utiliza
                        </label>
                        <textarea
                            className="form-control"
                            name="ortopedicos"
                            value={form.ortopedicos}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div>
                )}

                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="utilizaAnteojos"
                        checked={form.utilizaAnteojos}
                        onChange={handleChange}
                    />
                    <label className="form-check-label">Utiliza anteojos</label>
                </div>

                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="utilizaAudifonos"
                        checked={form.utilizaAudifonos}
                        onChange={handleChange}
                    />
                    <label className="form-check-label">Utiliza audífonos</label>
                </div>

                <div className="mb-3">
                    <label className="form-label">Otro (anote)</label>
                    <textarea
                        className="form-control"
                        name="otro"
                        value={form.otro}
                        onChange={handleChange}
                        rows={2}
                    />
                </div>

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