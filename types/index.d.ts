import {Layout} from "log4js";

export interface KafkaAppender {
    type: '@log4js-node/kafka';
    // (defaults to localhost:9092) - the location of the kafka server
    bootstrap?: string;
    // (defaults to loggging)
    topic?: string;
    // (defaults to messagePassThroughLayout) - the layout to use for log events.
    layout?: Layout;
}