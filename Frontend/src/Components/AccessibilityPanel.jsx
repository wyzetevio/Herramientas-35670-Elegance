import { useState, useEffect } from "react";
import {
  FaUniversalAccess,
  FaTimes,
  FaTextHeight,
  FaAdjust,
  FaMousePointer,
  FaEye,
  FaBars,
  FaHistory,
} from "react-icons/fa";
import { useAccessibility } from "../Context/AccessibilityContext";
import "./AccessibilityPanel.css";

function ReadingMask() {
  const [mouseY, setMouseY] = useState(window.innerHeight / 2);
  const BAND = 90;

  useEffect(() => {
    const onMove = (e) => setMouseY(e.clientY);
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      className="acc-reading-mask"
      style={{
        background: `linear-gradient(
          to bottom,
          rgba(0,0,0,0.58) 0px,
          rgba(0,0,0,0.58) ${mouseY - BAND / 2}px,
          transparent ${mouseY - BAND / 2}px,
          transparent ${mouseY + BAND / 2}px,
          rgba(0,0,0,0.58) ${mouseY + BAND / 2}px,
          rgba(0,0,0,0.58) 100%
        )`,
      }}
    />
  );
}

function LargeCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <svg
      className="acc-large-cursor"
      style={{ left: pos.x, top: pos.y }}
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
    >
      <path
        d="M7 4L7 34L13 28L17 40L24 37L20 25L29 25Z"
        fill="black"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const FONT_SIZE_LABELS = ["Normal", "Grande", "Muy grande"];
const CONTRAST_LABELS = ["Normal", "Alto contraste", "Invertido"];
const LINE_HEIGHT_LABELS = ["Normal", "Amplio", "Muy amplio"];

function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const {
    fontSize, setFontSize,
    contrast, setContrast,
    cursorLarge, setCursorLarge,
    dyslexia, setDyslexia,
    readingMask, setReadingMask,
    lineHeight, setLineHeight,
    reset,
  } = useAccessibility();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const tiles = [
    {
      id: "fontSize",
      icon: <FaTextHeight size={26} />,
      label: "Tamaño de texto",
      state: FONT_SIZE_LABELS[fontSize],
      active: fontSize > 0,
      onClick: () => setFontSize((v) => (v + 1) % 3),
    },
    {
      id: "contrast",
      icon: <FaAdjust size={26} />,
      label: "Contrastes",
      state: CONTRAST_LABELS[contrast],
      active: contrast > 0,
      onClick: () => setContrast((v) => (v + 1) % 3),
    },
    {
      id: "cursor",
      icon: <FaMousePointer size={26} />,
      label: "Cursor",
      state: cursorLarge ? "Grande" : "Normal",
      active: cursorLarge,
      onClick: () => setCursorLarge((v) => !v),
    },
    {
      id: "readingMask",
      icon: <FaEye size={26} />,
      label: "Máscara de lectura",
      state: readingMask ? "Activa" : "Inactiva",
      active: readingMask,
      onClick: () => setReadingMask((v) => !v),
    },
    {
      id: "dyslexia",
      icon: <span className="acc-tile-az">AZ</span>,
      label: "Dislexia amigable",
      state: dyslexia ? "Activa" : "Inactiva",
      active: dyslexia,
      onClick: () => setDyslexia((v) => !v),
    },
    {
      id: "lineHeight",
      icon: <FaBars size={26} />,
      label: "Interlineado",
      state: LINE_HEIGHT_LABELS[lineHeight],
      active: lineHeight > 0,
      onClick: () => setLineHeight((v) => (v + 1) % 3),
    },
  ];

  return (
    <>
      {readingMask && <ReadingMask />}
      {cursorLarge && <LargeCursor />}

      {/* Botón flotante de accesibilidad */}
      <button
        className="acc-trigger"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú de accesibilidad"
        title="Accesibilidad"
      >
        <FaUniversalAccess size={24} />
      </button>

      {/* Fondo semitransparente al abrir el panel */}
      {open && (
        <div
          className="acc-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel lateral */}
      <aside
        className={`acc-panel${open ? " acc-panel--open" : ""}`}
        aria-label="Menú de accesibilidad"
      >
        <div className="acc-panel__header">
          <FaUniversalAccess size={18} />
          <span>Menú de accesibilidad</span>
          <button
            className="acc-panel__close"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
          >
            <FaTimes />
          </button>
        </div>

        <div className="acc-panel__body">
          <div className="acc-tiles">
            {tiles.map((tile) => (
              <button
                key={tile.id}
                className={`acc-tile${tile.active ? " acc-tile--active" : ""}`}
                onClick={tile.onClick}
                title={`${tile.label}: ${tile.state}`}
              >
                <span className="acc-tile__icon">{tile.icon}</span>
                <span className="acc-tile__label">{tile.label}</span>
                {tile.active && (
                  <span className="acc-tile__badge">{tile.state}</span>
                )}
              </button>
            ))}
          </div>

          <button className="acc-reset" onClick={reset}>
            <FaHistory size={14} />
            <span>Restablecer</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AccessibilityPanel;
