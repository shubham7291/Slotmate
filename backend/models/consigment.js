const mongoose = require('mongoose');

const consignmentSchema = new mongoose.Schema({
  sender: {
    fullName: { type: String, required: true },
    mobileNumber: { 
      type: String, 
      required: true, 
      match: /^[0-9]{10}$/ // Validate 10-digit number
    },
    address: String,
    pincode: { 
      type: String, 
      match: /^[0-9]{6}$/ // Validate 6-digit pincode
    },
    postOffice: String,
    state: String,
    district: String,
  },
  receiver: {
    fullName: { type: String, required: true },
    mobileNumber: { 
      type: String, 
      required: true, 
      match: /^[0-9]{10}$/ // Validate 10-digit number
    },
    address: String,
    pincode: { 
      type: String, 
      match: /^[0-9]{6}$/ // Validate 6-digit pincode
    },
    postOffice: String,
    state: String,
    district: String,
  },
  schedulePickupTime: String, // Example format: "03:00 PM - 06:00 PM"
  pickupDate: { type: String, required: true },
  pickupCharge: { type: Number, default: 30 },
  estimatedDeliveryDate: { type: Date },
  deliveryDay: String,
  deliveryTime: String,
  deliveryCost: { type: Number, default: null },
  paymentMethod: String,
  consignmentId: { type: String, default: null },
  postmanId: { type: String, default: null },
  postOfficeId: { type: String, default: null },
  deliveryStatus: {  
      "ready_for_pickup": { type: Number, default:1 },
      "picked_up": { type: Number, default: 0 },
      "in_transit": { type: Number, default: 0 },
      "reached_to_nearest_hub": { type: Number, default: 0 },
      "out_for_delivery": { type: Number, default: 0 },
      "delivered": { type: Number, default: 0 } 
  }
});

const Consignment = mongoose.model('Consignment', consignmentSchema);

module.exports = Consignment;
