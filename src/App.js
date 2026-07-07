import { useEffect, useState } from "react";

const MOCK_CURSOS = [
  { cursoId: "c-001", nombre: "Arquitectura de Microservicios", creditos: "4" },
  { cursoId: "c-002", nombre: "Bases de Datos NoSQL con DynamoDB", creditos: "3" },
  { cursoId: "c-003", nombre: "Computación Serverless en AWS", creditos: "4" },
  { cursoId: "c-004", nombre: "Diseño de APIs REST", creditos: "3" },
];

const USUARIOS_EXISTENTES = new Set(["existente@correo.com"]);

function simularInscripcion(email) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const usuarioNuevo = !USUARIOS_EXISTENTES.has(email.toLowerCase());
      USUARIOS_EXISTENTES.add(email.toLowerCase());
      resolve({ usuarioNuevo, mensaje: "Correo enviado" });
    }, 900);
  });
}

export default function App() {
  const [cursos, setCursos] = useState([]);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setCursos(MOCK_CURSOS);
      setCargandoCatalogo(false);
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="page">
      <Estilos />

      <header className="masthead">
        <div className="masthead-inner">
          <span className="eyebrow">Periodo 2026 · Inscripciones abiertas</span>
          <h1 className="wordmark">
            Cátedra<span className="wordmark-mark">.</span>
          </h1>
          <p className="tagline">
            Elige un curso del catálogo. Te enviamos el temario y los créditos a
            tu correo. Si es tu primera vez, entras con una bienvenida.
          </p>
        </div>
      </header>

      <main className="catalogo-wrap">
        {cargandoCatalogo && <EstadoCarga />}

        {!cargandoCatalogo && cursos.length > 0 && (
          <div className="catalogo">
            {cursos.map((curso, i) => (
              <TarjetaCurso
                key={curso.cursoId ?? i}
                curso={curso}
                indice={i}
                onSeleccionar={() => setSeleccionado(curso)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="pie">
        <span>
          {cursos.length} {cursos.length === 1 ? "curso disponible" : "cursos disponibles"}
        </span>
        <span className="pie-marca">Arquitectura serverless · AWS</span>
      </footer>

      {seleccionado && (
        <PanelInscripcion curso={seleccionado} onCerrar={() => setSeleccionado(null)} />
      )}
    </div>
  );
}

function TarjetaCurso({ curso, indice, onSeleccionar }) {
  const numero = String(indice + 1).padStart(2, "0");

  return (
    <button className="curso" onClick={onSeleccionar}>
      <span className="curso-num">{numero}</span>
      <span className="curso-cuerpo">
        <span className="curso-nombre">{curso.nombre}</span>
        <span className="curso-meta">
          {curso.creditos ? `${curso.creditos} créditos` : "Créditos por definir"}
        </span>
      </span>
      <span className="curso-flecha" aria-hidden="true">
        Inscribirme →
      </span>
    </button>
  );
}

function PanelInscripcion({ curso, onCerrar }) {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState("idle");
  const [respuesta, setRespuesta] = useState(null);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const enviar = async () => {
    if (!emailValido) return;
    setEstado("enviando");
    const data = await simularInscripcion(email);
    setRespuesta(data);
    setEstado("ok");
  };

  return (
    <div className="overlay" onClick={onCerrar}>
      <div
        className="panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="panel-cerrar" onClick={onCerrar} aria-label="Cerrar">
          ×
        </button>

        {estado !== "ok" && (
          <>
            <span className="panel-eyebrow">Confirmar inscripción</span>
            <h2 className="panel-titulo">{curso.nombre}</h2>
            <p className="panel-detalle">
              {curso.creditos ? `${curso.creditos} créditos · ` : ""}
              Ingresa tu correo y te enviamos la información del curso.
            </p>

            <label className="campo">
              <span className="campo-label">Correo electrónico</span>
              <input
                type="email"
                inputMode="email"
                autoFocus
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviar()}
                disabled={estado === "enviando"}
              />
            </label>

            <p className="panel-nota">
              Prueba con <code>existente@correo.com</code> para ver el flujo de usuario ya registrado.
            </p>

            <button className="panel-cta" onClick={enviar} disabled={!emailValido || estado === "enviando"}>
              {estado === "enviando" ? <span className="spinner" /> : "Enviarme la información"}
            </button>
          </>
        )}

        {estado === "ok" && (
          <div className="exito">
            <div className="exito-marca" aria-hidden="true">
              ✓
            </div>
            <h2 className="panel-titulo">
              {respuesta?.usuarioNuevo ? "Bienvenido a Cátedra" : "Todo listo"}
            </h2>
            <p className="panel-detalle">
              {respuesta?.usuarioNuevo
                ? `Creamos tu cuenta y te enviamos un correo de bienvenida junto con la información de "${curso.nombre}".`
                : `Enviamos la información de "${curso.nombre}" a ${email}.`}
            </p>
            <button className="panel-cta" onClick={onCerrar}>
              Volver al catálogo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EstadoCarga() {
  return (
    <div className="catalogo">
      {[0, 1, 2].map((i) => (
        <div key={i} className="curso curso-skeleton">
          <span className="sk sk-num" />
          <span className="curso-cuerpo">
            <span className="sk sk-linea-larga" />
            <span className="sk sk-linea-corta" />
          </span>
        </div>
      ))}
    </div>
  );
}

function Estilos() {
  return (
    <style>{` 
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Archivo:wght@400;500;600&display=swap');

      * { box-sizing: border-box; margin: 0; padding: 0; }

      .page {
        --ink: #1c1a17;
        --paper: #f0ebe1;
        --paper-2: #e6dfd0;
        --card: #fbf8f2;
        --accent: #7b3f2f;
        --accent-soft: #a85a44;
        --line: #d4cbb8;
        --muted: #857c6c;

        min-height: 100vh;
        background: var(--paper);
        color: var(--ink);
        font-family: 'Archivo', system-ui, sans-serif;
        display: flex;
        flex-direction: column;
      }

      .masthead {
        border-bottom: 1.5px solid var(--ink);
        padding: 56px 24px 40px;
      }
      .masthead-inner { max-width: 880px; margin: 0 auto; }

      .eyebrow {
        font-size: 12px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--accent);
        font-weight: 600;
      }
      .wordmark {
        font-family: 'Fraunces', serif;
        font-weight: 700;
        font-size: clamp(48px, 9vw, 92px);
        line-height: 0.95;
        letter-spacing: -0.02em;
        margin: 14px 0 18px;
      }
      .wordmark-mark { color: var(--accent); }
      .tagline {
        font-size: 16.5px;
        line-height: 1.55;
        max-width: 30rem;
        color: #423d34;
      }

      .catalogo-wrap {
        flex: 1;
        padding: 40px 24px 64px;
        max-width: 880px;
        margin: 0 auto;
        width: 100%;
      }

      .catalogo { display: flex; flex-direction: column; gap: 0; }

      .curso {
        display: flex;
        align-items: center;
        gap: 24px;
        width: 100%;
        text-align: left;
        background: transparent;
        border: none;
        border-bottom: 1px solid var(--line);
        padding: 26px 8px;
        cursor: pointer;
        font-family: inherit;
        color: inherit;
        transition: background 0.2s ease, padding-left 0.2s ease;
      }
      .curso:first-child { border-top: 1px solid var(--line); }
      .curso:hover { background: var(--card); padding-left: 18px; }
      .curso:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }

      .curso-num {
        font-family: 'Fraunces', serif;
        font-size: 20px;
        font-weight: 600;
        color: var(--accent);
        min-width: 34px;
      }
      .curso-cuerpo { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
      .curso-nombre {
        font-family: 'Fraunces', serif;
        font-size: clamp(20px, 3vw, 27px);
        font-weight: 600;
        line-height: 1.15;
        letter-spacing: -0.01em;
      }
      .curso-meta { font-size: 13.5px; color: var(--muted); letter-spacing: 0.02em; }
      .curso-flecha {
        font-size: 14px;
        font-weight: 600;
        color: var(--accent);
        white-space: nowrap;
        opacity: 0;
        transform: translateX(-6px);
        transition: all 0.2s ease;
      }
      .curso:hover .curso-flecha { opacity: 1; transform: translateX(0); }

      .pie {
        border-top: 1.5px solid var(--ink);
        padding: 20px 24px;
        max-width: 880px;
        margin: 0 auto;
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: 12.5px;
        letter-spacing: 0.03em;
        color: var(--muted);
      }
      .pie-marca { text-transform: uppercase; letter-spacing: 0.1em; }

      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(28,26,23,0.55);
        backdrop-filter: blur(3px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        z-index: 50;
        animation: fade 0.18s ease;
      }
      .panel {
        position: relative;
        background: var(--card);
        border: 1.5px solid var(--ink);
        border-radius: 6px;
        padding: 40px 36px 36px;
        max-width: 440px;
        width: 100%;
        box-shadow: 12px 12px 0 rgba(123,63,47,0.16);
        animation: rise 0.22s cubic-bezier(0.2,0.8,0.2,1);
      }
      .panel-cerrar {
        position: absolute;
        top: 14px;
        right: 16px;
        background: transparent;
        border: none;
        font-size: 26px;
        line-height: 1;
        color: var(--muted);
        cursor: pointer;
        font-family: inherit;
      }
      .panel-cerrar:hover { color: var(--ink); }

      .panel-eyebrow {
        font-size: 11.5px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--accent);
        font-weight: 600;
      }
      .panel-titulo {
        font-family: 'Fraunces', serif;
        font-size: 30px;
        font-weight: 600;
        line-height: 1.1;
        letter-spacing: -0.01em;
        margin: 10px 0 8px;
      }
      .panel-detalle { font-size: 14.5px; line-height: 1.55; color: #4a463d; margin-bottom: 24px; }

      .campo { display: block; margin-bottom: 14px; }
      .campo-label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--muted);
        margin-bottom: 8px;
      }
      .campo input {
        width: 100%;
        background: var(--paper);
        border: 1.5px solid var(--line);
        border-radius: 4px;
        padding: 13px 14px;
        font-size: 15px;
        font-family: inherit;
        color: var(--ink);
        transition: border-color 0.15s ease;
      }
      .campo input:focus { outline: none; border-color: var(--accent); }
      .campo input::placeholder { color: #a99f8c; }

      .panel-nota {
        font-size: 12.5px;
        color: var(--muted);
        margin-bottom: 20px;
        line-height: 1.5;
      }
      .panel-nota code {
        background: var(--paper-2);
        padding: 1px 5px;
        border-radius: 3px;
        font-size: 12px;
      }

      .panel-cta {
        width: 100%;
        background: var(--accent);
        color: var(--paper);
        border: none;
        border-radius: 4px;
        padding: 14px;
        font-size: 15px;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
        transition: background 0.18s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
      }
      .panel-cta:hover:not(:disabled) { background: var(--accent-soft); }
      .panel-cta:disabled { opacity: 0.4; cursor: not-allowed; }

      .exito { text-align: center; }
      .exito-marca {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: var(--accent);
        color: var(--paper);
        font-size: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 18px;
      }

      .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(240,235,225,0.35);
        border-top-color: var(--paper);
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      .sk {
        display: block;
        background: linear-gradient(90deg, var(--paper-2) 25%, var(--card) 50%, var(--paper-2) 75%);
        background-size: 200% 100%;
        animation: shimmer 1.4s infinite;
        border-radius: 3px;
      }
      .sk-num { width: 28px; height: 22px; }
      .sk-linea-larga { width: 62%; height: 24px; margin-bottom: 8px; }
      .sk-linea-corta { width: 30%; height: 14px; }
      .curso-skeleton { cursor: default; }
      .curso-skeleton:hover { background: transparent; padding-left: 8px; }

      @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
      @keyframes rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes shimmer { to { background-position: -200% 0; } }

      @media (prefers-reduced-motion: reduce) {
        * { animation: none !important; transition: none !important; }
      }

      @media (max-width: 520px) {
        .masthead { padding: 40px 20px 32px; }
        .curso { gap: 16px; padding: 22px 4px; }
        .curso-flecha { display: none; }
        .panel { padding: 34px 24px 28px; }
      }
    `}</style>
  );
}