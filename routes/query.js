const express = require('express');
const router = express.Router();
const db = require('./DB');
const query = require('../app/query/query');




/* GET Products List. */
router.get('/', function(req, res, next) {    
    let product = req.query.product;
    db.usuario_registrado(req.query.id).then(resDB => {        
        query.QueryProduct(resDB.idusuario,product)
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
            
        res.status(200).send(values);
        }).catch(err => { 
            console.log(err);
            res.status(500).send("Algo Paso ven mas tarde");  
        });     
    })
    .catch( err => {
       console.log(err);
       if(err.status == false) res.status(404).send("No encontre al wey que buscas");
       else{
            res.status(500).send("valio madre");
       }
    });
});

module.exports = router;