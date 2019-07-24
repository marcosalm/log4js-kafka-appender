# LOG4JS KAFKA APPENDER

Kafka appender for log4js.

This one works!!!

# how to config your appender:

var log4js = require('log4js');

const conv = function (logging, config) {
    var data = {
        appName: config.appName,
        data: logging.data[0],
        tracing: logging.data[1],
        idMessage: logging.data[2] || '',
        level: logging.level,
        startTime: logging.startTime,
        categoryName: logging.categoryName
    };

    return JSON.stringify(data);
};

log4js.configure({
        appenders:{
            kafka:{
                type: 'log4js-kafka-appender',
                bootstrap:'localhost:9092', //if there are more then one broker: broker1:9092,broker2:9092,broker3:9092
                topic: 'dev_log_teste',
                appName: 'AppTest',
                converter: conv
            }
        },
        categories: {
            default: {
                appenders: ['kafka'],
                level: 'ALL'
            }
        }
});

var logger = log4js.getLogger();

logger.error( "message", new Error('Error message!').stack,'idMessage');

logger.trace('Entering test', null,  '12345678asdfghj');

logger.debug('Got it!');

logger.info('Any information');

logger.warn('Be careful');

logger.fatal('dammit!');
