import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditAsociado() {
  const navigate = useNavigate();
  const { id } = useParams(); // aquí id es la cédula

  const [asociado, setAsociado] = useState({
    cedula: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    sexo: "",
    fechaNacimiento: "",
    fechaAsociacion: "",
    cuotaMensual: "",
    estado: "true",
    estadoMorosidad: "false",
    correo: "",
    telefono: "",
    direccion: "",
    // campos de acta
    actaFechaSesion: "",
    actaNumActa: "",
    actaNumAcuerdo: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsociado = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/asociados/${id}`);
        const data = res.data;
        setAsociado({
          cedula: String(data.cedula),
          nombre: data.nombre || "",
          apellido1: data.apellido1 || "",
          apellido2: data.apellido2 || "",
          sexo: data.sexo || "",
          fechaNacimiento: data.fechaNacimiento ? data.fechaNacimiento.split("T")[0] : "",
          fechaAsociacion: data.fechaAsociacion ? data.fechaAsociacion.split("T")[0] : "",
          cuotaMensual: String(data.cuotaMensual),
          estado: String(data.estado),
          estadoMorosidad: String(data.estadoMorosidad),
          correo: data.correo || "",
          telefono: String(data.telefono),
          direccion: data.direccion || "",
          actaFechaSesion: data.actaAsociado?.fechaSesion
            ? data.actaAsociado.fechaSesion.split("T")[0]
            : "",
          actaNumActa: data.actaAsociado?.numActa || "",
          actaNumAcuerdo: data.actaAsociado?.numAcuerdo || ""
        });
      } catch (error) {
        console.error("Error al cargar asociado:", error);
        alert("No se pudo cargar la información del asociado.");
        navigate("/asociados");
      } finally {
        setLoading(false);
      }
    };
    fetchAsociado();
  }, [id, navigate]);

  const handleChange = (e) => {
    setAsociado({
      ...asociado,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    const onlyNums = /^\d+$/;
    const onlyLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    if (!onlyNums.test(asociado.cedula)) {
      alert("Cédula inválida.");
      return;
    }
    if (
      !asociado.nombre ||
      !onlyLetters.test(asociado.nombre) ||
      !asociado.apellido1 ||
      !onlyLetters.test(asociado.apellido1) ||
      !asociado.apellido2 ||
      !onlyLetters.test(asociado.apellido2)
    ) {
      alert("Nombre y apellidos deben contener solo letras.");
      return;
    }
    if (!["Masculino", "Femenina", "Otro"].includes(asociado.sexo)) {
      alert("Seleccione un sexo válido.");
      return;
    }
    if (!asociado.fechaNacimiento) {
      alert("Fecha de nacimiento requerida.");
      return;
    }
    if (!asociado.fechaAsociacion) {
      alert("Fecha de asociación requerida.");
      return;
    }
    if (!asociado.actaFechaSesion) {
      alert("Fecha de sesión del acta requerida.");
      return;
    }
    if (!asociado.actaNumActa) {
      alert("Número de acta requerido.");
      return;
    }
    if (!asociado.actaNumAcuerdo) {
      alert("Número de acuerdo requerido.");
      return;
    }
    if (isNaN(parseFloat(asociado.cuotaMensual)) || parseFloat(asociado.cuotaMensual) < 0) {
      alert("Cuota mensual inválida.");
      return;
    }
    if (!["true", "false"].includes(asociado.estado)) {
      alert("Seleccione estado Activo/Inactivo.");
      return;
    }
    if (!["true", "false"].includes(asociado.estadoMorosidad)) {
      alert("Seleccione estado de morosidad.");
      return;
    }
    if (!asociado.correo.includes("@")) {
      alert("Correo inválido.");
      return;
    }
    if (!onlyNums.test(asociado.telefono)) {
      alert("Teléfono inválido.");
      return;
    }
    if (!asociado.direccion) {
      alert("Dirección requerida.");
      return;
    }

    // Construir payload
    const payload = {
      cedula: parseInt(asociado.cedula, 10),
      nombre: asociado.nombre,
      apellido1: asociado.apellido1,
      apellido2: asociado.apellido2,
      sexo: asociado.sexo,
      fechaNacimiento: asociado.fechaNacimiento,
      fechaAsociacion: asociado.fechaAsociacion,
      cuotaMensual: parseFloat(asociado.cuotaMensual),
      estado: asociado.estado === "true",
      estadoMorosidad: asociado.estadoMorosidad === "true",
      correo: asociado.correo,
      telefono: parseInt(asociado.telefono, 10),
      direccion: asociado.direccion,
      actaAsociado: {
        fechaSesion: asociado.actaFechaSesion,
        numActa: asociado.actaNumActa,
        numAcuerdo: asociado.actaNumAcuerdo
      }
    };

    try {
      await axios.put(
        `http://localhost:8080/api/asociados/${id}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Asociado actualizado con éxito.");
      navigate("/asociados");
    } catch (error) {
      console.error("Error al actualizar asociado:", error.response || error);
      const msg =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message;
      alert(`Ocurrió un error al actualizar el asociado: ${msg}`);
    }
  };

  if (loading) {
    return <div className="container mt-4">Cargando datos del asociado...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Editar Asociado</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Cédula */}
          <div className="col-md-6 mb-3">
            <label>Cédula</label>
            <input
              type="text"
              className="form-control"
              name="cedula"
              value={asociado.cedula}
              onChange={handleChange}
              readOnly
            />
          </div>
          {/* Nombre */}
          <div className="col-md-6 mb-3">
            <label>Nombre</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={asociado.nombre}
              onChange={handleChange}
              required
            />
          </div>
          {/* Apellidos */}
          <div className="col-md-3 mb-3">
            <label>Apellido 1</label>
            <input
              type="text"
              className="form-control"
              name="apellido1"
              value={asociado.apellido1}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <label>Apellido 2</label>
            <input
              type="text"
              className="form-control"
              name="apellido2"
              value={asociado.apellido2}
              onChange={handleChange}
              required
            />
          </div>
          {/* Sexo */}
          <div className="col-md-4 mb-3">
            <label>Sexo</label>
            <select
              className="form-control"
              name="sexo"
              value={asociado.sexo}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenina">Femenina</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          {/* Fechas */}
          <div className="col-md-4 mb-3">
            <label>Fecha de Nacimiento</label>
            <input
              type="date"
              className="form-control"
              name="fechaNacimiento"
              value={asociado.fechaNacimiento}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>Fecha de Asociación</label>
            <input
              type="date"
              className="form-control"
              name="fechaAsociacion"
              value={asociado.fechaAsociacion}
              onChange={handleChange}
              required
            />
          </div>
          {/* Cuota */}
          <div className="col-md-6 mb-3">
            <label>Cuota Mensual</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              name="cuotaMensual"
              value={asociado.cuotaMensual}
              onChange={handleChange}
              required
            />
          </div>
          {/* Estados */}
          <div className="col-md-3 mb-3">
            <label>Estado</label>
            <select
              className="form-control"
              name="estado"
              value={asociado.estado}
              onChange={handleChange}
              required
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <label>Morosidad</label>
            <select
              className="form-control"
              name="estadoMorosidad"
              value={asociado.estadoMorosidad}
              onChange={handleChange}
              required
            >
              <option value="false">No Moroso</option>
              <option value="true">Moroso</option>
            </select>
          </div>
          {/* Acta */}
          <div className="col-md-4 mb-3">
            <label>Fecha Sesión Acta</label>
            <input
              type="date"
              className="form-control"
              name="actaFechaSesion"
              value={asociado.actaFechaSesion}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>Número Acta</label>
            <input
              type="text"
              className="form-control"
              name="actaNumActa"
              value={asociado.actaNumActa}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label>Número Acuerdo</label>
            <input
              type="text"
              className="form-control"
              name="actaNumAcuerdo"
              value={asociado.actaNumAcuerdo}
              onChange={handleChange}
              required
            />
          </div>
          {/* Contacto */}
          <div className="col-md-6 mb-3">
            <label>Correo</label>
            <input
              type="email"
              className="form-control"
              name="correo"
              value={asociado.correo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Teléfono</label>
            <input
              type="text"
              className="form-control"
              name="telefono"
              value={asociado.telefono}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-12 mb-3">
            <label>Dirección</label>
            <input
              type="text"
              className="form-control"
              name="direccion"
              value={asociado.direccion}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar Cambios
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/asociados")}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
