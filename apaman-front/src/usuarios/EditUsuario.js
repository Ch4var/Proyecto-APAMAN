import React, { useEffect, useState } from "react";

const EditUsuario = ({ usuarioId }) => {
  const [usuario, setUsuario] = useState(null);
  const [rolesDisponibles, setRolesDisponibles] = useState([]);

  useEffect(() => {
    fetch(`/api/usuarios/${usuarioId}`)
      .then(res => res.json())
      .then(setUsuario);

    fetch("/api/roles")
      .then(res => res.json())
      .then(setRolesDisponibles);
  }, [usuarioId]);

  const toggleRol = (rolNombre) => {
    if (!usuario) return;
    const tieneRol = usuario.roles.some((r) => r.nombre === rolNombre);
    const nuevosRoles = tieneRol
      ? usuario.roles.filter((r) => r.nombre !== rolNombre)
      : [...usuario.roles, { nombre: rolNombre }];

    setUsuario({ ...usuario, roles: nuevosRoles });
  };

  const manejarActualizar = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/usuarios/${usuarioId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });

    if (res.ok) {
      alert("Usuario actualizado");
    } else {
      alert("Error al actualizar usuario");
    }
  };

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Editar Usuario</h2>
      <form onSubmit={manejarActualizar}>
        <input value={usuario.username} onChange={(e) => setUsuario({ ...usuario, username: e.target.value })} />
        <input value={usuario.correo} onChange={(e) => setUsuario({ ...usuario, correo: e.target.value })} />
        <input value={usuario.cedula} onChange={(e) => setUsuario({ ...usuario, cedula: e.target.value })} />

        <div>
          <p>Roles:</p>
          {rolesDisponibles.map((rol) => (
            <label key={rol.id}>
              <input
                type="checkbox"
                checked={usuario.roles.some((r) => r.nombre === rol.nombre)}
                onChange={() => toggleRol(rol.nombre)}
              />
              {rol.nombre}
            </label>
          ))}
        </div>

        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditUsuario;
