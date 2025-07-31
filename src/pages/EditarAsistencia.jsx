import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EditarAsistencia() {
  const [asistencias, setAsistencias] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

 useEffect(() => {
  const u = JSON.parse(localStorage.getItem("usuario"));
  if (!u || (u.rol !== "ADMIN" && u.rol !== "SECRETARIO")) {
    navigate("/no-autorizado");
    return;
  }

  setUsuario(u); // ✅ Guarda el usuario en estado para usarlo en el renderizado

  axios.get(`https://bandaapp-backend.onrender.com/api/asistencias/hoy?bandaId=${u.banda.id}`)
    .then((res) => {
      console.log("Respuesta correcta:", res.data);
      setAsistencias(res.data); // ✅ Es un array, puedes hacer .map() sobre él
    })
    .catch((err) => {
      console.error("Error al obtener asistencias de hoy:", err);
    });
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

  if (!usuario) return null;

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

        <h2 className="text-2xl font-bold mb-4">
          Modificar asistencia - {usuario.banda.nombre}
        </h2>

        <table className="min-w-full bg-white border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Estado actual</th>
              <th className="border px-4 py-2">Modificar</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((a) => (
              <tr key={a.id}>
                <td className="border px-4 py-2">
                  {a.usuario?.nombre || a.nombre}
                </td>
                <td className="border px-4 py-2">{a.estado}</td>
                <td className="border px-4 py-2">
                  <select
                    value={a.estado}
                    onChange={(e) => actualizarEstado(a.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="A BORDO">A BORDO</option>
                    <option value="PERMISO">PERMISO</option>
                    <option value="CATEGORIA">CATEGORIA</option>
                    <option value="INASISTENCIA">INASISTENCIA</option>
                    <option value="LICENCIA">LICENCIA</option>
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
