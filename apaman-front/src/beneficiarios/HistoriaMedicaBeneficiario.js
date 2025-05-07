import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function HistoriaMedicaBeneficiario() {
    const { id: cedula } = useParams();
    const navigate = useNavigate();

    const [historias, setHistorias] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [newHistoria, setNewHistoria] = useState({
        nombrePersonalSalud: '',
        tipoTerapia: '',
        detalle: ''
    });
    const [editingId, setEditingId] = useState(null);

    const mediaInputs = useRef({});
    const [previews, setPreviews] = useState({});
    const [lightbox, setLightbox] = useState({ open: false, url: '' });

    useEffect(() => {
        if (!cedula) {
            setError('No se pudo obtener la cédula.');
            return;
        }
        cargarHistorias();
    }, [cedula]);

    const cargarHistorias = async () => {
        try {
            const { data } = await axios.get(
                `http://localhost:8080/beneficiarios/${cedula}/historia-medica`
            );
            setHistorias(data);
            setError(null);
        } catch {
            setError('Error cargando historias médicas.');
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setNewHistoria(h => ({ ...h, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const url = editingId == null
                ? `http://localhost:8080/beneficiarios/${cedula}/historia-medica`
                : `http://localhost:8080/beneficiarios/${cedula}/historia-medica/${editingId}`;
            const method = editingId == null ? 'post' : 'put';
            await axios[method](url, newHistoria);
            setSuccess(editingId == null ? 'Historia creada.' : 'Historia actualizada.');
            setEditingId(null);
            setNewHistoria({ nombrePersonalSalud: '', tipoTerapia: '', detalle: '' });
            cargarHistorias();
        } catch {
            setError('Error al guardar historia médica.');
        }
    };

    const startEdit = h => {
        setEditingId(h.id);
        setNewHistoria({
            nombrePersonalSalud: h.nombrePersonalSalud,
            tipoTerapia: h.tipoTerapia,
            detalle: h.detalle
        });
    };

    const handleDelete = async id => {
        if (!window.confirm('¿Eliminar esta historia?')) return;
        try {
            await axios.delete(
                `http://localhost:8080/beneficiarios/${cedula}/historia-medica/${id}`
            );
            setSuccess('Historia eliminada.');
            cargarHistorias();
        } catch {
            setError('Error borrando historia.');
        }
    };

    const handlePreviewChange = histId => {
        const file = mediaInputs.current[histId]?.files[0];
        if (!file) return setPreviews(p => ({ ...p, [histId]: null }));
        const url = URL.createObjectURL(file);
        const tipo = file.type.startsWith('video/') ? 'video' : 'foto';
        setPreviews(p => ({ ...p, [histId]: { url, tipo } }));
    };

    const handleMediaUpload = async (histId, tipo) => {
        const file = mediaInputs.current[histId]?.files[0];
        if (!file) return setError('Selecciona un archivo.');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tipo', tipo);
        try {
            await axios.post(
                `http://localhost:8080/beneficiarios/${cedula}/historia-medica/${histId}/media`,
                formData, { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setSuccess('Media subida.');
            mediaInputs.current[histId].value = null;
            setPreviews(p => ({ ...p, [histId]: null }));
            cargarHistorias();
        } catch {
            setError('Error al subir media.');
        }
    };

    const handleMediaDelete = async (histId, mediaId) => {
        if (!window.confirm('¿Eliminar este medio?')) return;
        try {
            await axios.delete(
                `http://localhost:8080/beneficiarios/${cedula}/historia-medica/${histId}/media/${mediaId}`
            );
            setSuccess('Media eliminada.');
            cargarHistorias();
        } catch {
            setError('Error al eliminar media.');
        }
    };

    return (
        <div className="container mt-4">
            {/* Lightbox overlay */}
            {lightbox.open && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.8)', display: 'flex',
                        justifyContent: 'center', alignItems: 'center', zIndex: 1050
                    }}
                    onClick={() => setLightbox({ open: false, url: '' })}
                >
                    <img src={lightbox.url} style={{ maxHeight: '90%', maxWidth: '90%' }} alt="" />
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Historias Médicas — Beneficiario {cedula}</h2>
                <button className="btn btn-secondary" onClick={() => navigate('/beneficiarios')}>
                    Volver
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    name="nombrePersonalSalud"
                    value={newHistoria.nombrePersonalSalud}
                    onChange={handleChange}
                    placeholder="Nombre personal de salud"
                    className="form-control mb-2"
                    required
                />
                <input
                    name="tipoTerapia"
                    value={newHistoria.tipoTerapia}
                    onChange={handleChange}
                    placeholder="Tipo de terapia"
                    className="form-control mb-2"
                    required
                />
                <textarea
                    name="detalle"
                    value={newHistoria.detalle}
                    onChange={handleChange}
                    placeholder="Detalle"
                    className="form-control mb-2"
                    rows={2}
                    required
                />
                <button type="submit" className="btn btn-primary me-2">
                    {editingId ? 'Guardar cambios' : 'Agregar historia'}
                </button>
                {editingId && (
                    <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setNewHistoria({ nombrePersonalSalud:'',tipoTerapia:'',detalle:'' }); }}>
                        Cancelar
                    </button>
                )}
            </form>

            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Personal Salud</th>
                        <th>Terapia</th>
                        <th>Detalle</th>
                        <th>Fecha</th>
                        <th>Media</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {historias.length === 0 && (
                        <tr><td colSpan="7" className="text-center">No hay historias.</td></tr>
                    )}
                    {historias.map((h, idx) => (
                        <tr key={h.id}>
                            <td>{idx+1}</td>
                            <td>{h.nombrePersonalSalud}</td>
                            <td>{h.tipoTerapia}</td>
                            <td>{h.detalle}</td>
                            <td>{new Date(h.fechaRegistro).toLocaleString()}</td>
                            <td>
                                {/* file input & preview */}
                                <input
                                    ref={el => (mediaInputs.current[h.id] = el)}
                                    type="file"
                                    accept="image/*,video/*"
                                    className="form-control form-control-sm mb-1"
                                    onChange={() => handlePreviewChange(h.id)}
                                />
                                {previews[h.id]?.tipo === 'foto' && (
                                    <img
                                        src={previews[h.id].url}
                                        alt="preview"
                                        style={{ maxWidth: '100%', maxHeight: '100px', cursor: 'pointer' }}
                                        className="mb-1"
                                        onClick={() => setLightbox({ open: true, url: previews[h.id].url })}
                                    />
                                )}
                                {previews[h.id]?.tipo === 'video' && (
                                    <video
                                        src={previews[h.id].url}
                                        controls
                                        style={{ maxWidth: '100%', maxHeight: '150px' }}
                                        className="mb-1"
                                    />
                                )}
                                <div className="d-flex mb-2">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary me-1"
                                        onClick={() => handleMediaUpload(h.id, 'foto')}
                                    >
                                        Subir foto
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => handleMediaUpload(h.id, 'video')}
                                    >
                                        Subir video
                                    </button>
                                </div>

                                {/* existing media */}
                                {h.media?.map(m => (
                                    <div key={m.id} className="d-flex align-items-center mb-1">
                                        {m.tipoMedia === 'foto' ? (
                                            <img
                                                src={`http://localhost:8080/beneficiarios/${cedula}/historia-medica/${h.id}/media/${m.id}/raw`}
                                                alt={m.nombreArchivo}
                                                style={{ width: '60px', cursor: 'pointer' }}
                                                className="me-2"
                                                onClick={() => setLightbox({
                                                    open: true,
                                                    url: `http://localhost:8080/beneficiarios/${cedula}/historia-medica/${h.id}/media/${m.id}/raw`
                                                })}
                                            />
                                        ) : (
                                            <video
                                                src={`http://localhost:8080/beneficiarios/${cedula}/historia-medica/${h.id}/media/${m.id}/raw`}
                                                controls
                                                style={{ width: '100px', height: 'auto' }}
                                                className="me-2"
                                            />
                                        )}
                                        <span className="me-auto">{m.nombreArchivo}</span>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleMediaDelete(h.id, m.id)}
                                        >
                                            Borrar
                                        </button>
                                    </div>
                                ))}
                            </td>
                            <td>
                                <button
                                    className="btn btn-outline-primary btn-sm me-1"
                                    onClick={() => startEdit(h)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(h.id)}
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