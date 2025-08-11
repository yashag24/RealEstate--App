// routes/builderRoutes.js
const express = require('express');
const {
  createBuilder,
  getBuilders,
  getBuilderById,
  updateBuilder,
  deleteBuilder
} = require('../controllers/builder.js');
const router = express.Router();

// Create a new builder
router.post('/', createBuilder);

// Get all builders
router.get('/', getBuilders);

// Get a builder by ID
router.get('/:id', getBuilderById);

// Update a builder
router.put('/:id', updateBuilder);

// Delete a builder
router.delete('/:id', deleteBuilder);

export default router;
