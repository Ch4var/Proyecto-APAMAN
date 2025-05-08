import React, { useEffect, useState } from 'react';
import { listUsuarios } from '../api/usuarios';

export default function Usuarios() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await listUsuarios();
      setUsers(data);
    })();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Administrar Usuarios</h2>
      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Cédula</th>
            <th>Correo</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.cedula}>
              <td>{i + 1}</td>
              <td>{u.cedula}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
