// db.js
const { Pool } = require("pg");
require("dotenv").config();

let pool = null;
let connected = false;

// Tenta conectar se DATABASE_URL existir
if (process.env.DATABASE_URL) {
    try {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });
        connected = true;
        console.log("🔥 Banco conectado com sucesso.");
    } catch (err) {
        console.error("❌ ERRO AO CONECTAR NO BANCO:", err.message);
    }
} else {
    console.log("⚠️ DATABASE_URL não encontrada. API rodando em modo memória.");
}

module.exports = {
    isConnected: () => connected,

    query: async (text, params) => {
        if (!connected) {
            console.warn("⚠️ Consulta ignorada (modo memória).");
            return { rows: [] }; // NÃO REJEITA — devolve resposta segura
        }

        try {
            return await pool.query(text, params);
        } catch (err) {
            console.error("❌ Banco retornou erro:", err.message);
            throw err; // Agora a exceção será capturada no controller
        }
    },

    client: pool
};
