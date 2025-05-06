import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function ObservacionesBeneficiario() {
    const [observaciones, setObservaciones] = useState([]);
    const [nuevaObs, setNuevaObs] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);

    const { id: cedula } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!cedula) {
            setErrorMsg('No se pudo obtener la cédula del beneficiario.');
            return;
        }
        cargarObservaciones();
    }, [cedula]);

    const cargarObservaciones = async () => {
        try {
            const { data } = await axios.get(
                `http://localhost:8080/beneficiarios/${cedula}/observaciones`
            );
            setObservaciones(data);
            setErrorMsg(null);
        } catch (err) {
            console.error('Error cargando observaciones', err);
            setErrorMsg(err.response?.data?.message || 'Error al cargar observaciones.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nuevaObs.trim()) return;

        try {
            await axios.post(
                `http://localhost:8080/beneficiarios/${cedula}/observaciones`,
                { observacion: nuevaObs }
            );
            setNuevaObs('');
            cargarObservaciones();
        } catch (err) {
            console.error('Error agregando observación', err);
            setErrorMsg(err.response?.data?.message || 'Error al agregar observación.');
        }
    };

    const handleDelete = async (obsId) => {
        if (!window.confirm('¿Eliminar esta observación?')) return;
        try {
            await axios.delete(
                `http://localhost:8080/beneficiarios/${cedula}/observaciones/${obsId}`
            );
            cargarObservaciones();
        } catch (err) {
            console.error('Error borrando observación', err);
            setErrorMsg('Error al borrar observación.');
        }
    };

    const startEdit = (obs) => {
        setEditingId(obs.id);
        setEditText(obs.observacion);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const submitEdit = async (e) => {
        e.preventDefault();
        if (!editText.trim()) return;

        try {
            await axios.put(
                `http://localhost:8080/beneficiarios/${cedula}/observaciones/${editingId}`,
                { observacion: editText }
            );
            setEditingId(null);
            setEditText('');
            cargarObservaciones();
        } catch (err) {
            console.error('Error editando observación', err);
            setErrorMsg('Error al editar observación.');
        }
    };

    return (
        <div className="container mt-4">
            {/* Cabecera */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Observaciones del Beneficiario {cedula}</h2>
                <button className="btn btn-secondary" onClick={() => navigate('/beneficiarios')}>
                    Volver a Beneficiarios
                </button>
            </div>

            {/* Formulario nueva observación */}
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="input-group">
          <textarea
              className="form-control"
              placeholder="Nueva observación..."
              value={nuevaObs}
              onChange={(e) => setNuevaObs(e.target.value)}
              rows={2}
          />
                    <button type="submit" className="btn btn-success">
                        Agregar
                    </button>
                </div>
            </form>

            {/* Mensaje de error */}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            {/* Tabla observaciones */}
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Fecha</th>
                        <th>Observación</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {observaciones.length > 0 ? (
                        observaciones.map((obs, idx) => (
                            <tr key={obs.id}>
                                <td>{idx + 1}</td>
                                <td>{new Date(obs.fecha).toLocaleString()}</td>
                                <td>
                                    {editingId === obs.id ? (
                                        <form onSubmit={submitEdit} className="d-flex">
                        <textarea
                            className="form-control"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={1}
                        />
                                            <button className="btn btn-primary btn-sm mx-1" type="submit">
                                                Guardar
                                            </button>
                                            <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                                                Cancelar
                                            </button>
                                        </form>
                                    ) : (
                                        obs.observacion
                                    )}
                                </td>
                                <td>
                                    {editingId !== obs.id && (
                                        <>
                                            <button
                                                className="btn btn-outline-primary btn-sm mx-1"
                                                onClick={() => startEdit(obs)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(obs.id)}
                                            >
                                                Borrar
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                {errorMsg ? '—' : 'No hay observaciones registradas.'}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}