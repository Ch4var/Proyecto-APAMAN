import React, { useEffect, useState } from "react";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetch("/api/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data));
  }, []);

  const usuariosFiltrados = usuarios.filter((u) =>
    u.username.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <input
        type="text"
        placeholder="Buscar por nombre de usuario"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      <ul>
        {usuariosFiltrados.map((usuario) => (
          <li key={usuario.id}>
            <strong>{usuario.username}</strong> ({usuario.correo})<br />
            Roles: {usuario.roles?.map(r => r.nombre).join(", ") || "Ninguno"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Usuarios;
