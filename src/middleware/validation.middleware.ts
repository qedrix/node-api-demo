import {plainToClass, plainToInstance} from 'class-transformer';
import {validate, ValidationError} from 'class-validator';
import * as express from 'express';
import log from '../common/logger';
import HttpException from '../exception/http.exception';

function validationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        
        validate(plainToInstance(type, req.body), {skipMissingProperties})
            .then((errors: ValidationError[])=> {
                log.debug(`Validation check completed with ${errors.length} errors`);
                if(errors.length > 0){
                    const message = errors.map((error: ValidationError) => {
                        if(error.constraints === undefined){
                            var errorMessages = error.children?.flatMap((error: ValidationError) => Object.values(error.constraints!));
                            // console.log(`${error.property} - ${errorMessages}`);
                            return errorMessages;
                        }
                        return Object.values(error.constraints!)}).join(',');
                    next(new HttpException(400, message));
                } else {
                    next(); // everything ok
                }
            });
    };
}

export default validationMiddleware;