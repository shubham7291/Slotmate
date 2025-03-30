const express = require('express');
const router = express.Router();
const Consignment = require('../models/consigment'); // Path to your consignment model
const { body, validationResult } = require('express-validator'); // For validation

// POST route to save consignment data
router.post('/createConsignment',async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data from the request body
    const {
      senderFullName,
      senderMobileNumber,
      senderAddress,
      senderPincode,
      senderPostOffice,
      senderState,
      senderDistrict,
      receiverFullName,
      receiverMobileNumber,
      receiverAddress,
      receiverPincode,
      receiverPostOffice,
      receiverState,
      receiverDistrict,
      schedulePickupTime,
      pickupDate,
      estimatedDeliveryDate,
      deliveryDay,
      deliveryTime,
      deliveryCost,
      paymentMethod,
      deliverystatus
    } = req.body;

    // Create a new consignment object
    const consignment = new Consignment({
      sender: {
        fullName: senderFullName,
        mobileNumber: senderMobileNumber,
        address: senderAddress,
        pincode: senderPincode,
        postOffice: senderPostOffice,
        state: senderState,
        district: senderDistrict,
      },
      receiver: {
        fullName: receiverFullName,
        mobileNumber: receiverMobileNumber,
        address: receiverAddress,
        pincode: receiverPincode,
        postOffice: receiverPostOffice,
        state: receiverState,
        district: receiverDistrict,
      },
      schedulePickupTime,
      pickupDate,
      estimatedDeliveryDate,
      deliveryDay,
      deliveryTime,
      deliveryCost,
      paymentMethod,
      deliverystatus:{
        "ready_for_pickup": 1,
        "picked_up": 0,
        "in_transit": 0,
        "reached_to_nearest_hub": 0,
        "out_for_delivery": 0,
        "delivered": 0
      }
        });

    // Save consignment to the database
    await consignment.save();
    res.status(201).json({
      message: 'Consignment data saved successfully',
      consignment: consignment // Optionally return the saved consignment object
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving consignment data' });
  }
});

// router.get('/consignments/mobile/:mobile', async (req, res) => {
//   const phoneNumber = req.params.mobile;
//   try {
//     const consignments = await Consignment.find({
//       $or: [
//         { 'sender.mobileNumber': req.params.mobile },
//         { 'receiver.mobileNumber': req.params.mobile },
//       ]
//     });

//     if (consignments.length === 0) {
//       return res.status(404).json({ message: 'No consignments found for this mobile number' });
//     }

//     res.status(200).json({ data: consignments });
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching consignment', error: err.message });
//   }
// });

router.get('/consignments/mobile/:mobile', async (req, res) => {
  const phoneNumber = req.params.mobile;
  try {
    // Fetch consignments where the phone number matches either sender or receiver
    const consignments = await Consignment.find({
      $or: [
        { 'sender.mobileNumber': phoneNumber },
        { 'receiver.mobileNumber': phoneNumber }
      ]
    });

    if (consignments.length === 0) {
      return res.status(404).json({ message: 'No consignments found for this mobile number' });
    }

    // Initialize arrays to store categorized consignments
    const currentOrders = [];
    const pastOrders = [];
    const ordersForMe = [];

    // Get the current date for comparison
    const currentDate = new Date();

    // Loop through all consignments and categorize them
    consignments.forEach(consignment => {
      if (consignment.deliveryStatus.delivered === 1) {
        pastOrders.push(consignment);
      }
      
      // Check if the consignment is for the user (either sender or receiver)
      else if (consignment.sender.mobileNumber === phoneNumber && consignment.deliveryStatus.delivered !== "1") {
        // Add to current orders if the sender's phone matches and not delivered
        currentOrders.push(consignment);
      } else if (consignment.receiver.mobileNumber === phoneNumber) {
        // Add to "Orders for Me" if the receiver's phone matches
        ordersForMe.push(consignment);
      }

      // If the consignment is delivered, categorize it as a past order
      
    });

    // Respond with the categorized consignments
    res.status(200).json({
      currentOrders,
      pastOrders,
      ordersForMe
    });
  } catch (err) {
    // Handle errors
    res.status(500).json({ message: 'Error fetching consignments', error: err.message });
  }
});

module.exports = router;
