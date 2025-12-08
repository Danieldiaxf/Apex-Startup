// src/services/leadService.js
const crypto = require('crypto');

// Tentativa segura de carregar db (se existir)
let db = null;
try {
  db = require('../db'); // se não houver, ficará null e o código usará memória
} catch (err) {
  console.warn("AVISO: módulo db não encontrado. Operando em modo memória para MVP.");
}

// Armazenamento em memória para o MVP (Volátil)
const memoryLeads = [];

const leadService = {

  // Cria um novo Lead
  createLead: async (data) => {
    const { nome, email, telefone, cidade, estado, categoria } = data || {};

    // Validação simples
    if (!nome || !email || !telefone) {
      const e = new Error("Campos obrigatórios: Nome, Email e Telefone.");
      e.statusCode = 400;
      throw e;
    }

    const newLead = {
      id: crypto.randomUUID(),
      nome,
      email,
      telefone,
      cidade: cidade || null,
      estado: estado || null,
      categoria: categoria || null,
      data_cadastro: new Date().toISOString()
    };

    // Se existir db configurado (Postgres etc), use-o; caso contrário, memoria
    if (db && typeof db.query === "function") {
      // Exemplo de integração: (descomente e ajuste conforme seu client)
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
      // Por enquanto, se db existir mas não configurado, caímos no memory
    }

    memoryLeads.push(newLead);
    console.log("✅ Lead salvo em memória:", newLead.nome);
    return newLead;
  },

  // Lista todos os leads
  getAllLeads: async () => {
    if (db && typeof db.query === "function") {
      // Descomente e ajuste quando usar Postgres
      // const result = await db.query('SELECT * FROM leads ORDER BY created_at DESC');
      // return result.rows;
    }
    return memoryLeads;
  }

};

module.exports = leadService;
