import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId:"Task-Management",
    brokers:["localhost:9092"]
})
export const consumer = kafka.consumer({ groupId: "websocket-consumer" });

