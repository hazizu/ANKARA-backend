const Order = require('../models/order');
const Product = require('../models/product');
const{ sendOrderEmail} = require('../services/notificationService');

// Créer une commande
exports.createOrder = async (req, res) => {
    try{
        const {client, orderedProducts, clientNotes, status} = req.body;

        // vérifier les produits et calcule le total
        let totalAmount = 0;
        const orderItems  = [];

        for(const item of orderedProducts){
            const product = await Product.findById(item.productId);

            if(!product) return res.status(404).json({success: false, message:  `Produit ${item.productId} introuvable` });

            if(product.stock < item.quantity)
                return res.status(400).json({success: false, message:  `Stock insuffisant pour ${product.name}` });

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
                size: item.size
            })
            totalAmount += product.price * item.quantity;

            // Décrémenter le stock
            await Product.findByIdAndUpdate(product._id, {
                $inc: {stock: -item.quantity}
            });
        }

        const order = await Order.create({
            client,
            orderedProducts: orderItems,
            totalAmount,
            clientNotes,
            status
        });

        await order.populate('orderedProducts.product', 'name images price');
        res.status(201).json({success: true, data: order});

        // 📨 Envoie email
        await sendOrderEmail(order).catch(err=>{
          console.error('Erreur notification:', err.message)
        });

    } catch(err){
        res.status(400).json({success: false, message: err.message})
    }
}

// Lister toutes les commandes
exports.getOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const orders = await Order.find(filter)
      .populate('orderedProducts.product', 'name images price')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Récupérer une commande par ID
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('orderedProducts.product', 'name images price');

    if (!order)
      return res.status(404).json({ success: false, message: 'Commande introuvable' });

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mettre à jour le statut
exports.updateOrderStatus = async (req, res) => {
    try{
        const {status} = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {status},
            {new: true, runValidators: true}
        ).populate('orderedProducts.product', 'name images price');

        if(!order)
            return res.status(404).json({success: false, message:  `Commande ${req.params.id} introuvable` });

        res.status(200).json({success: true, data: order});

    }catch(err){
        res.status(400).json({success: false, message: err.message})
    }
};
// Supprimer une commande
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Commande supprimée' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};