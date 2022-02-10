import * as express from 'express';
import jwt from 'jsonwebtoken';
import IDataStoredInToken from '../interface/dataStoredInToken.interface';
import WrongAuthTokenException from '../exception/wrongAuthToken.exception';
import AuthTokenMissingException from '../exception/authTokenMissing.exception';
import log from '../common/logger';
import config from 'config';

function authMiddleware() : express.RequestHandler {
    return (request: express.Request, response: express.Response, next: express.NextFunction) => {
        log.debug("Jwt Token checking");
    
        const cookies = request.cookies;
        if(cookies && cookies.Authorization) {
            
            try {
                const secret = config.get("jwtSecret") as string;
                const verificationResponse = jwt.verify(cookies.Authorization, secret) as IDataStoredInToken;
                if(verificationResponse.id === undefined){
                    next(new WrongAuthTokenException());
                }
                next();
            } catch(error){
                next(new WrongAuthTokenException());
            }
        } else {
            log.error("Jwt Token not found in cookies");
            next(new AuthTokenMissingException());
        }
    }
}

export default authMiddleware;