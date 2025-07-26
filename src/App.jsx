import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./pages/Login";
import Actividades from "./pages/Actividades";
import AdminActividades from "./pages/AdminActividades";
import VerAsistencia from "./pages/VerAsistencia";
import { Routes, Route } from "react-router-dom";
import Asistencia from "./pages/Asistencia";
import './index.css'; // O la ruta a tu archivo CSS principal
import { api } from "./api/api"; // ✅


function App() {
  const [usuario, setUsuario] = useState(null);

const cerrarSesion = () => {
  localStorage.removeItem("usuario");
  window.location.reload(); // Fuerza recarga completa
};
 useEffect(() => {
  const usuarioGuardado = localStorage.getItem("usuario");
  if (usuarioGuardado) {
    const usuarioParseado = JSON.parse(usuarioGuardado);

    api.get(`/api/usuarios/${usuarioParseado.id}`)
      .then((res) => {
        localStorage.setItem("usuario", JSON.stringify(res.data));
        setUsuario(res.data);
      })
      .catch((err) => {
        console.error("No se pudo cargar el usuario:", err);
        setUsuario(null);
      });
  }
}, []);


  if (!usuario) {
    return <Login onLogin={setUsuario} />;
  }

  return (
    <div
    className="min-h-screen bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/img/banda_conciertos.jpg')" }}
  >
    {/* Contenedor blanco opaco encima del fondo */}
    <div className="bg-white bg-opacity-70 min-h-screen">
      {/* Capa translúcida encima del fondo */}
      <div className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm z-0"></div>
      
      {/* Contenido principal encima de la capa translúcida */}
      
      <div className="relative z-10 p-4">
        <div className= "flex items-center justify-center gap-6 w-full">
        <img src="/logo_musicos.png" alt="Logo izquierdo" className="w-16 h-16 hidden sm:block" />
        <h1 className="text-3xl font-bold text-center mt-4 text-gray-900 drop-shadow">
          Bienvenido {usuario.nombre}
        </h1>  <img src="/logo_musicos.png" alt="Logo derecho" className="w-16 h-16 hidden sm:block" />
     <button
    onClick={cerrarSesion}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
  >
    Cerrar Sesión
  </button>
     </div>
        <p className="text-sm text-center text-gray-700">Rol: {usuario.rol}</p>
        <p className="text-sm text-center text-gray-700 mb-4">
          Banda: {usuario.banda?.nombre}
        </p>

        <Routes>
          <Route path="/asistencia" element={<Asistencia />} />
           <Route path="/ver-asistencia" element={<VerAsistencia />} />
          <Route path="/" element={<Actividades />} />
          {["ADMIN", "DIRECTOR", "SECRETARIO"].includes(usuario.rol) && (
            <>
              <Route path="/admin" element={<AdminActividades />} />
              
              <Route path="/login" element={<Login onLogin={setUsuario} />} />

            </>
          )}
        </Routes>
      </div>
    </div>
    </div>
  );
}

export default App;
