import { useState } from "react";

const API_BASE = "https://61gdfto283.execute-api.us-west-2.amazonaws.com/dev";

const SERVICES = {
  usuarios: {
    label: "Usuarios",
    accent: "#5B8DEF",
    idField: "usuarioId",
    fields: [
      { name: "usuarioId", label: "ID de usuario" },
      { name: "nombre", label: "Nombre" },
      { name: "email", label: "Correo" },
    ],
  },
  cursos: {
    label: "Cursos",
    accent: "#E0913A",
    idField: "cursoId",
    fields: [
      { name: "cursoId", label: "ID de curso" },
      { name: "nombre", label: "Nombre del curso" },
      { name: "creditos", label: "Créditos" },
    ],
  },
  inscripciones: {
    label: "Inscripciones",
    accent: "#8B7CE8",
    idField: "inscripcionId",
    fields: [
      { name: "inscripcionId", label: "ID de inscripción" },
      { name: "usuarioId", label: "ID de usuario" },
      { name: "cursoId", label: "ID de curso" },
    ],
  },
};

export default function App() {
  const [active, setActive] = useState("usuarios");
  const [form, setForm] = useState({});
  const [queryId, setQueryId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const service = SERVICES[active];

  const switchService = (key) => {
    setActive(key);
    setForm({});
    setQueryId("");
    setResult(null);
  };

  const call = async (fn) => {
    setLoading(true);
    setResult(null);
    try {
      await fn();
    } catch (e) {
      setResult({ status: "ERR", data: { error: e.message } });
    } finally {
      setLoading(false);
    }
  };

  const crear = () =>
    call(async () => {
      const res = await fetch(`${API_BASE}/${active}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setResult({ status: res.status, data: await res.json() });
      if (res.status === 201) setForm({});
    });

  const consultar = () =>
    call(async () => {
      const res = await fetch(`${API_BASE}/${active}/${queryId}`);
      setResult({ status: res.status, data: await res.json() });
    });

  const ok = result && result.status >= 200 && result.status < 300;

  return (
    <div className="page">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .page {
          min-height: 100vh;
          background: radial-gradient(circle at 20% 0%, #1a2035 0%, #0d1017 55%);
          color: #eef1f6;
          font-family: "Inter", -apple-system, system-ui, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }
        .card {
          width: 100%;
          max-width: 460px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 32px;
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        h1 {
          font-size: 21px;
          font-weight: 650;
          letter-spacing: -0.02em;
        }
        .lead {
          color: #8b93a7;
          font-size: 13.5px;
          margin: 6px 0 24px;
          line-height: 1.5;
        }
        .tabs {
          display: flex;
          gap: 6px;
          background: rgba(0,0,0,0.25);
          padding: 4px;
          border-radius: 10px;
          margin-bottom: 24px;
        }
        .tab {
          flex: 1;
          padding: 9px 8px;
          border: none;
          border-radius: 7px;
          background: transparent;
          color: #8b93a7;
          font-size: 13px;
          font-weight: 550;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .tab.on {
          background: var(--accent);
          color: #0d1017;
        }
        .tab:not(.on):hover { color: #eef1f6; }

        .section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #6b7285;
          margin-bottom: 10px;
          display: block;
        }
        input {
          width: 100%;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          padding: 12px 13px;
          color: #eef1f6;
          font-size: 14px;
          font-family: inherit;
          margin-bottom: 10px;
          transition: border-color 0.18s ease;
        }
        input::placeholder { color: #5a6172; }
        input:focus { outline: none; border-color: var(--accent); }

        .btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: filter 0.18s ease, opacity 0.18s ease;
        }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .btn-primary { background: var(--accent); color: #0d1017; }
        .btn-primary:hover:not(:disabled) { filter: brightness(1.1); }

        .divider {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 26px 0;
        }
        .query-row { display: flex; gap: 10px; }
        .query-row input { margin-bottom: 0; }
        .btn-secondary {
          width: auto;
          padding: 12px 22px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          color: #eef1f6;
        }
        .btn-secondary:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }

        .result {
          margin-top: 22px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .result-head {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          font-size: 12px;
          font-weight: 600;
        }
        .result-head.ok { background: rgba(58,207,142,0.14); color: #3ecf8e; }
        .result-head.bad { background: rgba(240,97,91,0.14); color: #f0615b; }
        .result pre {
          margin: 0;
          padding: 14px;
          background: rgba(0,0,0,0.35);
          font-family: "SF Mono", ui-monospace, monospace;
          font-size: 12.5px;
          line-height: 1.6;
          color: #c4ccd6;
          overflow-x: auto;
        }
        .loading {
          margin-top: 22px;
          text-align: center;
          color: #6b7285;
          font-size: 13px;
        }
      `}</style>

      <div className="card" style={{ "--accent": service.accent }}>
        <h1>Inscripción de cursos</h1>
        <p className="lead">
          Cada servicio escribe y consulta en su propia tabla DynamoDB, aislada
          del resto.
        </p>

        <div className="tabs">
          {Object.entries(SERVICES).map(([key, s]) => (
            <button
              key={key}
              className={`tab ${key === active ? "on" : ""}`}
              style={key === active ? { "--accent": s.accent } : undefined}
              onClick={() => switchService(key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <span className="section-label">Crear {service.label.toLowerCase()}</span>
        {service.fields.map((f) => (
          <input
            key={f.name}
            placeholder={f.label}
            value={form[f.name] || ""}
            onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
          />
        ))}
        <button
          className="btn btn-primary"
          onClick={crear}
          disabled={loading || !form[service.idField]}
        >
          Guardar registro
        </button>

        <div className="divider" />

        <span className="section-label">Consultar por ID</span>
        <div className="query-row">
          <input
            placeholder={service.idField}
            value={queryId}
            onChange={(e) => setQueryId(e.target.value)}
          />
          <button
            className="btn btn-secondary"
            onClick={consultar}
            disabled={loading || !queryId}
          >
            Buscar
          </button>
        </div>

        {loading && <div className="loading">Procesando…</div>}

        {result && !loading && (
          <div className="result">
            <div className={`result-head ${ok ? "ok" : "bad"}`}>
              {ok ? "OK" : "Error"} · {result.status}
            </div>
            <pre>{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}