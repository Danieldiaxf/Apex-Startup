/**
 * emailService.ts - Serviço de envio de emails via EmailJS
 * 
 * Responsabilidades:
 * - Inicializa EmailJS com chave pública
 * - Envia emails do formulário de contato
 * 
 * Configuração:
 * - Service ID e Template ID devem ser configurados no EmailJS Dashboard
 * - Public Key é passada via parâmetro na inicialização
 */

// EmailJS é carregado via CDN em index.html
declare const emailjs: any;

export interface ContactPayload {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export function initEmailJs(publicKey: string) {
  emailjs.init(publicKey);
}

export function sendContactEmail(payload: ContactPayload) {
  return emailjs.send('service_danieldiaxf', 'template_danieldiaxf', payload);
}


