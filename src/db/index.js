const { Pool } = require('pg');
require('dotenv').config();

let pool = null;

// Só tenta conectar se a variável DATABASE_URL existir
if (process.env.DATABASE_URL) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Necessário para Vercel/Neon/Supabase em prod
        }
    });
    console.log("🔥 Banco de dados configurado (Driver Ativo)");
} else {
    console.log("⚠️ DATABASE_URL não encontrada. Rodando em modo 'Em Memória'.");
}

module.exports = {
    query: (text, params) => {
        if (!pool) {
            console.error("❌ Erro: Tentativa de consulta ao banco sem conexão ativa.");
            return Promise.reject("Banco de dados não conectado.");
        }
        return pool.query(text, params);
    },
    client: pool
};