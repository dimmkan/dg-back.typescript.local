import http from 'http';
import Express, { Application} from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
const cors = require('cors');
import mongoose from 'mongoose';

// Routers
import playerRouter from './router/player';
import presentRouter from './router/present'


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

app.use('/api/player', playerRouter);
app.use('/api/present', presentRouter);

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

