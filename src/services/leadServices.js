const crypto = require('crypto'); // Necessário para randomUUID
const db = require('../db');

// Armazenamento em memória para o MVP (Volátil)
const memoryLeads = [];

const leadService = {
    
    // Cria um novo Lead
    createLead: async (data) => {
        const { nome, email, telefone, cidade, estado, categoria } = data;

        // Validação Simples
        if (!nome || !email || !telefone) {
            throw new Error("Campos obrigatórios: Nome, Email e Telefone.");
        }

        const newLead = {
            id: crypto.randomUUID(),
            nome,
            email,
            telefone,
            cidade,
            estado,
            categoria,
            data_cadastro: new Date().toISOString()
        };

        // --- Futuro Postgres ---
        /*
        const query = `
            INSERT INTO leads (nome, email, telefone, cidade, estado, categoria)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [nome, email, telefone, cidade, estado, categoria];

        const result = await db.query(query, values);
        return result.rows[0];
        */

        // MVP: Salva na memória
        memoryLeads.push(newLead);
        console.log("✅ Lead salvo em memória:", newLead.nome);

        return newLead;
    },

    // Lista todos os Leads (nome padrão que o controller está chamando)
    getAllLeads: async () => {
        // --- Futuro SQL ---
        /*
        const result = await db.query('SELECT * FROM leads ORDER BY created_at DESC');
        return result.rows;
        */

        return memoryLeads;
    }
};

module.exports = leadService;
