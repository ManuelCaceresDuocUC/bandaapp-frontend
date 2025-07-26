import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

function Asistencia() {
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [estado, setEstado] = useState("A BORDO");
  const [motivo, setMotivo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem("usuario");
    if (u) {
      setUsuario(JSON.parse(u));
    }
  }, []);

  const registrarAsistencia = async () => {
    setMensaje("");
    setCargando(true);

    try {
      if (estado === "A BORDO") {
        if (!navigator.geolocation) {
          setMensaje("Tu navegador no permite geolocalización.");
          setCargando(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const { latitude, longitude } = pos.coords;
              console.log("Ubicación enviada:", latitude, longitude);
const res = await api.post("/api/asistencias/registrar", {
                usuarioId: usuario.id,
                latitud: latitude,
                longitud: longitude,
              });
              setMensaje(res.data);
            } catch (err) {
              if (err.response?.status === 403) {
                setMensaje("Estás fuera del rango permitido.");
              } else if (err.response?.status === 409) {
                setMensaje("Ya registraste tu asistencia hoy.");
              } else {
                setMensaje("Error al registrar asistencia.");
              }
            } finally {
              setCargando(false);
            }
          },
          () => {
            setMensaje("No se pudo obtener tu ubicación.");
            setCargando(false);
          }
        );
      } else {
        // Manual con motivo
        if (!motivo.trim()) {
          setMensaje("Debes ingresar el motivo del estado.");
          setCargando(false);
          return;
        }

await api.post("/api/asistencias", {
          usuario: { id: usuario.id },
          fecha: new Date().toISOString().split("T")[0],
          estado,
          observaciones: motivo,
        });

        setMensaje("Asistencia registrada correctamente.");
        setCargando(false);
      }
    } catch (err) {
      setMensaje("Error al registrar asistencia manual.");
      setCargando(false);
    }
  };

  if (!usuario) return <p>No has iniciado sesión.</p>;

 return ( 
  <div
    className="min-h-screen bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/img/banda_conciertos.jpg')" }}
  >
    {/* Capa translúcida encima del fondo */}
    <div className="bg-white bg-opacity-70 min-h-screen p-4">
      
      <button
        onClick={() => navigate("/")}
        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Volver al Planner
      </button>
      
      <h2 className="text-2xl font-bold mb-4">Registro de Asistencia</h2>

      <label className="block font-semibold mb-2">Selecciona el estado:</label>
      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      >
        <option value="A BORDO">A BORDO</option>
        <option value="AUTORIZADO">AUTORIZADO</option>
        <option value="EN COMISION">EN COMISION</option>
        <option value="CATEGORIA">CATEGORIA</option>
        <option value="PERMISO">PERMISO</option>
      </select>

      {estado !== "A BORDO" && (
        <>
          <label className="block font-semibold mb-2">Motivo:</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Escribe el motivo..."
            rows={3}
            className="w-full border p-2 rounded mb-4"
          />
        </>
      )}

      <button
        onClick={registrarAsistencia}
        disabled={cargando}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full disabled:opacity-50"
      >
        {cargando ? "Registrando..." : "Registrar Asistencia"}
      </button>

      {mensaje && (
        <p className="mt-4 text-blue-700 font-medium text-center">
          {mensaje}
        </p>
      )}
    </div>
  </div>
);

}

export default Asistencia;
