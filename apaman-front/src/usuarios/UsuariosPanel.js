import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UsuariosPanel = () => {
  const [usuarios, setUsuarios] = useState([]);
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  useEffect(() => {
    fetch("/api/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data));
  }, []);

  const puedeEditar = roles.includes("ADMIN");

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Lista de Usuarios</h2>

      {puedeEditar && (
        <Link to="/users/add">
          <button>Agregar Usuario</button>
        </Link>
      )}

      <table border="1" cellPadding="10" style={{ marginTop: "1rem", width: "100%" }}>
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Correo</th>
            <th>Rol</th>
            {puedeEditar && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.cedula}>
              <td>{usuario.cedula}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.rol}</td>
              {puedeEditar && (
                <td>
                  {/* Opcionalmente puedes agregar vista y eliminar */}
                  <Link to={`/users/edit/${usuario.cedula}`}>
                    <button>Editar</button>
                  </Link>
                  {/* <button onClick={() => eliminarUsuario(usuario.cedula)}>Eliminar</button> */}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosPanel;