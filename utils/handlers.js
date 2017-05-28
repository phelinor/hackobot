'use strict';

const 
  db = require('../routes/DB'),
  request = require("request"),
  sender = require('./sender'),
  validateNewUser = (userSenderId) => db.usuario_registrado(userSenderId),
  createUser = (name, userId) => db.usuario_registrar(name, userId),
  searchQuery = (query) => {
    return new Promise((resolve, reject) => {
      console.log(process.env.API_URL);
      var options = { method: 'GET',
        url: process.env.API_URL,
        qs: { product: query }
      };

      request(options, (error, response, body) => {
        if (error) {
          console.log('ERROR: ' + error);
          return reject(error);
        }
        if (response.statusCode > 200) {
          return reject('Error status: ' + response.statusCode);
        }
        console.log('RESULT: ' + body);
        resolve(JSON.parse(body));
      });
    });
  },
  isPriceRequest = (msg) => {
    return /precio/gi.test(msg)||/presio/gi.test(msg)||/cuesta/gi.test(msg)||/sale/gi.test(msg);
  },
  queryGenerator = (msg) => {
    if(length(msg.split(' precio de '))>1){
      return msg.split(' precio de ')[1];
    }
    else if(length(msg.split(' presio de '))>1){
      return msg.split(' presio de ')[1];
    }
    else if(length(msg.split(' cuesta '))>1){
      return msg.split(' cuesta ')[1];
    }
    else if(length(msg.split(' sale '))>1){
      return msg.split(' sale ')[1];
    }
    else{
      return "error";
    }
  },
  msgGenerator = (isPrice, msg) => {
    return new Promise((resolve, reject) => {
      if (isPrice){
        searchQuery(queryGenerator(msg))
        .then((res) => {
          let finalMessage = res.map((i) => {
            return `- ${i.product.ProductName}. $ ${i.product.Price} at ${i.product.Store}.`;
          });
          resolve(finalMessage.join('\n'));
        })
        .catch((err) => {
          console.log('ERROR chido: ' + err);
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
          validateNewUser(msg.sender.id)
          .then(l_user => {
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
          }).catch(n_user => {
            createUser('Amigo', msg.sender.id).then(s_user => {
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
            }).catch(err =>{
              res.json(err);
            });
          });
        }
      }
    }
  }
};