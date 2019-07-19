'use strict';

const kafka = require('kafka-node');
const debug = require('debug')('log4js:kafka');

class Client {
    constructor(config) {
        const HighLevelProducer = kafka.HighLevelProducer;

        this.config = config;
        config.topics = [config.topic];

        this.client = new kafka.KafkaClient({kafkaHost: config.bootstrap});

        this.producer = new HighLevelProducer(this.client);
        this.ready = false;

        this.producer.on('ready', () => {
            debug('Kafka client ready');
            this.createTopics(config.topics);
        });

        this.producer.on('error', (err) => {
            debug(`Kafka client error, ${err}`);
        });

        process.on('exit', () => {
            this.client.close();
        });
    }

    createTopics(topics) {
        this.producer.createTopics(topics, false, (err, data) => {
            if (err) {
                debug(err.message);
                return
            }
            this.ready = true;
            debug(data);
        });
    }

    send(payloads) {
        if (!this.ready) {
            return;
        }
        this.producer.send(payloads, (err, data) => {
            if (err) {
                debug(err.message);
                this.ready = false;
                debug('Reacreating topics');
                this.createTopics(this.config.topics);
                return;
            }
            debug(data);
        });
    }
}

module.exports = Client;

