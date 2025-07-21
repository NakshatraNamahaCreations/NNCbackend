const express = require('express');
const router = express.Router();
const personController = require('../Controllers/personController');

// Person routes
router.post('/', personController.createPerson);
router.get('/', personController.getAllPersons);
router.get('/:id', personController.getPersonById);
router.put('/:id', personController.updatePerson);
router.delete('/:id', personController.deletePerson);
router.post('/login', personController.login);

module.exports = router;