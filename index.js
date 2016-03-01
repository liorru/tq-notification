var api = require('amqplib')
var Promise = require('bluebird')
var request = require("request")
var channel = undefined;
var config = undefined;

module.exports = {
  init: function configure(url, callback) {
    if (!url) {
      callback('Please init config params: url');
      return
    }

    request('http://'+url+'/init/settings', function (error, response, body) {
      if (error || response.statusCode != 200) {
        callback(error || response)
        return
      }

      config = JSON.parse(body).result

      api.connect('amqp://'+config.amqpServer)
      .then(function(connection) {
        connection.createChannel()
        .then(function(cn) {
          channel = cn;
          channel.assertQueue(config.queueName);
          callback(false, true)
        })
        .catch(function(err) {
          callback(err)
        })
      })

    })


    /*
    return api.connect('amqp://'+config.amqpServer)
    .then(function(connection) {
      return connection.createChannel()
      .then(function(cn) {
        channel = cn;
        channel.assertQueue(config.queueName);

        return Promise.resolve(channel);
      })
      .catch(function(err) {
        return Promise.reject(err);
      })
    })
    */
  },

  send: function send(msg) {
    channel.sendToQueue(config.queueName, new Buffer(JSON.stringify(msg) ) );
    return Promise.resolve(true);
  }
}

