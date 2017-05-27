'use strict';

let
  sender = require('./sender');

module.exports = {
  main: (req, res, next) => {
    res.send('Hello World!');
  },
  subscribe: (req, res, next) => {
    const TOKEN = process.env.TOKEN || null;
    if (req.query["hub.verify_token"] === TOKEN) {
      res.send(req.query["hub.challenge"]);
    } else {
      res.send("Error, cannot validate token.");
    }
  },
  message: (req, res, next) => {
    console.log(req.body);    
    for (var i in req.body.entry) {
      for (var e in req.body.entry[i].messaging) {
        let msg = req.body.entry[i].messaging[e];
        if (msg.message) {
          let message = `You just said: ${msg.message.text}`;
          // TODO: add validation.
          sender.sendMessage(message , msg.sender.id)
          .then((com) => {
            console.log(com);
            res.json(com);
          }).catch((err) => {
            console.log(err.message);
            res.json(err);
          });
        }
      }
    }
  }
};