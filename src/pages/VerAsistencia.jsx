import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api"; // ✅ usar cliente configurado


function VerAsistencia() {
  const [usuario, setUsuario] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const [totales, setTotales] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
  const u = localStorage.getItem("usuario");
  if (u) {
    const usuarioParseado = JSON.parse(u);
    setUsuario(usuarioParseado);

    const hoy = new Date().toISOString().split("T")[0];

    api.get(`/api/asistencias?fecha=${hoy}&bandaId=${usuarioParseado.banda.id}`)
      .then(res => {
        setAsistencias(res.data);

        const conteo = res.data.reduce((acc, a) => {
          acc[a.estado] = (acc[a.estado] || 0) + 1;
          return acc;
        }, {});

        setTotales(conteo);
      })
      .catch(err => {
        console.error("Error al cargar asistencias", err);
      });
  }
}, []);

  if (!usuario || !["ADMIN", "SECRETARIO"].includes(usuario.rol)) {
    return <p className="p-6">No tienes permiso para ver esta sección.</p>;
  }

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

      <h2 className="text-2xl font-bold mb-4">Asistencia de Hoy - {usuario.banda.nombre}</h2>

      <div className="mb-6">
        {Object.entries(totales).length > 0 ? (
          <ul className="space-y-1">
            {Object.entries(totales).map(([estado, cantidad]) => (
              <li key={estado} className="text-sm text-gray-800">
                <strong>{estado}:</strong> {cantidad}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay registros de asistencia hoy.</p>
        )}
      </div>

      <table className="min-w-full bg-white border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Estado</th>
            <th className="border px-4 py-2">Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map((a) => (
            <tr key={a.id}>
              <td className="border px-4 py-2">{a.usuario.nombre}</td>
              <td className="border px-4 py-2">{a.estado}</td>
              <td className="border px-4 py-2">{a.observaciones}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </div>

  );
}

export default VerAsistencia;
