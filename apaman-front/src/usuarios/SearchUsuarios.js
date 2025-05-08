import React, { useState } from 'react';
import { searchUsuarios } from '../api/usuarios';
import { useNavigate } from 'react-router-dom';

export default function SearchUsuario() {
  const [cedula, setCedula] = useState('');
  const [correo, setCorreo] = useState('');
  const [resultados, setResultados] = useState([]);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const params = {};
      if (cedula.trim()) params.cedula = cedula;
      else if (correo.trim()) params.correo = correo;
      const { data } = await searchUsuarios(params);
      setResultados(data);
      setSearched(true);
    } catch (err) {
      console.error('Error buscando usuarios', err);
      alert('Error al buscar usuarios');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Buscar Usuario</h2>
      <div className="row mt-3">
        <div className="col-md-6">
          <label className="form-label">Cédula:</label>
          <input
            type="text"
            className="form-control"
            value={cedula}
            onChange={e => { setCedula(e.target.value); setCorreo(''); }}
            disabled={!!correo}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Correo:</label>
          <input
            type="email"
            className="form-control"
            value={correo}
            onChange={e => { setCorreo(e.target.value); setCedula(''); }}
            disabled={!!cedula}
          />
        </div>
      </div>
      <button className="btn btn-primary mt-3" onClick={handleSearch}>
        Buscar
      </button>

      {searched && resultados.length === 0 && (
        <div className="mt-4"><h4>No se encontraron usuarios</h4></div>
      )}

      {resultados.length > 0 && (
        <div className="mt-4 table-responsive">
          <h4>Resultados de búsqueda:</h4>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Cédula</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((u, idx) => (
                <tr key={u.cedula}>
                  <td>{idx + 1}</td>
                  <td>{u.cedula}</td>
                  <td>{u.correo}</td>
                  <td>{u.rol}</td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => navigate('/usuarios')}
                    >
                      Volver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        Cancelar
      </button>
    </div>
);
}
