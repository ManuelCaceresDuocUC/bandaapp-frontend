import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

function Actividades() {
  const [actividadesPorDia, setActividadesPorDia] = useState({});
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      const usuarioParseado = JSON.parse(usuarioGuardado);
      setUsuario(usuarioParseado);
    }
  }, []);

  useEffect(() => {
    const fetchActividades = async () => {
      if (!usuario) return;

      try {
        
        const respuesta = await api.get(`/api/actividades?bandaId=${usuario.banda.id}`);

        const todas = respuesta.data;

        const hoy = new Date();
        const en14Dias = new Date();
        en14Dias.setDate(hoy.getDate() + 14);

        const actividadesFiltradas = todas.filter((actividad) => {
          const fechaActividad = new Date(actividad.fecha);
          return fechaActividad >= hoy && fechaActividad <= en14Dias;
        });

        actividadesFiltradas.sort(
          (a, b) => new Date(a.fecha) - new Date(b.fecha)
        );

        const agrupadas = {};
        actividadesFiltradas.forEach((actividad) => {
          const fechaKey = new Date(actividad.fecha).toLocaleDateString(
            "es-CL",
            {
              weekday: "long",
              day: "numeric",
              month: "long",
            }
          );
          if (!agrupadas[fechaKey]) agrupadas[fechaKey] = [];
          agrupadas[fechaKey].push(actividad);
        });

        setActividadesPorDia(agrupadas);
      } catch (error) {
        console.error("Error al cargar actividades", error);
      }
    };

    fetchActividades();
  }, [usuario]);

return (
  <div
    className="min-h-screen bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/img/banda_conciertos.jpg')" }}
  >
    {/* Contenedor blanco opaco encima del fondo */}
    <div className="bg-white bg-opacity-70 min-h-screen">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Botones solo para admin/secretario */}
        {["ADMIN", "SECRETARIO"].includes(usuario?.rol) && (
          <div className="bg-white shadow-md rounded-lg p-4 text-center space-x-2">
            <button
              onClick={() => navigate("/admin")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Ir al Panel de Actividades
            </button>
            
          </div>
        )}
        <button
              onClick={() => navigate("/asistencia")}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Ir a Registro de Asistencia
            </button>
        <button
              onClick={() => navigate("/ver-asistencia")}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Ver Asistencia del Día
            </button>
            <button
              onClick={() => navigate("/estados")}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Ir a Modificar Asistencia
            </button>

        {/* Título principal */}
        <div className="bg-white shadow-md rounded-lg p-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Planner de Actividades (14 días)
          </h2>
        </div>

        {/* Lista de actividades */}
        {Object.entries(actividadesPorDia).length > 0 ? (
          Object.entries(actividadesPorDia).map(([fecha, actividades]) => (
            <div
              key={fecha}
              className="bg-white shadow-lg border border-gray-300 rounded-xl p-4"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3 capitalize">
                {fecha}
              </h3>
              <ul className="space-y-2">
                {actividades.map((actividad) => (
                  <li
                    key={actividad.id}
                    className="border-l-4 border-green-500 pl-3"
                  >
                    <p className="text-lg font-medium text-gray-800">
                      {actividad.titulo}
                    </p>
                    <p className="text-sm text-gray-700">
                      {actividad.descripcion}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-800 bg-white rounded p-3 shadow-md">
            No hay actividades programadas en los próximos 14 días.
          </p>
        )}
      </div>
    </div>
  </div>
);



}

export default Actividades;
