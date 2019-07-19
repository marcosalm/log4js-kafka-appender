'use strict';

const kafka = require('kafka-node');
const debug = require('debug')('log4js:kafka');
class Client {
    constructor(config) {
        this.config = config;
        config.topics = [config.topic];

    }

    send(payloads) {
        var Producer = kafka.Producer,
            KeyedMessage = kafka.KeyedMessage,
            client = new kafka.KafkaClient( {kafkaHost: this.config.bootstrap} ),
            producer = new Producer(client);

        producer.on('ready', function () {
            producer.send(payloads, function (err, data) {
                debug(JSON.stringify(data));
            });
        });


        producer.on('error', (err) => {
            debug(`Kafka client error, ${err}`);
        });
    }
}

module.exports = Client;
