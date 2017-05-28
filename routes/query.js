var express = require('express');
var router = express.Router();

var query = require('../app/query/query');



/* GET Products List. */
router.get('/', function(req, res, next) {
    var id = req.query.id;
    var product = req.query.product;
    query.QueryProduct(id,product)
    .then(values => {         
       res.status(200).send(values);
    }).catch(err => { 
        console.log(err);
       res.status(500).send("Algo Paso ven mas tarde");  
    });     
});

module.exports = router;