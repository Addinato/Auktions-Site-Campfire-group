import express, { Express, Request, Response } from "express";
import cors from "cors";
import { productRouter, initProducts } from "./routes/product.routes";
import http from 'http';
import { getIo, initSocket } from './socket';
import { Socket } from "socket.io";

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(cors());

const server = http.createServer(app);
initSocket(server);


getIo().on('connection', (socket: Socket) => {
  console.log('a user connected');
  var query = socket.handshake.query;
  var productId = query.roomName as string; // Get the room name from the query parameters = game id!
  socket.join(productId);  

  // Allow clients to explicitly join rooms after connecting
  socket.on('join', (roomName: string) => {
    if (roomName) socket.join(roomName);
  });

  socket.on('someoneTypedSomething', (message) => {
    console.log('Message received:', message);
    // if message.amount > lastBid 
    // else rejectBid
    //skicka tillbaka till bara dig
    socket.emit('bidResponse', { success: true, message: 'Bid accepted!' });
    
    // Broadcast the message to all clients in the same room
    socket.to(productId).emit('anUpdateFromServer', message);
  });


  socket.on('disconnect', () => {
    console.log('user disconnected');
  }
  );
});



initProducts();

app.use(express.json());

app.use("/api/product", productRouter);


server.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});