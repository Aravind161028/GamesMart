import emailjs from '@emailjs/browser';

// Configuration for EmailJS (Replace with your actual keys in .env)
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  actionLink?: string;
  name?: string;
}

/**
 * Sends an email using EmailJS if configured, otherwise falls back to Virtual Simulation.
 */
export const sendEmail = async ({ to, subject, body, actionLink, name }: EmailOptions): Promise<void> => {
  console.log(`[EmailService] Attempting to send email to ${to}...`);

  // 1. Try Real EmailJS Sending
  if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: to,
          to_name: name || 'User',
          subject: subject,
          message: body,
          action_link: actionLink || '',
        },
        EMAILJS_PUBLIC_KEY
      );
      console.log('[EmailService] Real email sent successfully via EmailJS');
      return;
    } catch (error) {
      console.error('[EmailService] EmailJS failed, falling back to simulation:', error);
    }
  } else {
    console.warn('[EmailService] EmailJS keys not found. Using Virtual Simulation.');
  }

  // 2. Virtual SMTP Simulation (Fallback)
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a high-fidelity visual "Email Notification" for testing
      const emailContainer = document.createElement('div');
      emailContainer.className = 'fixed bottom-4 right-4 z-[100] max-w-md w-full bg-white dark:bg-slate-800 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-up font-sans';
      emailContainer.innerHTML = `
        <div class="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="font-bold text-sm">📧 Brevo SMTP (Simulated)</span>
          </div>
          <button onclick="this.closest('div.fixed').remove()" class="text-white/80 hover:text-white">&times;</button>
        </div>
        <div class="p-5 text-sm text-gray-700 dark:text-gray-300 space-y-3">
          <div class="border-b border-gray-100 dark:border-gray-700 pb-2">
            <p><strong>From:</strong> Games Mart Support &lt;support@gamesmart.com&gt;</p>
            <p><strong>To:</strong> ${to}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div class="whitespace-pre-wrap font-mono text-xs bg-gray-50 dark:bg-slate-900 p-3 rounded border border-gray-100 dark:border-gray-700">${body}</div>
          ${actionLink ? `
            <div class="pt-2">
              <a href="${actionLink}" class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm">
                ${subject.includes('Reset') ? 'Reset Password' : 'Verify Account'}
              </a>
              <p class="text-[10px] text-center text-gray-400 mt-2">Link expires in 15 minutes</p>
            </div>
          ` : ''}
        </div>
      `;
      document.body.appendChild(emailContainer);
      
      // Auto-remove after 60 seconds
      setTimeout(() => {
        if (document.body.contains(emailContainer)) {
          emailContainer.remove();
        }
      }, 60000);

      console.log(`[EmailService] Virtual Email delivered to ${to}`);
      resolve();
    }, 1500); // Simulate network delay
  });
};
