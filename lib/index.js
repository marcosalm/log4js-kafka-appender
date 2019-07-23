'use strict';

const KafkaClient = require('./kafkaClient');

function kafkaAppender(config, layout) {
    //kafka bootstrap brokers
    config.bootstrap = config.bootstrap || 'localhost:9092';
    config.topic = config.topic || 'logging';
    config.appName =  config.appName || '';


    const converter = config.converter || function( loggingEvent, config ){
        const data = {
            appName: config.appName,
            data: loggingEvent.data[0],
            idMessage: loggingEvent.data[1] || '',
            level: loggingEvent.level,
            startTime: loggingEvent.startTime,
            categoryName: loggingEvent.categoryName
        };
        return JSON.stringify(data);
    }

    const client = new KafkaClient(config);

    return (loggingEvent) => {
        if (loggingEvent.categoryName !== 'kafka') {
            client.send([{ topic: config.topic, messages: (converter(loggingEvent, config)).toString('utf8')}]);
        }
    };
}

function configure(config, layouts) {
    let layout = layouts.messagePassThroughLayout;
    if (config.layout) {
        layout = layouts.layout(config.layout.type, config.layout);
    }

    return kafkaAppender(config, layout);
}

module.exports.configure = configure;
