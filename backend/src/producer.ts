import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId:"Task-Management",
    brokers:["localhost:9092"]
})

const producer = kafka.producer()

export const sendTaskUpdate = async (taskUpdate:{id:string,action:string}) =>{
    await producer.connect()
    await producer.send({
        topic:"task-events",
        messages:[{
            value:JSON.stringify(taskUpdate)
        }]
    })
    await producer.disconnect()
}