const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  name: String,
});

const Vendor = mongoose.model('Vendor', VendorSchema);

module.exports = Vendor;