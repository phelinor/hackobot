var express = require('express');
var router = express.Router();

const
  Handler = require('../utils/handlers');


/* GET message listing. */
router.get('/', Handler.subscribe);
/* POST message listing */
router.post('/', Handler.message);

module.exports = router;