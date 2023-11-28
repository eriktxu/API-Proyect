import express from 'express';
import cors from "./src/middlewares/corsMiddleware";
import routes from "./src/routes";
import {init} from "./src/services/servicesLocator/composer";

const server = express();

init();

server.use(cors);
routes(server);

server.listen(9001, function(){
    console.log('Servidor iniciado en el puerto 9001');
})