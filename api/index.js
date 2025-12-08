// api/index.js
const leadController = require('../src/controllers/leadController');

// parseBody com captura de erros (retorna objeto ou lança erro)
const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        const parsed = JSON.parse(body);
        return resolve(parsed);
      } catch (err) {
        return reject(new Error("Invalid JSON payload"));
      }
    });
    req.on("error", (err) => reject(err));
  });

// normaliza caminho (remove query string, trailing slash)
const getPath = (req) => {
  const raw = req.url || "/";
  const path = raw.split("?")[0];
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
};

module.exports = async (req, res) => {
  // Força JSON em todas as respostas
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  try {
    const path = getPath(req);

    // POST /api/leads  -> internamente path será '/leads' quando o arquivo estiver em /api
    if (req.method === "POST" && (path === "/leads" || path === "/api/leads")) {
      try {
        req.body = await parseBody(req);
      } catch (err) {
        console.error("Parse body error:", err.message);
        return res.status(400).end(JSON.stringify({
          success: false,
          message: "JSON inválido no corpo da requisição."
        }));
      }
      return leadController.create(req, res);
    }

    // GET /api/leads
    if (req.method === "GET" && (path === "/leads" || path === "/api/leads")) {
      return leadController.list(req, res);
    }

    // GET / (raiz do handler)
    if (req.method === "GET" && (path === "/" || path === "/api")) {
      return res.status(200).end(JSON.stringify({
        status: "online",
        message: "🚀 Backend Apex Drive conectado e operando!"
      }));
    }

    // rota não encontrada
    return res.status(404).end(JSON.stringify({ success: false, message: "Rota não encontrada" }));

  } catch (err) {
    // Qualquer erro não esperado aqui deve retornar JSON (evita página de erro em texto)
    console.error("Unhandled server error:", err && err.stack ? err.stack : err);
    res.statusCode = 500;
    return res.end(JSON.stringify({
      success: false,
      message: "Erro interno do servidor."
    }));
  }
};
