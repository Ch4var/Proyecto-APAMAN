import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function ExpedienteAdministrativoBeneficiario() {
    const { id: cedula } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [expedientes, setExpedientes] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // carga inicial
    useEffect(() => {
        if (!cedula) {
            setError('No se pudo obtener la cédula.');
            return;
        }
        cargarExpedientes();
    }, [cedula]);

    const cargarExpedientes = async () => {
        try {
            const { data } = await axios.get(
                `http://localhost:8080/beneficiarios/${cedula}/expedientes`
            );
            setExpedientes(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error cargando expedientes.');
        }
    };

    const handleUpload = async e => {
        e.preventDefault();
        const file = fileInputRef.current.files[0];
        if (!file) return setError('Selecciona un archivo PDF.');

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post(
                `http://localhost:8080/beneficiarios/${cedula}/expedientes`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setSuccess('Archivo subido correctamente.');
            setError(null);
            fileInputRef.current.value = null;
            cargarExpedientes();
        } catch (err) {
            console.error(err);
            setError('Error al subir el archivo.');
            setSuccess(null);
        }
    };

    const handleDownload = async expId => {
        try {
            const resp = await axios.get(
                `http://localhost:8080/beneficiarios/${cedula}/expedientes/${expId}`,
                { responseType: 'blob' }
            );
            // crear enlace de descarga
            const url = window.URL.createObjectURL(new Blob([resp.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', resp.headers['content-disposition']
                    ?.split('filename="')[1]?.replace(/"/,'')
                || `expediente_${expId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
            setError('Error al descargar el archivo.');
        }
    };

    const handleDelete = async expId => {
        if (!window.confirm('¿Eliminar este expediente?')) return;
        try {
            await axios.delete(
                `http://localhost:8080/beneficiarios/${cedula}/expedientes/${expId}`
            );
            setSuccess('Expediente eliminado.');
            setError(null);
            cargarExpedientes();
        } catch (err) {
            console.error(err);
            setError('Error al eliminar el expediente.');
            setSuccess(null);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Expedientes Administrativos — Beneficiario {cedula}</h2>
                <button className="btn btn-secondary" onClick={() => navigate('/beneficiarios')}>
                    Volver
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleUpload} className="mb-4">
                <div className="input-group">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        className="form-control"
                    />
                    <button type="submit" className="btn btn-primary">
                        Subir PDF
                    </button>
                </div>
            </form>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Archivo</th>
                        <th>Fecha Subida</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {expedientes.length > 0 ? (
                        expedientes.map((exp, idx) => (
                            <tr key={exp.id}>
                                <td>{idx + 1}</td>
                                <td>{exp.nombreArchivo}</td>
                                <td>{new Date(exp.fechaSubida).toLocaleString()}</td>
                                <td>
                                    <button
                                        className="btn btn-outline-primary btn-sm mx-1"
                                        onClick={() => handleDownload(exp.id)}
                                    >
                                        Descargar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(exp.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                                No hay expedientes cargados.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}