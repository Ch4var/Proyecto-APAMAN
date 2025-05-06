import React, { useEffect, useState } from "react";

const RolesList = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetch("/api/roles")
      .then((res) => res.json())
      .then((data) => setRoles(data));
  }, []);

  return (
    <div>
      <h2>Lista de Roles</h2>
      <ul>
        {roles.map((rol) => (
          <li key={rol.id}>
            <strong>{rol.nombre}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RolesList;
