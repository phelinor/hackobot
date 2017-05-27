var express = require('express');
var router = express.Router();



/* GET users listing. */
router.get('/', function(req, res, next) {
    var id = req.query.id;
    var product = req.query.product;
    res.send('usuario' + id + 'buscando producto' + product);
});

module.exports = router;