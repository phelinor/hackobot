'use strict';

let
  fs = require('fs'),
  config = JSON.parse(fs.readFileSync('./config.json')),
  request = require('request'),
  requester = (opts) => {
    return new Promise((resolve, reject) => {
      request(opts, (error, response, body) => {
        if (error) { reject(error); }
        resolve(body);
      });
    });
  };

const

  URL = config.api || null,
  TOKEN = process.env.TOKEN || null;

module.exports = {
  sendMessage: (message, recipient) => {
    return new Promise((resolve, reject) => {
      return requester({
        method: 'POST',
        url: URL,
        qs: { access_token: TOKEN },
        headers: { 'content-type': 'application/json' },
        body: {
          recipient: { id: recipient },
          message: { text: message }
        },
        json: true
      }).then((res) => {
        if (res.error) { console.log(err); reject(res.error); }
        resolve(res);
      }).catch(err => {
        console.log(err);
        reject({status:"error",err:"facebook murio =("});
      })
    });
  }
};