const leadController = require('../src/controllers/leadController');

// Função para ler o body (pois sem Express não há req.body automaticamente)
const parseBody = (req) =>
  new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body ? JSON.parse(body) : {}));
  });

// Handler Serverless (Vercel)
module.exports = async (req, res) => {

  // POST - Criar lead
  if (req.method === "POST" && req.url === "/api/leads") {
    req.body = await parseBody(req);
    return leadController.create(req, res);
  }

  // GET - Listar leads
  if (req.method === "GET" && req.url === "/api/leads") {
    return leadController.list(req, res);
  }

  // GET raiz - teste rápido
  if (req.method === "GET" && req.url === "/") {
    return res.status(200).json({
      status: "online",
      message: "🚀 Backend Apex Drive conectado e operando!"
    });
  }

  // Se não bater com nada
  return res.status(404).json({ error: "Rota não encontrada" });
};
