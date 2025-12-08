// src/controllers/leadController.js
const leadService = require('../services/leadService');

const leadController = {

  // POST /api/leads
  create: async (req, res) => {
    try {
      console.log("📥 Recebendo payload:", req.body || {});
      const lead = await leadService.createLead(req.body || {});

      return res.status(201).end(JSON.stringify({
        success: true,
        message: "Lead cadastrado com sucesso!",
        data: lead
      }));
    } catch (error) {
      console.error("Erro ao criar lead:", error && error.stack ? error.stack : error);

      const code = error && error.statusCode ? error.statusCode : 400;
      return res.status(code).end(JSON.stringify({
        success: false,
        message: error && error.message ? error.message : "Erro ao criar lead"
      }));
    }
  },

  // GET /api/leads
  list: async (req, res) => {
    try {
      const leads = await leadService.getAllLeads();
      return res.status(200).end(JSON.stringify({
        success: true,
        count: Array.isArray(leads) ? leads.length : 0,
        data: leads
      }));
    } catch (error) {
      console.error("Erro ao listar leads:", error && error.stack ? error.stack : error);
      return res.status(500).end(JSON.stringify({
        success: false,
        message: "Erro interno do servidor."
      }));
    }
  }

};

module.exports = leadController;
