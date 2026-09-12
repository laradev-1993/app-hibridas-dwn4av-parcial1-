import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import routerAPI from './routes/index.js';


dotenv.config();

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(express.static('public'));

const port = process.env.PORT;
connectDB();

routerAPI(app);

app.listen(port, () => {
    console.log(`El servidor web en el puerto ${port}`);
})