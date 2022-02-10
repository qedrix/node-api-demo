import * as express from 'express';
import IController from "../interface/controller.interface";

class HeartbeatController implements IController {

    public path = "/heartbeat";
    public router = express.Router();

    constructor(){
        this.initialzeRoutes();
    }

    public initialzeRoutes(){
        this.router.get(this.path, this.getHeartbeat);
    }

    getHeartbeat = (request: express.Request, response: express.Response) => {
        response.sendStatus(200);
    }

}

export default HeartbeatController;