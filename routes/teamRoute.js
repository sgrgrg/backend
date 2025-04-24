const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Get all team members
router.get('/', teamController.getAllTeams);

// Get a team member by ID
router.get('/:id', teamController.getTeamById);

// Create a new team member
router.post('/', teamController.createTeam);

// Update a team member
router.put('/:id', teamController.updateTeam);

// Delete a team member
router.delete('/:id', teamController.deleteTeam);

module.exports = router;
