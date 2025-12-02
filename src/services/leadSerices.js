const db = require('../db');

// --- ARMAZENAMENTO TEMPORÁRIO (MEMÓRIA) ---
// Nota: Em Serverless (Vercel), essa variável é resetada frequentemente.
// É perfeita para testes locais, mas em produção exige o Banco de Dados.
const memoryLeads = [];

const leadService = {
    
    // Serviço para criar um novo Lead
    createLead: async (data) => {
        const { nome, email, telefone, cidade, estado, categoria } = data;

        // VALIDAÇÃO BÁSICA
        if (!nome || !email) {
            throw new Error("Nome e Email são obrigatórios.");
        }

        // --- MODO: BANCO DE DADOS (FUTURO) ---
        // Descomente abaixo quando tiver o Postgres conectado:
        /*
        const query = `
            INSERT INTO leads (nome, email, telefone, cidade, estado, categoria, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING *;
        `;
        const values = [nome, email, telefone, cidade, estado, categoria];
        const result = await db.query(query, values);
        return result.rows[0];
        */

        // --- MODO: EM MEMÓRIA (ATUAL) ---
        const newLead = {
            id: crypto.randomUUID(),
            nome,
            email,
            telefone,
            cidade,
            estado,
            categoria,
            createdAt: new Date()
        };
        
        memoryLeads.push(newLead);
        console.log("✅ Lead salvo em memória:", newLead.nome);
        return newLead;
    },

    // Serviço para listar Leads
    getAllLeads: async () => {
        // --- MODO: BANCO DE DADOS (FUTURO) ---
        /*
        const result = await db.query('SELECT * FROM leads ORDER BY created_at DESC');
        return result.rows;
        */

        // --- MODO: EM MEMÓRIA (ATUAL) ---
        return memoryLeads;
    }
};

module.exports = leadService;