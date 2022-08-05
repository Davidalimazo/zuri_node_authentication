import { config } from "dotenv";
config({ path: process.ENV })
import http from "http";
import { app } from './app.js';


const PORT = process.env.PORT

const server = http.createServer(app);
server.listen(PORT, () => {
    console.log("SERVER IS RUNNING ON PORT "+PORT);
  });
