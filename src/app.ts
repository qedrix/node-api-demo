import express from 'express';
import log from './common/logger';

import cookieParser from 'cookie-parser';
import "reflect-metadata";

import errorMiddleware from './middleware/error.middleware';
import IController from './interface/controller.interface';

import swaggerUI from 'swagger-ui-express';
import * as swaggerDocument from '../swagger.json';

class App {
    
    public app: express.Application;
    public port: number;
    public host: string;

    constructor(controllers: Array<IController>, host: string, port: number){
        this.app = express();
        this.port = port;
        this.host = host;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeSwagger();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares(){
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}))
        this.app.use(cookieParser());
    }

    private initializeErrorHandling(){
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Array<IController>){
        controllers.forEach((controller) => {
            if(controller.router){
                this.app.use('/', controller.router);
            }
        });
    }

    private initializeSwagger(){
        this.app.use(  
            '/api-docs',
            swaggerUI.serve, 
            swaggerUI.setup(swaggerDocument));
    }

    public listen(){
        this.app.listen(this.port, this.host, () => {
            log.info(`Server listening at http://${this.host}:${this.port}`);        
        });
    }
}

export default App;