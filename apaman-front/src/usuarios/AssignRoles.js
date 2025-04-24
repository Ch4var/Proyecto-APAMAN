import React, { useEffect, useState } from "react";

const AssignRoles = ({ usuarioId }) => {
  const [usuario, setUsuario] = useState(null);
  const [rolesDisponibles, setRolesDisponibles] = useState([]);

  useEffect(() => {
    fetch(`/api/usuarios/${usuarioId}`)
      .then((res) => res.json())
      .then(setUsuario);

    fetch("/api/roles")
      .then((res) => res.json())
      .then(setRolesDisponibles);
  }, [usuarioId]);

  const toggleRol = (rolNombre) => {
    const tieneRol = usuario.roles.some((r) => r.nombre === rolNombre);
    const nuevosRoles = tieneRol
      ? usuario.roles.filter((r) => r.nombre !== rolNombre)
      : [...usuario.roles, { nombre: rolNombre }];
    setUsuario({ ...usuario, roles: nuevosRoles });
  };

  const guardarRoles = async () => {
    const res = await fetch(`/api/usuarios/${usuarioId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });

    if (res.ok) {
      alert("Roles actualizados");
    } else {
      alert("Error al actualizar roles");
    }
  };

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div>
      <h3>Asignar Roles a {usuario.username}</h3>
      {rolesDisponibles.map((rol) => (
        <label key={rol.id} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={usuario.roles.some((r) => r.nombre === rol.nombre)}
            onChange={() => toggleRol(rol.nombre)}
          />
          {rol.nombre}
        </label>
      ))}
      <button onClick={guardarRoles}>Guardar Cambios</button>
    </div>
  );
};

export default AssignRoles;
