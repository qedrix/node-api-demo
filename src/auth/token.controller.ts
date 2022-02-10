import * as express from 'express';
import LoginDTO from '../dto/login.dto';
import InvalidCredentialsException from '../exception/invalidCredentials.exception';
import IController from "../interface/controller.interface";
import validationMiddleware from '../middleware/validation.middleware';
import UserService from '../user/user.service';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import ITokenHolder from '../interface/tokenData.interface';
import IDataStoredInToken from '../interface/dataStoredInToken.interface';
import config  from 'config';

class TokenController implements IController {
    
    public path = "/tokens";
    public router = express.Router();
    public userService: UserService;

    constructor(){
        this.initialzeRoutes();
        this.userService = new UserService();
    }

    private initialzeRoutes(){
        this.router.post(this.path, validationMiddleware(LoginDTO), this.loginUser);
        this.router.post(`${this.path}/logout`, this.loginUser);
    }

    loginUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const loginData: LoginDTO = request.body;
        const user = await this.userService.findByEmail(loginData.email);
        if(user){
            const isPasswordMatching = await bcrypt.compare(loginData.password, user.password);
            if(isPasswordMatching){
                user.password = '';
                const tokenData = this.createToken(user);
                response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
                response.send(user);
            } else {
                next(new InvalidCredentialsException());
            }
        } else {
            next(new InvalidCredentialsException());
        }
    }

    logoutUser = (request: express.Request, response: express.Response) => {
        response.setHeader('Set-Cookie', ['Authprization=;Max-age:0;']);
        response.send(200);
    }

    private createToken = (user: User) : ITokenHolder => {
        const expiresIn = 60 * 60; // 1 hour
        const secret = config.get("jwtSecret") as string;
        const dataInToken: IDataStoredInToken = {
            id: user.id,
            email: user.email,
        };
        return {
            expiresIn: expiresIn,
            token: jwt.sign(dataInToken, secret!, {expiresIn}),
        };
    }

    private createCookie = (tokenData: ITokenHolder) => {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }

}

export default TokenController;