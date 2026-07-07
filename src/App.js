import { useState } from "react";

const API_BASE = "https://ykl4zu5cak.execute-api.us-east-1.amazonaws.com/dev";

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
  const [activeAction, setActiveAction] = useState("create");
  const [createForm, setCreateForm] = useState({});
  const [updateForm, setUpdateForm] = useState({});
  const [readId, setReadId] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const service = SERVICES[active];
  const createFields = service.fields.filter((field) => field.name !== service.idField);

  const buildEmptyForm = (nextService) =>
    Object.fromEntries(
      nextService.fields
        .filter((field) => field.name !== nextService.idField)
        .map((field) => [field.name, ""])
    );

  const resetForms = (nextService = service) => {
    setCreateForm(buildEmptyForm(nextService));
    setUpdateForm(buildEmptyForm(nextService));
    setReadId("");
    setUpdateId("");
    setDeleteId("");
    setResult(null);
  };

  const switchService = (key) => {
    const nextService = SERVICES[key];
    setActive(key);
    setActiveAction("create");
    resetForms(nextService);
  };

  const call = async (fn) => {
    setLoading(true);
    setResult(null);
    try {
      await fn();
    } catch (e) {
      setResult({ status: "ERR", data: { error: e.message }, action: activeAction });
    } finally {
      setLoading(false);
    }
  };

  const normalizeItem = (data) => {
    if (data && typeof data === "object" && data.Item) return data.Item;
    if (Array.isArray(data)) return data[0] || {};
    return data || {};
  };

  const crear = () =>
    call(async () => {
      const payload = Object.fromEntries(
        Object.entries(createForm).filter(([, value]) => value !== "")
      );
      const res = await fetch(`${API_BASE}/${active}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => null);
      setResult({ status: res.status, data: body, action: "create" });
      if (res.status >= 200 && res.status < 300) {
        setCreateForm(buildEmptyForm(service));
      }
    });

  const consultar = () =>
    call(async () => {
      const res = await fetch(`${API_BASE}/${active}/${encodeURIComponent(readId)}`);
      const body = await res.json().catch(() => null);
      setResult({ status: res.status, data: body, action: "read" });
      if (res.status >= 200 && res.status < 300) {
        const item = normalizeItem(body);
        if (item && typeof item === "object") {
          const nextUpdateForm = Object.fromEntries(
            createFields.map((field) => [field.name, item[field.name] ?? ""])
          );
          setUpdateForm(nextUpdateForm);
          setUpdateId(readId);
        }
      }
    });

  const actualizar = () =>
    call(async () => {
      const payload = Object.fromEntries(
        Object.entries(updateForm).filter(([, value]) => value !== "")
      );
      const res = await fetch(`${API_BASE}/${active}/${encodeURIComponent(updateId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => null);
      setResult({ status: res.status, data: body, action: "update" });
      if (res.status >= 200 && res.status < 300) {
        setUpdateForm(buildEmptyForm(service));
        setUpdateId("");
      }
    });

  const eliminar = () =>
    call(async () => {
      const res = await fetch(`${API_BASE}/${active}/${encodeURIComponent(deleteId)}`, {
        method: "DELETE",
      });
      const body = await res.json().catch(() => null);
      setResult({ status: res.status, data: body, action: "delete" });
      if (res.status >= 200 && res.status < 300) {
        setDeleteId("");
      }
    });

  const ok = result && result.status >= 200 && result.status < 300;
  const actionLabel = {
    create: "Crear",
    read: "Consultar",
    update: "Actualizar",
    delete: "Eliminar",
  }[result?.action] || "Operación";

  return (
    <div className="page">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: "Inter", -apple-system, system-ui, sans-serif; }
        .page {
          min-height: 100vh;
          background: linear-gradient(135deg, #07111f 0%, #101b2d 45%, #1b2b45 100%);
          color: #f5f7fb;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px 16px;
        }
        .card {
          width: 100%;
          max-width: 560px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 22px;
          padding: 24px;
          backdrop-filter: blur(16px);
          box-shadow: 0 22px 60px rgba(0,0,0,0.35);
        }
        .hero {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: flex-start;
          margin-bottom: 18px;
        }
        h1 {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .lead {
          color: #9aa7bf;
          font-size: 13.5px;
          margin-top: 6px;
          line-height: 1.55;
        }
        .chip {
          background: rgba(255,255,255,0.08);
          color: #d9e2f5;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px;
          padding: 8px 11px;
          font-size: 12px;
          white-space: nowrap;
        }
        .tabs {
          display: flex;
          gap: 8px;
          background: rgba(255,255,255,0.06);
          padding: 5px;
          border-radius: 12px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .tab {
          flex: 1;
          min-width: 90px;
          padding: 10px 8px;
          border: none;
          border-radius: 9px;
          background: transparent;
          color: #9aa7bf;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .tab.on {
          background: var(--accent);
          color: #0d1017;
        }
        .tab:not(.on):hover { color: #eef1f6; }

        .action-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 16px;
        }
        .action-btn {
          border: 1px solid rgba(255,255,255,0.12);
          background: transparent;
          color: #dce5f4;
          border-radius: 999px;
          padding: 8px 10px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .action-btn.active {
          background: var(--accent);
          color: #09111c;
          border-color: transparent;
        }
        .section-card {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(0,0,0,0.18);
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 14px;
        }
        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6f7a92;
          margin-bottom: 10px;
          display: block;
        }
        input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 12px 13px;
          color: #f5f7fb;
          font-size: 14px;
          font-family: inherit;
          margin-bottom: 10px;
          transition: border-color 0.18s ease;
        }
        input::placeholder { color: #6f778c; }
        input:focus { outline: none; border-color: var(--accent); }

        .btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: transform 0.16s ease, filter 0.16s ease, opacity 0.16s ease;
        }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .btn:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.06); }
        .btn-primary { background: var(--accent); color: #0b121d; }
        .btn-danger { background: #ef6b6b; color: white; }
        .btn-secondary {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.16);
          color: #edf2f8;
        }
        .query-row { display: flex; gap: 10px; }
        .query-row input { margin-bottom: 0; }
        .query-row .btn-secondary { width: auto; padding: 12px 18px; }

        .result {
          margin-top: 14px;
          border-radius: 13px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .result-head {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          font-size: 12px;
          font-weight: 700;
        }
        .result-head.ok { background: rgba(58,207,142,0.14); color: #3ecf8e; }
        .result-head.bad { background: rgba(240,97,91,0.14); color: #f0615b; }
        .result pre {
          margin: 0;
          padding: 14px;
          background: rgba(0,0,0,0.3);
          font-family: "SF Mono", ui-monospace, monospace;
          font-size: 12.3px;
          line-height: 1.6;
          color: #dce4ef;
          overflow-x: auto;
        }
        .loading {
          margin-top: 16px;
          text-align: center;
          color: #7f8aa0;
          font-size: 13px;
        }
        .helper {
          font-size: 12px;
          color: #7f8aa0;
          margin-top: 6px;
          line-height: 1.45;
        }
        @media (max-width: 560px) {
          .action-row { grid-template-columns: repeat(2, 1fr); }
          .hero { flex-direction: column; }
        }
      `}</style>

      <div className="card" style={{ "--accent": service.accent }}>
        <div className="hero">
          <div>
            <h1>Panel CRUD de {service.label.toLowerCase()}</h1>
            <p className="lead">
              Gestiona registros con una experiencia más clara para crear, leer,
              actualizar y eliminar directamente desde la API.
            </p>
          </div>
          <div className="chip">GET · POST · PUT · DELETE</div>
        </div>

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

        <div className="action-row">
          {[
            { key: "create", label: "Crear" },
            { key: "read", label: "Consultar" },
            { key: "update", label: "Actualizar" },
            { key: "delete", label: "Eliminar" },
          ].map((action) => (
            <button
              key={action.key}
              className={`action-btn ${activeAction === action.key ? "active" : ""}`}
              onClick={() => {
                setActiveAction(action.key);
                setResult(null);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>

        {activeAction === "create" && (
          <div className="section-card">
            <span className="section-label">Crear {service.label.toLowerCase()}</span>
            {createFields.map((field) => (
              <input
                key={field.name}
                placeholder={field.label}
                value={createForm[field.name] || ""}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, [field.name]: e.target.value }))
                }
              />
            ))}
            <button className="btn btn-primary" onClick={crear} disabled={loading}>
              {loading ? "Procesando…" : `Guardar ${service.label.toLowerCase()}`}
            </button>
            <p className="helper">
              El ID se genera automáticamente en DynamoDB, así que no necesitas escribirlo aquí.
            </p>
          </div>
        )}

        {activeAction === "read" && (
          <div className="section-card">
            <span className="section-label">Consultar por ID</span>
            <div className="query-row">
              <input
                placeholder={service.idField}
                value={readId}
                onChange={(e) => setReadId(e.target.value)}
              />
              <button
                className="btn btn-secondary"
                onClick={consultar}
                disabled={loading || !readId}
              >
                Buscar
              </button>
            </div>
            <p className="helper">
              Usa esta vista para recuperar un registro existente y prepararlo para editarlo.
            </p>
          </div>
        )}

        {activeAction === "update" && (
          <div className="section-card">
            <span className="section-label">Actualizar registro</span>
            <input
              placeholder={service.idField}
              value={updateId}
              onChange={(e) => setUpdateId(e.target.value)}
            />
            {createFields.map((field) => (
              <input
                key={field.name}
                placeholder={field.label}
                value={updateForm[field.name] || ""}
                onChange={(e) =>
                  setUpdateForm((prev) => ({ ...prev, [field.name]: e.target.value }))
                }
              />
            ))}
            <button className="btn btn-primary" onClick={actualizar} disabled={loading || !updateId}>
              {loading ? "Procesando…" : "Actualizar registro"}
            </button>
            <p className="helper">
              Primero consulta un registro por ID y luego actualiza sus campos.
            </p>
          </div>
        )}

        {activeAction === "delete" && (
          <div className="section-card">
            <span className="section-label">Eliminar registro</span>
            <input
              placeholder={service.idField}
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
            />
            <button className="btn btn-danger" onClick={eliminar} disabled={loading || !deleteId}>
              {loading ? "Procesando…" : "Eliminar registro"}
            </button>
            <p className="helper">
              Esta acción elimina el elemento seleccionado por su identificador.
            </p>
          </div>
        )}

        {loading && <div className="loading">Procesando operación…</div>}

        {result && !loading && (
          <div className="result">
            <div className={`result-head ${ok ? "ok" : "bad"}`}>
              {ok ? "Éxito" : "Error"} · {actionLabel} · {result.status}
            </div>
            <pre>{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}