const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
// Ce sont des routes POST car le frontend 
// va également envoyer des informations

module.exports = router;