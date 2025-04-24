import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginUsuario = () => {
  const [cedula, setCedula] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cedula: cedula,
          contrasena: contrasena
        })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("usuario", JSON.stringify(data));
        localStorage.setItem("roles", JSON.stringify(data.rol ? [{ nombre: data.rol }] : []));
        navigate("/");
      } else {
        setError("Credenciales inválidas");
      }
    } catch (error) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={manejarLogin}>
        <input
          type="text"
          placeholder="Cédula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoginUsuario;
