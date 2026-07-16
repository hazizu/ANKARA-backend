const { status } = require('express/lib/response');
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  size:{
      type: String,
      required: true,
  }
});

const orderSchema = new mongoose.Schema({
    
    // Infos client
    client :{
        name:{type:String, required: [true, 'Le nom est requis']},
        phone:{type:String, required: [true, 'Le numéro de téléphone est requis']},
        deliveryAddress:{type:String, required: [true, 'L\'adresse de livraison est requise']},
    },

    // produits commandés
    orderedProducts:{
        type: [orderItemSchema],
        validate:{
            validator: v => v.length > 0,
            message: 'Il faut commandé au moins un produit'
        }
    },

    totalAmount:{
        type: Number,
        required: [true]
    },

    status:{
        type: String,
        enum: ['pending', 'confirmed', 'delivered', 'canceled'],
        default: 'pending'
    },
    
    clientNotes:{
        type: String,
        default: ''
    }
    
}, {timestamps: true});

module.exports = mongoose.model('Order', orderSchema);