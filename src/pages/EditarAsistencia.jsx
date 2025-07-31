import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditarAsistencia() {
  const [asistencias, setAsistencias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/asistencias/hoy").then((res) => {
      setAsistencias(res.data);
    });
  }, []);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("usuario"));
    if (!u || (u.rol !== "ADMIN" && u.rol !== "SECRETARIO")) {
      navigate("/no-autorizado");
    }
  }, [navigate]);

  const actualizarEstado = (id, nuevoEstado) => {
    axios
      .put(`/api/asistencias/${id}`, { nuevoEstado })
      .then(() => {
        setAsistencias((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, estado: nuevoEstado } : a
          )
        );
      });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/img/banda_conciertos.jpg')" }}
    >
      <div className="bg-white bg-opacity-70 min-h-screen p-4">
        <button
          onClick={() => navigate("/")}
          className="mb-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Volver al Planner
        </button>

        <h2 className="text-2xl font-bold mb-6">Modificar Estado de Asistencia</h2>

        <table className="min-w-full bg-white border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Estado actual</th>
              <th className="border px-4 py-2">Modificar</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((a) => (
              <tr key={a.id}>
                <td className="border px-4 py-2">{a.usuario.nombre}</td>
                <td className="border px-4 py-2">{a.estado}</td>
                <td className="border px-4 py-2">
                  <select
                    value={a.estado}
                    onChange={(e) => actualizarEstado(a.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="A BORDO">A BORDO</option>
                    <option value="PERMISO">PERMISO</option>
                    <option value="CATEGORIA">CATEGORIA</option>
                    <option value="AUTORIZADO">LICENCIA</option>
                    <option value="COMISION">INASISTENCIA</option>
                    {/* Puedes agregar más si es necesario */}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EditarAsistencia;
