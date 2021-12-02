import http from 'http';
import Express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
const cors = require('cors')

// Router
import mainRouter from './router/main';
import mongoose from 'mongoose';

const app: Application = Express();

app.use(Express.json());
app.use(cors())
app.options('*', cors)
app.use(Express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/api/player', mainRouter);

async function start(){
    const url = 'mongodb://localhost:27017/dg_test'
    await mongoose.connect(url)
    const server = http.createServer(app);
    server.listen(3300);

    server.on('error', error => {
        console.error(`Error HTTPD Server: ${error.message}`);
        process.exit();
    });

    server.on('listening', async () => {
        console.info('Application listening on http://localhost:3300');
    });
}

start()
    .then(r => {})
    .catch(err => {
        console.log(err)
    })

