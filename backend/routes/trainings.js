// backend/routes/trainings.js
const Router = require('express').Router;
const auth   = require('../middleware/auth');
const ctrl   = require('../controllers/trainingController');

const router = new Router();

// CREATE
router.post(   '/',       auth, ctrl.createTraining);

// READ — список
router.get(    '/',       auth, ctrl.getTrainings);

// UPDATE
router.put(    '/:id',    auth, ctrl.updateTraining);

// DELETE
router.delete( '/:id',    auth, ctrl.deleteTraining);

// (опционально) статистика
router.get(    '/stats',  auth, ctrl.getStats);
router.get(    '/daily',  auth, ctrl.getDailyStats);

module.exports = router;
