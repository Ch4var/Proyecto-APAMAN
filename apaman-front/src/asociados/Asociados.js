import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

/**
 * Vista principal del módulo de Asociados.
 * • Tabla con scroll horizontal sincronizado (header + body)
 * • Acciones CRUD y enlaces a sub‑recursos (Observaciones, Acta, Referentes)
 */
export default function Asociados() {
    const [asociados, setAsociados] = useState([]);
    const navigate = useNavigate();

    /* refs para scroll horizontal */
    const topScrollRef = useRef(null);
    const bottomScrollRef = useRef(null);
    const tableRef = useRef(null);

    /* ─────────────── CARGA ─────────────── */
    useEffect(() => { loadAsociados(); }, []);

    const loadAsociados = async () => {
        try {
            const { data } = await axios.get('http://localhost:8080/asociados');
            setAsociados(data);
        } catch (err) {
            console.error(err);
            alert('Error cargando asociados');
        }
    };

    /* ─────────────── BORRADO ─────────────── */
    const deleteAsociado = async (cedula) => {
        try {
            await axios.delete(`http://localhost:8080/asociados/${cedula}`);
            loadAsociados();
        } catch (err) {
            console.error(err);
            alert('No se pudo borrar el asociado');
        }
    };

    const confirmDelete = (cedula) =>
        window.confirm('¿Eliminar este asociado?') && deleteAsociado(cedula);

    /* ─────────────── ACCIONES ─────────────── */
    const handleActionChange = (e, cedula) => {
        const action = e.target.value;
        switch (action) {
            case 'view':
                navigate(`/asociados/view/${cedula}`);
                break;
            case 'edit':
                navigate(`/asociados/edit/${cedula}`);
                break;
            case 'observaciones':
                navigate(`/asociados/${cedula}/observaciones`);
                break;
            case 'acta':
                navigate(`/asociados/${cedula}/acta`);
                break;
            case 'referentes':
                navigate(`/asociados/${cedula}/referentes`);
                break;
            case 'delete':
                confirmDelete(cedula);
                break;
            default:
                break;
        }
        e.target.selectedIndex = 0; // reset select
    };

    /* ─────────────── SYNC SCROLL ─────────────── */
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
                top.firstChild.style.width = `${tableRef.current.scrollWidth}px`;
            }
        };
        setDummyWidth();
        window.addEventListener('resize', setDummyWidth);

        return () => {
            top.removeEventListener('scroll', syncTopScroll);
            bottom.removeEventListener('scroll', syncBottomScroll);
            window.removeEventListener('resize', setDummyWidth);
        };
    }, [asociados]);

    /* ─────────────── RENDER ─────────────── */
    return (
        <div className="container mt-4">
            {/* header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Lista de Asociados</h2>
                <div>
                    <button className="btn btn-info mx-2" onClick={() => navigate('/asociados/search')}>
                        Buscar Asociado
                    </button>
                    <button className="btn btn-success" onClick={() => navigate('/asociados/add')}>
                        Agregar Asociado
                    </button>
                </div>
            </div>

            {/* top scrollbar */}
            <div ref={topScrollRef} style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                <div style={{ height: '1px', width: '1px' }} />
            </div>

            {/* table */}
            <div ref={bottomScrollRef} className="table-responsive" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <table ref={tableRef} className="table table-bordered table-striped">
                    <thead className="table-dark" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr>
                        <th>#</th>
                        <th>Cédula</th>
                        <th>Nombre Completo</th>
                        <th>Sexo</th>
                        <th>Fecha Nac.</th>
                        <th>Edad</th>
                        <th>Moroso</th>
                        <th>Meses Adeudo</th>
                        <th>Monto Adeudo</th>
                        <th>Cuota Mensual</th>
                        <th>Teléfono</th>
                        <th>Correo</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {asociados.map((a, idx) => (
                        <tr key={a.cedula}>
                            <td>{idx + 1}</td>
                            <td>{a.cedula}</td>
                            <td>{`${a.nombre} ${a.apellido1} ${a.apellido2}`}</td>
                            <td>{a.sexo}</td>
                            <td>{dayjs(a.fechaNacimiento).format('DD/MM/YYYY')}</td>
                            <td>{a.edad}</td>
                            <td>{a.estadoMorosidad ? 'Sí' : 'No'}</td>
                            <td>{a.mesesAdeudo}</td>
                            <td>
                                {Number(a.cantidadAdeudo).toLocaleString('es-CR', {
                                    style: 'currency',
                                    currency: 'CRC'
                                })}
                            </td>
                            <td>
                                {Number(a.cuotaMensual).toLocaleString('es-CR', {
                                    style: 'currency',
                                    currency: 'CRC'
                                })}
                            </td>
                            <td>{a.telefono}</td>
                            <td>{a.correo}</td>
                            <td>{a.estado ? 'Activo' : 'Inactivo'}</td>
                            <td style={{ minWidth: '180px' }}>
                                <select className="form-select" defaultValue="" onChange={(e) => handleActionChange(e, a.cedula)}>
                                    <option value="" disabled>Acciones</option>
                                    <option value="view">Ver</option>
                                    <option value="edit">Editar</option>
                                    <option value="observaciones">Observaciones</option>
                                    <option value="acta">Acta</option>
                                    <option value="referentes">Referentes</option>
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
