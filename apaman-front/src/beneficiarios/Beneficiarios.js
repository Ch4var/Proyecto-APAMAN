import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Beneficiarios() {
    const [beneficiarios, setBeneficiarios] = useState([]);
    const navigate = useNavigate();

    const topScrollRef = useRef(null);
    const bottomScrollRef = useRef(null);
    const tableRef = useRef(null);

    useEffect(() => {
        loadBeneficiarios();
    }, []);

    const loadBeneficiarios = async () => {
        try {
            const result = await axios.get('http://localhost:8080/beneficiarios');
            setBeneficiarios(result.data);
        } catch (error) {
            console.error('Error cargando beneficiarios', error);
        }
    };

    const deleteBeneficiario = async (cedula) => {
        try {
            await axios.delete(`http://localhost:8080/beneficiarios/${cedula}`);
            loadBeneficiarios();
        } catch (error) {
            console.error('Error borrando beneficiario', error);
        }
    };

    const confirmDelete = (cedula) => {
        if (window.confirm('¿Está seguro de que desea eliminar este beneficiario?')) {
            deleteBeneficiario(cedula);
        }
    };

    const handleActionChange = (e, cedula) => {
        const action = e.target.value;
        switch (action) {
            case 'view':
                navigate(`/beneficiarios/view/${cedula}`);
                break;
            case 'edit':
                navigate(`/beneficiarios/edit/${cedula}`);
                break;
            case 'observaciones':
                navigate(`/beneficiarios/${cedula}/observaciones`);
                break;
            case 'salud':
                navigate(`/beneficiarios/${cedula}/salud`);
                break;
            case 'economico':
                navigate(`/beneficiarios/${cedula}/economico`);
                break;
            case 'expedientes':
                navigate(`/beneficiarios/${cedula}/expedientes`);
                break;
            case 'historias':
                navigate(`/beneficiarios/${cedula}/historias`);
                break;
            case 'delete':
                confirmDelete(cedula);
                break;
            default:
                break;
        }
        e.target.selectedIndex = 0;
    };

    useEffect(() => {
        const top = topScrollRef.current;
        const bottom = bottomScrollRef.current;
        if (!top || !bottom) return;

        const syncTopScroll = () => { bottom.scrollLeft = top.scrollLeft; };
        const syncBottomScroll = () => { top.scrollLeft = bottom.scrollLeft; };

        top.addEventListener('scroll', syncTopScroll);
        bottom.addEventListener('scroll', syncBottomScroll);

        const setDummyWidth = () => {
            if (tableRef.current) {
                const width = tableRef.current.scrollWidth;
                top.firstChild.style.width = width + 'px';
            }
        };
        setDummyWidth();
        window.addEventListener('resize', setDummyWidth);

        return () => {
            top.removeEventListener('scroll', syncTopScroll);
            bottom.removeEventListener('scroll', syncBottomScroll);
            window.removeEventListener('resize', setDummyWidth);
        };
    }, [beneficiarios]);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Lista de Beneficiarios</h2>
                <div>
                    <button
                        className="btn btn-info mx-2"
                        onClick={() => navigate('/beneficiarios/search')}
                    >
                        Buscar Beneficiario
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={() => navigate('/beneficiarios/add')}
                    >
                        Agregar Beneficiario
                    </button>
                </div>
            </div>

            {/* Scrollbar top para desplazamiento horizontal */}
            <div
                ref={topScrollRef}
                style={{ overflowX: 'auto', overflowY: 'hidden' }}
            >
                <div style={{ height: '1px', width: '1px' }} />
            </div>

            <div
                ref={bottomScrollRef}
                className="table-responsive"
                style={{ maxHeight: '70vh', overflowY: 'auto' }}
            >
                <table
                    ref={tableRef}
                    className="table table-bordered table-striped"
                >
                    <thead className="table-dark" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr>
                        <th>#</th>
                        <th>Cédula</th>
                        <th>Nombre Completo</th>
                        <th>Sexo</th>
                        <th>Fecha Nac.</th>
                        <th>Edad</th>
                        <th>Religión</th>
                        <th>Escolaridad</th>
                        <th>Dependencia</th>
                        <th>Ingreso</th>
                        <th>Estado</th>
                        <th>Responsable</th>
                        <th>Tel. Responsable</th>
                        <th>Dir. Responsable</th>
                        <th>Fondo</th>
                        <th>Pensión</th>
                        <th>Presupuesto</th>
                        <th>Foto</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {beneficiarios.map((b, idx) => (
                        <tr key={b.cedula}>
                            <td>{idx + 1}</td>
                            <td>{b.cedula}</td>
                            <td>{`${b.nombre} ${b.apellido1} ${b.apellido2}`}</td>
                            <td>{b.sexo}</td>
                            <td>{b.fechaNacimiento}</td>
                            <td>{b.edad}</td>
                            <td>{b.religion}</td>
                            <td>{b.escolaridad}</td>
                            <td>{b.estadoDependencia}</td>
                            <td>{b.fechaIngreso}</td>
                            <td>{b.estado ? 'Activo' : 'Inactivo'}</td>
                            <td>{`${b.responsableNombre} ${b.responsableApellido1} ${b.responsableApellido2}`}</td>
                            <td>{b.responsableTelefono}</td>
                            <td>{b.responsableDireccion}</td>
                            <td>{b.fondo?.tipo}</td>
                            <td>{b.pension?.tipo}</td>
                            <td>{b.presupuesto}</td>
                            <td>
                                {b.foto ? (
                                    <img
                                        src={`data:image/jpeg;base64,${b.foto}`}
                                        alt="Foto del beneficiario"
                                        style={{ width: '100px', height: 'auto' }}
                                    />
                                ) : (
                                    'Sin foto'
                                )}
                            </td>
                            <td style={{ minWidth: '150px' }}>
                                <select
                                    className="form-select"
                                    defaultValue=""
                                    onChange={(e) => handleActionChange(e, b.cedula)}
                                >
                                    <option value="" disabled>
                                        Acciones
                                    </option>
                                    <option value="view">Ver</option>
                                    <option value="edit">Editar</option>
                                    <option value="observaciones">Observaciones</option>
                                    <option value="salud">Salud</option>
                                    <option value="economico">Económico</option>
                                    <option value="expedientes">Expedientes</option>
                                    <option value="historias">Historias Médicas</option>
                                    <option value="delete">Borrar</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}