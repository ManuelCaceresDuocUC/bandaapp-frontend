import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { api } from "../api/api";


function CalendarioActividades() {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    const fechaISO = fechaSeleccionada.toISOString().split('T')[0];

    axios.get(`https://bandaapp-backend.onrender.com/api/actividades?fecha=${fechaISO}`)
      .then(res => setActividades(res.data))
      .catch(err => console.error(err));
  }, [fechaSeleccionada]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-6">
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-6 border border-gray-300">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-4">
          Actividades del día
        </h2>
        
        <div className="flex justify-center mb-6">
          <DatePicker
            selected={fechaSeleccionada}
            onChange={(date) => setFechaSeleccionada(date)}
            className="border border-gray-400 rounded px-3 py-2 shadow-sm"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <ul className="space-y-3">
          {actividades.length > 0 ? (
            actividades.map(act => (
              <li key={act.id} className="bg-white shadow-md border border-gray-300 rounded p-4 hover:shadow-lg transition">
                <p className="text-lg font-semibold text-green-700">{act.nombre}</p>
                <p className="text-gray-700">{act.descripcion}</p>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600 font-medium">No hay actividades para esta fecha.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default CalendarioActividades;
