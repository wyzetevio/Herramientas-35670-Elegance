import { useState } from "react";
import { tienda } from "../Services/Locations";

export default function MapaGPS() {
  const [user, setUser] = useState(null);

  const getGPS = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta GPS");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUser({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        alert("Error GPS: " + err.message);
      }
    );
  };

  // 🧭 NUEVO: abrir ruta en Google Maps
  const abrirRuta = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${tienda.lat},${tienda.lon}`,
      "_blank"
    );
  };

  return (
    <div>
      <h3 className="text-center fw-bold">
        📍 {tienda.nombre}
      </h3>
      <h3 className="text-center fw-bold">
        Nos pueden encontrar en:
      </h3>
      <div className="text-center mb-3">
        <button className="btn btn-dark me-2" onClick={getGPS}>
          📡 Mostrar mi ubicación
        </button>

        {/* 🧭 NUEVO BOTÓN */}
        <button className="btn btn-primary" onClick={abrirRuta}>
          🧭 Cómo llegar
        </button>
      </div>

      {user && (
        <p className="text-center">
          👤 Tú: {user.lat}, {user.lon}
        </p>
      )}

      {/* MAPA DE LA TIENDA */}
      <iframe
        title="Mapa tienda"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3899.799664356013!2d-76.9714698!3d-12.1940306!2m3!1f0!2f0!2f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105b9a26836ac01%3A0x4fd233c0d43ca479!2sUniversidad%20Tecnol%C3%B3gica%20del%20Per%C3%BA%20UTP!5e0!3m2!1ses!2spe!4v1782857350658!5m2!1ses!2spe"
        width="100%"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
      />
    </div>
  );
}
