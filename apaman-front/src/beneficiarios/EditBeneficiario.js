import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditBeneficiario() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [beneficiario, setBeneficiario] = useState({
        cedula: "",
        nombre: "",
        apellido1: "",
        apellido2: "",
        sexo: "",
        fechaNacimiento: "",
        religion: "",
        escolaridad: "",
        estadoDependencia: "",
        fechaIngreso: "",
        estado: "true",
        responsableNombre: "",
        responsableApellido1: "",
        responsableApellido2: "",
        responsableTelefono: "",
        responsableDireccion: "",
        idFondo: "",
        idPension: "",
        presupuesto: ""
    });

    const [foto, setFoto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBeneficiario = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/beneficiarios/${id}`);
                const data = response.data;

                const formattedData = {
                    ...data,
                    fechaNacimiento: data.fechaNacimiento ? data.fechaNacimiento.split('T')[0] : "",
                    fechaIngreso: data.fechaIngreso ? data.fechaIngreso.split('T')[0] : "",
                    estado: String(data.estado),

                    idFondo: String(data.fondo ? data.fondo.id : data.idFondo || ""),
                    idPension: String(data.pension ? data.pension.id : data.idPension || ""),
                    presupuesto: String(data.presupuesto || "")
                };

                delete formattedData.fotoUrl;
                delete formattedData.fondo;
                delete formattedData.pension;
                delete formattedData.id;

                setBeneficiario(formattedData);
                setLoading(false);

            } catch (error) {
                console.error("Error al obtener beneficiario", error);
                alert("No se pudo cargar la información del beneficiario.");
                navigate("/beneficiarios");
            }
        };

        fetchBeneficiario();
    }, [id, navigate]);

    const handleChange = (e) => {
        setBeneficiario({
            ...beneficiario,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setFoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- Validaciones
        const onlyNums = /^\d+$/;
        const onlyLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        const phoneRe = /^[0-9\-\+\(\)\s]+$/;

        if (!beneficiario.cedula || !onlyNums.test(beneficiario.cedula)) {
            alert("Cédula inválida (solo números y requerida).");
            return;
        }
        if (!beneficiario.nombre || !onlyLetters.test(beneficiario.nombre) ||
            !beneficiario.apellido1 || !onlyLetters.test(beneficiario.apellido1) ||
            !beneficiario.apellido2 || !onlyLetters.test(beneficiario.apellido2)) {
            alert("Nombre y apellidos deben contener solo letras y son requeridos.");
            return;
        }
        if (!["Masculino", "Femenina", "Otro"].includes(beneficiario.sexo)) {
            alert("Seleccione un Sexo válido.");
            return;
        }
        if (!beneficiario.fechaNacimiento) {
            alert("Fecha de nacimiento requerida.");
            return;
        }
        if (![
            "Cristianismo_Católico",
            "Cristianismo_Protestante",
            "Budaísmo",
            "Judaísmo",
            "Islam",
            "Otro"
        ].includes(beneficiario.religion)) {
            alert("Seleccione una Religión válida.");
            return;
        }
        if (![
            "Ninguno",
            "Preescolar",
            "Primaria",
            "Secundaria",
            "Educación_Superior"
        ].includes(beneficiario.escolaridad)) {
            alert("Seleccione una Escolaridad válida.");
            return;
        }
        if (!["Dependiente", "Moderadamente Dependiente", "Independiente"].includes(beneficiario.estadoDependencia)) {
            alert("Seleccione un Estado de Dependencia válido.");
            return;
        }
        if (!beneficiario.fechaIngreso) {
            alert("Fecha de ingreso requerida.");
            return;
        }
        if (!["true", "false"].includes(beneficiario.estado)) {
            alert("Seleccione Estado Activo/Inactivo.");
            return;
        }
        if (!beneficiario.responsableNombre || !onlyLetters.test(beneficiario.responsableNombre) ||
            !beneficiario.responsableApellido1 || !onlyLetters.test(beneficiario.responsableApellido1) ||
            !beneficiario.responsableApellido2 || !onlyLetters.test(beneficiario.responsableApellido2)) {
            alert("Datos del responsable (nombre y apellidos) deben contener solo letras y son requeridos.");
            return;
        }
        if (!beneficiario.responsableTelefono || !phoneRe.test(beneficiario.responsableTelefono)) {
            alert("Teléfono del responsable inválido o vacío.");
            return;
        }
        if (!beneficiario.responsableDireccion) {
            alert("Dirección del responsable requerida.");
            return;
        }

        if (!beneficiario.idFondo) {
            alert("Seleccione un Fondo válido.");
            return;
        }
        if (!beneficiario.idPension) {
            alert("Seleccione una Pensión válida.");
            return;
        }

        if (beneficiario.presupuesto === "" || isNaN(parseFloat(beneficiario.presupuesto))) {
            alert("Presupuesto inválido o vacío.");
            return;
        }

        const formData = new FormData();
        Object.entries(beneficiario).forEach(([key, val]) => {
            if (val !== null && val !== undefined) {
                formData.append(key, val);
            }
        });

        if (foto) {
            formData.append("fotoFile", foto);
        }

        try {

            await axios.put(
                `http://localhost:8080/beneficiarios/${id}?idFondo=${beneficiario.idFondo}&idPension=${beneficiario.idPension}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            alert("Beneficiario actualizado con éxito.");
            navigate("/beneficiarios");
        } catch (error) {
            console.error("Error al editar beneficiario", error);

            let errorMsg = "Ocurrió un error al actualizar el beneficiario.";
            if (error.response && error.response.data && error.response.data.message) {
                errorMsg = error.response.data.message;
            } else if (error.message) {
                errorMsg = error.message;
            }
            alert(errorMsg);
        }
    };

    if (loading) {
        return <div className="container mt-4">Cargando datos del beneficiario...</div>;
    }

    return (
        <div className="container mt-4">
            <h2>Editar Beneficiario</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">

                    {/* Cédula */}
                    <div className="col-md-6 mb-3">
                        <label>Cédula</label>
                        <input
                            type="text"
                            className="form-control"
                            name="cedula"
                            value={beneficiario.cedula}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Nombre */}
                    <div className="col-md-6 mb-3">
                        <label>Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            value={beneficiario.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Apellido 1 */}
                    <div className="col-md-3 mb-3">
                        <label>Apellido 1</label>
                        <input
                            type="text"
                            className="form-control"
                            name="apellido1"
                            value={beneficiario.apellido1}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Apellido 2 */}
                    <div className="col-md-3 mb-3">
                        <label>Apellido 2</label>
                        <input
                            type="text"
                            className="form-control"
                            name="apellido2"
                            value={beneficiario.apellido2}
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
                            value={beneficiario.sexo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenina">Femenina</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    {/* Fecha de Nacimiento */}
                    <div className="col-md-4 mb-3">
                        <label>Fecha de Nacimiento</label>
                        <input
                            type="date"
                            className="form-control"
                            name="fechaNacimiento"
                            value={beneficiario.fechaNacimiento}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Religión */}
                    <div className="col-md-4 mb-3">
                        <label>Religión</label>
                        <select
                            className="form-control"
                            name="religion"
                            value={beneficiario.religion}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione</option>
                            {/* Opciones de AddBeneficiario */}
                            <option value="Cristianismo_Católico">Cristianismo Católico</option>
                            <option value="Cristianismo_Protestante">Cristianismo Protestante</option>
                            <option value="Budaísmo">Budaísmo</option>
                            <option value="Judaísmo">Judaísmo</option>
                            <option value="Islam">Islam</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    {/* Escolaridad */}
                    <div className="col-md-6 mb-3">
                        <label>Escolaridad</label>
                        <select
                            className="form-control"
                            name="escolaridad"
                            value={beneficiario.escolaridad}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione</option>
                            {/* Opciones de AddBeneficiario */}
                            <option value="Ninguno">Ninguno</option>
                            <option value="Preescolar">Preescolar</option>
                            <option value="Primaria">Primaria</option>
                            <option value="Secundaria">Secundaria</option>
                            <option value="Educación_Superior">Educación Superior</option>
                        </select>
                    </div>
                    {/* Dependencia */}
                    <div className="col-md-6 mb-3">
                        <label>Dependencia</label>
                        <select
                            className="form-control"
                            name="estadoDependencia"
                            value={beneficiario.estadoDependencia}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione</option>
                            {/* Opciones de AddBeneficiario */}
                            <option value="Dependiente">Dependiente</option>
                            <option value="Moderadamente Dependiente">Moderadamente Dependiente</option>
                            <option value="Independiente">Independiente</option>
                        </select>
                    </div>
                    {/* Fecha de Ingreso */}
                    <div className="col-md-6 mb-3">
                        <label>Fecha de Ingreso</label>
                        <input
                            type="date"
                            className="form-control"
                            name="fechaIngreso"
                            value={beneficiario.fechaIngreso}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Estado */}
                    <div className="col-md-6 mb-3">
                        <label>Estado</label>
                        <select
                            className="form-control"
                            name="estado"
                            value={beneficiario.estado}
                            onChange={handleChange}
                            required
                        >
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                        </select>
                    </div>

                    <div className="col-md-4 mb-3">
                        <label>Nombre Responsable</label>
                        <input
                            type="text"
                            className="form-control"
                            name="responsableNombre"
                            value={beneficiario.responsableNombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label>Apellido 1 Responsable</label>
                        <input
                            type="text"
                            className="form-control"
                            name="responsableApellido1"
                            value={beneficiario.responsableApellido1}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label>Apellido 2 Responsable</label>
                        <input
                            type="text"
                            className="form-control"
                            name="responsableApellido2"
                            value={beneficiario.responsableApellido2}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Teléfono Responsable */}
                    <div className="col-md-6 mb-3">
                        <label>Teléfono Responsable</label>
                        <input
                            type="text"
                            className="form-control"
                            name="responsableTelefono" // Renombrado
                            value={beneficiario.responsableTelefono}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Dirección Responsable */}
                    <div className="col-md-6 mb-3">
                        <label>Dirección Responsable</label>
                        <input
                            type="text"
                            className="form-control"
                            name="responsableDireccion"
                            value={beneficiario.responsableDireccion}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Selección de Fondo */}
                    <div className="col-md-6 mb-3">
                        <label>Fondo</label>
                        <select
                            className="form-control"
                            name="idFondo"
                            value={beneficiario.idFondo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione</option>
                            {/* Opciones de AddBeneficiario */}
                            <option value="1">Familiar</option>
                            <option value="2">CONAPAM</option>
                            <option value="3">Junta Protección Social</option>
                        </select>
                    </div>
                    {/* Selección de Pensión */}
                    <div className="col-md-6 mb-3">
                        <label>Pensión</label>
                        <select
                            className="form-control"
                            name="idPension"
                            value={beneficiario.idPension}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione</option>
                            {/* Opciones de AddBeneficiario */}
                            <option value="1">RNC</option>
                            <option value="2">IVM</option>
                            <option value="0">Ninguna</option>
                        </select>
                    </div>
                    {/* Presupuesto */}
                    <div className="col-md-6 mb-3">
                        <label>Presupuesto</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            name="presupuesto"
                            value={beneficiario.presupuesto}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Foto (Actualización opcional) */}
                    <div className="col-md-6 mb-3">
                        <label>Actualizar Foto (opcional)</label>
                        <input
                            type="file"
                            className="form-control"
                            name="fotoFile"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                </div>

                {/* Botones */}
                <button type="submit" className="btn btn-primary">
                    Guardar Cambios
                </button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate("/beneficiarios")} // Corregido a /beneficiarios
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
}