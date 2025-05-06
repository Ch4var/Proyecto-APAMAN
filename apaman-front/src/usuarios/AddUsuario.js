import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddUsuario() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    cedula: '',
    correo: '',
    contrasena: '',
    rol: 'ADMINISTRADOR'
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/usuarios', usuario, {
        headers: { 'Content-Type': 'application/json' }
      });
      navigate('/users');
    } catch (err) {
      console.error(err);
      setError('No se pudo agregar el usuario');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Agregar Usuario</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Cédula</label>
          <input
            type="text"
            className="form-control"
            name="cedula"
            value={usuario.cedula}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            className="form-control"
            name="correo"
            value={usuario.correo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            name="contrasena"
            value={usuario.contrasena}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select
            className="form-select"
            name="rol"
            value={usuario.rol}
            onChange={handleChange}
          >
            <option value="ADMINISTRADOR">ADMINISTRADOR</option>
            <option value="ASISTENTE">ASISTENTE</option>
            <option value="CONTABILIDAD">CONTABILIDAD</option>
            <option value="PROFESIONAL_SALUD">PROFESIONAL_SALUD</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Guardar</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/users')}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}