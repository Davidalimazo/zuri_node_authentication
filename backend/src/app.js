//import project dependencies
import { config } from "dotenv";
config({ path: process.ENV })
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { getDBconnection } from './db/db-connection.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {router as userRouter} from './router/user.router.js'
import path from 'path';

//get the root directory
const __dirname = dirname(fileURLToPath(import.meta.url));

//create an instance of the express middleware

export const app = express();

//set middlewares
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

//db connection

const db = process.env.DB_URL;

getDBconnection(db)

app.use('/', userRouter);

