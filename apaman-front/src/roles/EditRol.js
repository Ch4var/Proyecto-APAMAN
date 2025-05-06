import React, { useEffect, useState } from "react";

const EditRol = ({ rolId }) => {
  const [rol, setRol] = useState(null);

  useEffect(() => {
    fetch(`/api/roles/${rolId}`)
      .then((res) => res.json())
      .then(setRol);
  }, [rolId]);

  const manejarSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/roles/${rolId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rol),
    });

    if (res.ok) {
      alert("Rol actualizado");
    } else {
      alert("Error al actualizar");
    }
  };

  if (!rol) return <p>Cargando rol...</p>;

  return (
    <div>
      <h2>Editar Rol</h2>
      <form onSubmit={manejarSubmit}>
        <input
          value={rol.nombre}
          onChange={(e) => setRol({ ...rol, nombre: e.target.value })}
        />
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default EditRol;
