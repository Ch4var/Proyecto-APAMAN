import React, { useState } from "react";
import RolesList from "./RolesList";
import AddRol from "./AddRol";
import EditRol from "./EditRol";

const RolesPanel = () => {
  const [vista, setVista] = useState("lista");
  const [rolSeleccionadoId, setRolSeleccionadoId] = useState(null);

  const manejarEditar = (id) => {
    setRolSeleccionadoId(id);
    setVista("editar");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Roles</h1>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setVista("lista")}>Ver Roles</button>
        <button onClick={() => setVista("agregar")}>Agregar Rol</button>
      </div>

      {vista === "lista" && (
        <>
          <RolesList />
          <hr />
          <label>ID de rol a editar: </label>
          <input
            type="number"
            onChange={(e) => setRolSeleccionadoId(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <button onClick={() => manejarEditar(rolSeleccionadoId)}>Editar Rol</button>
        </>
      )}

      {vista === "agregar" && <AddRol />}
      {vista === "editar" && rolSeleccionadoId && (
        <EditRol rolId={rolSeleccionadoId} />
      )}
    </div>
  );
};

export default RolesPanel;
