import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

function Login({ onLogin }) {
  const [npi, setNpi] = useState("");
  const [error, setError] = useState("");
    const [password, setPassword] = useState(""); // ✅ ← esta línea faltaba

const manejarLogin = async () => {
  try {
    const respuesta = await api.post("/api/usuarios/login", {
      npi: npi.trim(),
      password: password.trim()
    });
    const usuario = respuesta.data;
    localStorage.setItem("usuario", JSON.stringify(usuario));
    onLogin(usuario);
  } catch (err) {
    setError("NPI o contraseña incorrectos");
  }
};
  return (
  <div
    className="min-h-screen bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/img/Armada-Diciembre.jpg')" }}
  >
    <div className="bg-white bg-opacity-50 min-h-screen flex items-center justify-center">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md w-full max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>

        <input
          type="npi"
          placeholder="NPI con guion y n° verificador"
          value={npi}
          onChange={(e) => setNpi(e.target.value)}
          className="p-2 rounded border w-full"
          autoComplete="off"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded border w-full"
          autoComplete="off"
        />

        <button
          type="submit"
          onClick={manejarLogin}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
        >
          Ingresar
        </button>

        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
      </div>
    </div>
  </div>
);

}

export default Login;
