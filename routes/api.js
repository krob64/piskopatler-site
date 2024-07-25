const express = require('express');
const router = express.Router();

const wosMiddleware = require('./../middleware/wallofshame');
const invMiddleware = require('./../middleware/invitecodes');
const auth = require('./../controllers/auth');

router.post('/wallofshame-addmsg', wosMiddleware.addEntry);
router.post('/admin/invitecodes/addcode', auth.isAdmin,invMiddleware.generateCode);

module.exports = router;

