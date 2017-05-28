var express = require('express');
var router = express.Router();

var query = require('../app/query/query');
var db = require('./DB');



/* GET Products List. */
router.get('/', function(req, res, next) {
    var id = req.query.id;
    var product = req.query.product;
    query.QueryProduct(id,product)
    .then(values => {         
       values = values.filter(item => {
            return item.status == "ok"
        });

        values = values.sort( (a, b) => {
            if (a.product.Price > b.product.Price) {
                return 1;
            }
            if (a.product.Price < b.product.Price) {
                return -1;
            }
            return 0 
        });
        //db.consulta_almacenar(id,values[2].Store,values(2).ProductName,values(2).Price,values(2).Price,product);
        res.status(200).send(values);
    }).catch(err => { 
        console.log(err);
       res.status(500).send("Algo Paso ven mas tarde");  
    });     
});

module.exports = router;