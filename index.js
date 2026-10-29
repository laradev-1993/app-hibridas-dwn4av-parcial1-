import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import {connectDB} from './config/db.js';
import routerAPI from './routes/index.js';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.urlencoded());
app.use(express.json() );
app.use(express.static('public'));

const port = process.env.PORT;
connectDB();

routerAPI(app);

app.listen( port, () => {
    console.log( `Servidor Web en el Puerto ${port}` );
})