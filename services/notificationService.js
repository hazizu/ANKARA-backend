const nodemailer = require('nodemailer');

// ─── Email ───────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendOrderEmail = async (order) => {
  const itemsList = order.orderedProducts
    .map(item => `- ${item.product.name} x${item.quantity} = ${item.price * item.quantity} FCFA`)
    .join('\n');

  await transporter.sendMail({
    from: `"ANKARA Boutique" <${process.env.MAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject: `🛍️ Nouvelle commande - ${order.client.name}`,
    text: `
Nouvelle commande reçue !

👤 Client : ${order.client.name}
📞 Téléphone : ${order.client.phone}
📍 Adresse : ${order.client.deliveryAddress}

🛒 Articles :
${itemsList}

💰 Total : ${order.totalAmount} FCFA

📝 Notes : ${order.clientNotes || 'Aucune'}

Date : ${new Date(order.createdAt).toLocaleString('fr-FR')}
    `,
  });
};