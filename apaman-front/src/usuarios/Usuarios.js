import React, { useEffect, useState, useRef } from 'react';
import { listUsuarios } from '../api/usuarios';
import { useNavigate } from 'react-router-dom';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const topScrollRef = useRef(null);
  const bottomScrollRef = useRef(null);
  const tableRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const { data } = await listUsuarios();
      setUsuarios(data);
    } catch (err) {
      console.error('Error cargando usuarios', err);
      alert('Error cargando usuarios');
    }
  };

  useEffect(() => {
    const top = topScrollRef.current;
    const bottom = bottomScrollRef.current;
    if (!top || !bottom) return;
    const syncTop = () => { bottom.scrollLeft = top.scrollLeft; };
    const syncBottom = () => { top.scrollLeft = bottom.scrollLeft; };
    top.addEventListener('scroll', syncTop);
    bottom.addEventListener('scroll', syncBottom);
    const setDummyWidth = () => {
      if (tableRef.current) {
        top.firstChild.style.width = tableRef.current.scrollWidth + 'px';
      }
    };
    setDummyWidth();
    window.addEventListener('resize', setDummyWidth);
    return () => {
      top.removeEventListener('scroll', syncTop);
      bottom.removeEventListener('scroll', syncBottom);
      window.removeEventListener('resize', setDummyWidth);
    };
  }, [usuarios]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Lista de Usuarios</h2>
        <button className="btn btn-info" onClick={() => navigate('/usuarios/search')}>
          Buscar Usuario
        </button>
      </div>
      <div ref={topScrollRef} style={{ overflowX: 'auto', overflowY: 'hidden' }}>
        <div style={{ height: '1px', width: '1px' }} />
      </div>
      <div ref={bottomScrollRef} className="table-responsive" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <table ref={tableRef} className="table table-bordered table-striped">
          <thead className="table-dark" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
              <th>#</th>
              <th>Cédula</th>
              <th>Correo</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, idx) => (
              <tr key={u.cedula}>
                <td>{idx + 1}</td>
                <td>{u.cedula}</td>
                <td>{u.correo}</td>
                <td>{u.rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
);
}
