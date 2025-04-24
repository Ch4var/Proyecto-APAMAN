import React, { useState, useEffect } from "react";

const AddUsuario = () => {
  const [username, setUsername] = useState("");
  const [correo, setCorreo] = useState("");
  const [cedula, setCedula] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rolesDisponibles, setRolesDisponibles] = useState([]);
  const [rolesSeleccionados, setRolesSeleccionados] = useState([]);

  useEffect(() => {
    fetch("/api/roles")
      .then((res) => res.json())
      .then((data) => setRolesDisponibles(data));
  }, []);

  const toggleRol = (rol) => {
    if (rolesSeleccionados.includes(rol)) {
      setRolesSeleccionados(rolesSeleccionados.filter((r) => r !== rol));
    } else {
      setRolesSeleccionados([...rolesSeleccionados, rol]);
    }
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const usuario = {
      username,
      correo,
      cedula,
      contrasena,
      roles: rolesSeleccionados.map((nombre) => ({ nombre }))
    };

    const res = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });

    if (res.ok) {
      alert("Usuario agregado");
      setUsername(""); setCorreo(""); setCedula(""); setContrasena(""); setRolesSeleccionados([]);
    } else {
      alert("Error al agregar usuario");
    }
  };

  return (
    <div>
      <h2>Agregar Usuario</h2>
      <form onSubmit={manejarSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          placeholder="Cédula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          required
        />
        <input
          placeholder="Contrasena"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />

        <div>
          <p>Seleccionar Roles:</p>
          {rolesDisponibles.map((rol) => (
            <label key={rol.id}>
              <input
                type="checkbox"
                checked={rolesSeleccionados.includes(rol.nombre)}
                onChange={() => toggleRol(rol.nombre)}
              />
              {rol.nombre}
            </label>
          ))}
        </div>

        <button type="submit">Guardar Usuario</button>
      </form>
    </div>
  );
};

export default AddUsuario;
