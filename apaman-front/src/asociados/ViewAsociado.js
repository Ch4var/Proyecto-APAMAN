import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ViewAsociado() {
    const { id } = useParams();
    const [asociado, setAsociado] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAsociado = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/asociados/${id}`);
                setAsociado(res.data);
            } catch (error) {
                console.error('Error al cargar el asociado', error);
                alert('No se pudo cargar la información del asociado.');
                navigate('/asociados');
            }
        };
        fetchAsociado();
    }, [id, navigate]);

    if (!asociado) {
        return <div className="container mt-4">Cargando...</div>;
    }

    const {
        cedula,
        nombre,
        apellido1,
        apellido2,
        sexo,
        fechaNacimiento,
        edad,
        estado,
        fechaAsociacion,
        actaAsociado,
        cuotaMensual,
        estadoMorosidad,
        mesesAdeudo,
        cantidadAdeudo,
        correo,
        telefono,
        direccion
    } = asociado;

    return (
        <div className="container mt-4">
            <h2>Detalles del Asociado</h2>
            <div className="card mt-3 shadow-sm">
                <div className="card-body">
                    <table className="table table-borderless mb-0">
                        <tbody>
                            <tr><th>Cédula</th><td>{cedula}</td></tr>
                            <tr><th>Nombre Completo</th><td>{`${nombre} ${apellido1} ${apellido2}`}</td></tr>
                            <tr><th>Sexo</th><td>{sexo}</td></tr>
                            <tr><th>Fecha Nacimiento</th><td>{fechaNacimiento?.split('T')[0]}</td></tr>
                            <tr><th>Edad</th><td>{edad}</td></tr>
                            <tr><th>Estado</th><td>{estado ? 'Activo' : 'Inactivo'}</td></tr>
                            <tr><th>Fecha de Asociación</th><td>{fechaAsociacion?.split('T')[0]}</td></tr>
                            {actaAsociado && (
                                <>
                                    <tr><th>Fecha Sesión Acta</th><td>{actaAsociado.fechaSesion?.split('T')[0]}</td></tr>
                                    <tr><th>Número Acta</th><td>{actaAsociado.numActa}</td></tr>
                                    <tr><th>Número Acuerdo</th><td>{actaAsociado.numAcuerdo}</td></tr>
                                </>
                            )}
                            <tr><th>Cuota Mensual</th><td>{cuotaMensual}</td></tr>
                            <tr><th>Estado Morosidad</th><td>{estadoMorosidad ? 'Moroso' : 'Al día'}</td></tr>
                            <tr><th>Meses de Adeudo</th><td>{mesesAdeudo}</td></tr>
                            <tr><th>Cantidad de Adeudo</th><td>{cantidadAdeudo}</td></tr>
                            <tr><th>Correo</th><td>{correo}</td></tr>
                            <tr><th>Teléfono</th><td>{telefono}</td></tr>
                            <tr><th>Dirección</th><td>{direccion}</td></tr>
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-end mt-3">
                        <button
                            className="btn btn-outline-primary me-2"
                            onClick={() => navigate(`/asociados/edit/${cedula}`)}
                        >
                            Editar
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate(-1)}
                        >
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
