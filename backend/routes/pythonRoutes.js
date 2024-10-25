
const express = require('express');
const router = express.Router();
const pythonController = require('../controllers/pythonController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/contacts', pythonController.getCompanyContacts);
router.post('/description', pythonController.getCompanyDescription);
router.post('/prediction', pythonController.getAiPrediction);
router.post('/answer', pythonController.getChatbotAnswer);



module.exports = router;
