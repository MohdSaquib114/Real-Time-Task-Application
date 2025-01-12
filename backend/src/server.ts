import express from "express"
import router from "./router"
import { WebSocketServer, WebSocket } from "ws"
import { consumer } from "./consumer"
(async () => {
    console.log("Rundfdf")
    await consumer.subscribe({ topic: "task-events", fromBeginning: true });
    await consumer.connect()
})()

const app = express()

app.use(express.json())


app.use("/api/task",router)
export const server = require("http").createServer(app);

 const wss = new WebSocketServer({server:server})
export const clients: Set<WebSocket>  = new Set()

wss.on("connection",(ws)=>{
    console.log("Client connected to server")
    clients.add(ws)
    
    ws.on("close",()=>{
        clients.delete(ws)
        console.log("Client disconnected to server")
    })
})




consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        if(!message || !message.value){
            return
        }
      const update = JSON.parse(message.value.toString());
      console.log("Broadcasting update:", update);
  
      // Send the update to all connected clients
      clients.forEach((client:WebSocket) => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify(update));
        }
      });
    },
  });



 server.listen(8080, ()=> console.log("Server is listening"))