const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Get all services (public endpoint)
router.get('/', serviceController.getAllServices);

// Get service by level (public endpoint)
router.get('/:level', serviceController.getServiceByLevel);

module.exports = router;
