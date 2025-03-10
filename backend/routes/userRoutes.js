const express = require('express');
const { getClients, getClient, addClient, getCoaches, updateProfile } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/coaches', getCoaches);

// Protected routes
router.use(protect);

// Profile route
router.route('/profile')
  .put(updateProfile);

// Client routes
router.route('/clients')
  .get(authorize('coach'), getClients)
  .post(authorize('coach'), addClient);

router.route('/clients/:id')
  .get(authorize('coach'), getClient);

module.exports = router; 