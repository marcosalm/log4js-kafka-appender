'use strict';

const KafkaClient = require('./kafkaClient');

function kafkaAppender(config, layout) {
    //kafka bootstrap brokers
    config.bootstrap = config.bootstrap || 'localhost:9092';
    config.topic = config.topic || 'logging';

    const converter = ( loggingEvent ) =>{
        const data = {
            data: loggingEvent.data,
            level: loggingEvent.level.levelStr,
            startTime: loggingEvent.startTime,
            categoryName: loggingEvent.categoryName
        };
        return JSON.stringify(data);
    }

    const client = new KafkaClient(config);

    return (loggingEvent) => {
        if (loggingEvent.categoryName !== 'kafka') {
            client.send([{ topic: config.topic, messages: converter(layout(loggingEvent))}]);
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