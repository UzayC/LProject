const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  cart_item: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ParentProduct'
      },
      item_count: Number,
      quantity: Number,
      cogs: Number,
    },
  ],
  payment_at: Date,
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
