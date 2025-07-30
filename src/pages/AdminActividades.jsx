import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

function AdminActividades() {
  const [usuario, setUsuario] = useState(null);
  const [actividades, setActividades] = useState([]);
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
  });

 useEffect(() => {
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
  if (["SECRETARIO", "ADMIN"].includes(usuarioGuardado?.rol)) {
    setUsuario(usuarioGuardado);
    cargarActividades(usuarioGuardado.banda.id);
  }
}, []);

  const cargarActividades = async (bandaId) => {
    try {
const res = await api.get(`/api/actividades?bandaId=${bandaId}`);
      setActividades(res.data);
    } catch (err) {
      console.error("Error al cargar", err);
    }
  };

  const handleInputChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const crearActividad = async () => {
    try {
await api.post("/api/actividades", {
        ...formulario,
        banda: { id: usuario.banda.id },
      });
      setFormulario({ titulo: "", descripcion: "", fecha: "" });
      cargarActividades(usuario.banda.id);
    } catch (err) {
      console.error("Error al crear", err);
    }
  };

  const eliminarActividad = async (id) => {
    try {
await api.delete(`/api/actividades/${id}`);
      cargarActividades(usuario.banda.id);
    } catch (err) {
      console.error("Error al eliminar", err);
    }
  };

  if (!usuario || usuario.rol !== "SECRETARIO") {
    return <p>No tienes acceso a esta página.</p>;
  }

  return (
    
  <div
  className="min-h-screen bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/img/banda_conciertos.jpg')" }}
>
    <div className="bg-white bg-opacity-70 min-h-screen p-4">
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
      <button
        onClick={() => navigate("/")}
        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Volver al Planner
      </button>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">Gestión de Actividades</h2>

      <div className="mb-6 flex flex-wrap gap-2">
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={formulario.titulo}
          onChange={handleInputChange}
          className="border border-gray-300 bg-white p-2 rounded w-full sm:w-auto"
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={formulario.descripcion}
          onChange={handleInputChange}
          className="border border-gray-300 bg-white p-2 rounded w-full sm:w-auto"
        />
        <input
          type="datetime-local"
          name="fecha"
          value={formulario.fecha}
          onChange={handleInputChange}
          className="border border-gray-300 bg-white p-2 rounded w-full sm:w-auto"
        />
        <button
          onClick={crearActividad}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Agregar
        </button>
      </div>

      <table className="min-w-full bg-white border rounded shadow-sm text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Título</th>
            <th className="border px-4 py-2">Fecha</th>
            <th className="border px-4 py-2">Descripción</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {actividades.map((act) => (
            <tr key={act.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{act.titulo}</td>
              <td className="border px-4 py-2">{new Date(act.fecha).toLocaleString()}</td>
              <td className="border px-4 py-2">{act.descripcion}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => eliminarActividad(act.id)}
                  className="text-red-500 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  </div>
);

}

export default AdminActividades;
