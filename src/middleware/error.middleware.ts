import {Request, Response, NextFunction} from 'express';
import HttpException from '../exception/http.exception';

function errorMiddleware(error: HttpException, request: Request, response:Response, next: NextFunction){
    const status = error.status || 500;
    const message = error.message || "Something went wrong";
    response
        .status(status)
        .send({"status": status, "msg": message});
}

export default errorMiddleware;