const leadService = require('../services/leadService');

const leadController = {
    
    // POST /api/leads
    create: async (req, res) => {
        try {
            console.log("📥 Recebendo payload:", req.body);
            const lead = await leadService.createLead(req.body);
            
            return res.status(201).json({
                success: true,
                message: "Lead cadastrado com sucesso!",
                data: lead
            });
        } catch (error) {
            console.error("Erro ao criar lead:", error.message);
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    },

    // GET /api/leads
    list: async (req, res) => {
        try {
            const leads = await leadService.getAllLeads();
            return res.status(200).json({
                success: true,
                count: leads.length,
                data: leads
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Erro interno do servidor."
            });
        }
    }
};

module.exports = leadController;