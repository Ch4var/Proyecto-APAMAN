import React, { useState } from "react";

const AddRol = () => {
  const [nombre, setNombre] = useState("");

  const manejarSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });

    if (res.ok) {
      alert("Rol agregado correctamente");
      setNombre("");
    } else {
      alert("Error al agregar rol");
    }
  };

  return (
    <div>
      <h2>Agregar Rol</h2>
      <form onSubmit={manejarSubmit}>
        <input
          placeholder="Nombre del rol"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default AddRol;
