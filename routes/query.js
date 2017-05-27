var express = require('express');
var router = express.Router();

var query = require('../app/query/query');



/* GET users listing. */
router.get('/', function(req, res, next) {
    var id = req.query.id;
    var product = req.query.product;  
    res.send(query.QueryProduct(id,product));  
});

module.exports = router;