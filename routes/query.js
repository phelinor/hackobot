var express = require('express');
var router = express.Router();

var query = require('../app/query/query');



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
            if (a.price > b.price) {
                return 1;
            }
            if (a.price < b.price) {
                return -1;
            }
            return 0 
        });
        
       res.status(200).send(values);
    }).catch(err => { 
        console.log(err);
       res.status(500).send("Algo Paso ven mas tarde");  
    });     
});

module.exports = router;