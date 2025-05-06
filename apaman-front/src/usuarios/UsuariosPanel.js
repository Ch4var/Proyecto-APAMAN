import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UsuariosPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const navigate = useNavigate();
  const puedeEditar = roles.some(r => r.nombre === "ADMINISTRADOR");

  useEffect(() => {
    fetch("http://localhost:8080/api/usuarios")
      .then(res => res.json())
      .then(data => setUsuarios(data));
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de Usuarios</h2>
       {puedeEditar && (
         <button
           className="btn btn-success"
           onClick={() => navigate("/users/add")}
         >
           Agregar Usuario
         </button>
       )}
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Cédula</th>
            <th>Correo</th>
            <th>Rol</th>
           {puedeEditar && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.cedula}>
              <td>{u.cedula}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
             {puedeEditar && (
               <td>
                 <Link to={`/users/edit/${u.cedula}`}>
                   <button className="btn btn-outline-primary btn-sm">
                     Editar
                   </button>
                 </Link>
               </td>
             )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
