const{ Resend} = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendOrderEmail = async (order) => {
  const itemsList = order.orderedProducts
    .map(item => `• ${item.product.name} x${item.quantity} = ${item.price * item.quantity} FCFA`)
    .join('<br/>');

  await resend.emails.send({
    from: 'onboarding@resend.dev',  // domaine Resend par défaut
    to: 'sunmailahazizu96@gmail.com',
    subject: `🛍️ Nouvelle commande - ${order.client.name}`,
     html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
    // html: `
    //   <h2>Nouvelle commande reçue !</h2>
    //   <p>👤 <b>Client :</b> ${order.client.name}</p>
    //   <p>📞 <b>Téléphone :</b> ${order.client.phone}</p>
    //   <p>📍 <b>Adresse :</b> ${order.client.deliveryAddress}</p>
    //   <hr/>
    //   <p>🛒 <b>Articles :</b></p>
    //   <p>${itemsList}</p>
    //   <hr/>
    //   <p>💰 <b>Total : ${order.totalAmount} FCFA</b></p>
    //   <p>📝 <b>Notes :</b> ${order.clientNotes || 'Aucune'}</p>
    // `,
  });
};

module.exports = {
  sendOrderEmail,
};