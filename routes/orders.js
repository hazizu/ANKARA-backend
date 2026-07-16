const express = require('express');
const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    deleteOrder
    
}  = require('../controllers/orderController');

router.route('/').get(getOrders).post(createOrder);
router.route('/:id').get(getOrder).delete(deleteOrder);
router.route('/:id/status').put(updateOrderStatus);

module.exports = router;