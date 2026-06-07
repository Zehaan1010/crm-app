const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/leadController');

router.get('/stats', ctrl.getStats);
router.get('/',      ctrl.getAllLeads);
router.get('/:id',   ctrl.getLead);
router.post('/',     ctrl.createLead);
router.put('/:id',   ctrl.updateLead);
router.delete('/:id', ctrl.deleteLead);

module.exports = router;