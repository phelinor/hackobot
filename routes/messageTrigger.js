const express = require('express');
const router = express.Router();

const sender = require('./sender');



router.post('/', function(req, res, next) {
    sender.sendMessage(req.body.msg ,req.body.id)
    .then((com) => {
       res.status(200).send("");
    }).catch((err) => {
        console.log("Algo Paso ven mas tarde:" + err);
        res.status(500).send("Algo Paso ven mas tarde:" + err);  
    });
});

module.exports = router;