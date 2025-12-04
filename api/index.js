const express = require('express');
const cors = require('cors');
const leadController = require('../src/controllers/leadController');

const app = express();

// --- MIDDLEWARES ---
app.use(cors()); // Permite que seu frontend acesse o backend
app.use(express.json()); // Permite ler JSON no Body da requisição

// --- ROTAS ---
app.get('/', (req, res) => {
    res.send('🚀 Apex Drive API está rodando!');
});

// Rotas de Leads
app.post('/api/leads', leadController.create);
app.get('/api/leads', leadController.list);

// --- INICIALIZAÇÃO DO SERVIDOR (LOCAL) ---
// Este bloco só roda se o arquivo for executado diretamente pelo Node
// Na Vercel, isso é ignorado e a Vercel gerencia a porta.
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`\n🚗 Servidor Apex Drive rodando na porta ${PORT}`);
        console.log(`🔗 Local: http://localhost:${PORT}`);
        console.log(`📝 POST Lead: http://localhost:${PORT}/api/leads`);
    });
}

// Exportar para a Vercel (Serverless)
module.exports = app;