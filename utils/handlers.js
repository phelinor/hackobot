'use strict';

var request = require("request");

let
  sender = require('./sender');

const
  isPriceRequest = (msg) => /precio/gi.test(msg),
  validateNewUser = (userSenderId) => {
    return false;
  },
  createUser = () => {},
  searchQuery = (query) => {
    return new Promise((resolve, reject) => {
      console.log(process.env.API_URL);
      var options = { method: 'GET',
        url: process.env.API_URL,
        qs: { product: query }
      };

      request(options, (error, response, body) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        console.log(body);
        resolve(body);
      });
    });
  },
  msgGenerator = (isPrice, msg) => {
    return new Promise((resolve, reject) => {
      if (isPrice){
        searchQuery(msg.split('precio de ')[1])
        .then((res) => {
          let finalMessage = 'Encontramos estos productos: \n';
          for(var i in res) {
            finalMessage = finalMessage.concat(`- ${res[i].product.ProductName}. $ ${res[i].product.Price} at ${res[i].product.Store}.\n`);
          }
          resolve(finalMessage);
        })
        .catch((err) => {
          return resolve(`Mil disculpas, pero no encontramos ese producto.`);
        });
      } else {
        return resolve(`¡Hola! Tu consulta '${msg}' no arrojo ningun resultado. ¿Por qué no intentas preguntar el precio de algo?`);
      }
    });
  };

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
          msgGenerator(isPriceRequest(msg.message.text), msg.message.text)
          .then((newMsg) => {
            sender.sendMessage(newMsg , msg.sender.id)
            .then((com) => {
              console.log(com);
              res.json(com);
            }).catch((err) => {
              console.log(err.message);
              res.json(err);
            });
          });
        }
      }
    }
  }
};