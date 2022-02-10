import e, * as express from 'express';
import UserDTO from '../dto/user.dto';
import UserService from './user.service';
import IController from '../interface/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';

import log from '../common/logger';
import {isDate24HoursOrOlder, omit} from '../common/helper';
import dayjs from 'dayjs';
import UserAlreadyExistException from '../exception/userAlreadyExist.exception';
import ModifyUserDTO, { AllowedActions } from '../dto/modifyUser.dto';
import UserNotFoundException from '../exception/notFound.exception';
import ActivationPendingException from '../exception/activationPending.exception';
import AccountAlreadyActiveException from '../exception/accountAlreadyActive.exception';
import RequestExpiredException from '../exception/requestExpired.exception';
import InvalidResetRequestException from '../exception/invalidResetRequest.exception';
import InvalidActivationRequestException from '../exception/invalidActivationRequest.exception';
import HttpException from '../exception/http.exception';
import InvalidModificationException from '../exception/invalidModification.exception';
import authMiddleware from '../middleware/auth.middleware';
import { unlink } from 'fs';

class UserController implements IController {

    public path = "/users";
    public router = express.Router();
    public userService: UserService;

    constructor(){
        this.initialzeRoutes();
        this.userService = new UserService();
    }

    public initialzeRoutes(){
        this.router.get(`${this.path}/:id([0-9]+)`, [authMiddleware()], this.getUserByID);
        this.router.post(this.path, validationMiddleware(UserDTO), this.createUser);
        this.router.put(`${this.path}/password`, [validationMiddleware(ModifyUserDTO)], this.resetPassword);
        this.router.patch(`${this.path}/:id([0-9]+)`, [authMiddleware(), validationMiddleware(ModifyUserDTO)], this.modifyUserByID )
        this.router.delete(`${this.path}/:email`, this.deleteUserByEmail);
    }

    getAllUsers = (request: express.Request, response: express.Response) => {
        response.send({});
    }

    createUser = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const user: UserDTO = request.body;
        log.debug(`Creating a new user with email ${user.email}`);
        const existingUser = await this.userService.findByEmail(user.email);
        if(existingUser && existingUser.id !== undefined){
            log.error("User already exists")
            next(new UserAlreadyExistException());
        } else {
            user.dob = dayjs(user.dob).toDate();
            // save in the db
            const createdUser = await this.userService.createUser(user);
            response.send(omit(createdUser, 'password'));
        }
    }

    getUserByEmail = async (request: express.Request, response: express.Response) => {
        var email = request.params.email;
        return await this.userService.findByEmail(email);
    }

    getUserByID = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        var id = request.params.id;
        log.info(`Fetching details for user id ${id}`);
        try {
            const currentUser = await this.userService.findByID(parseInt(id));            
            if(currentUser?.id !== undefined){
                response.send(omit(currentUser, 'password'));
            } else {
                next(new UserNotFoundException(id)) 
            }
        } catch(e){
            next(new UserNotFoundException(id))
        }
    }

    modifyUserByID = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        var id = request.params.id;
        try {
            const modifyUser: ModifyUserDTO = request.body;
            const currentUser = await this.userService.findByID(parseInt(id));
            if(currentUser?.id === undefined){
                next(new UserNotFoundException(id));
            } else {
                if (modifyUser.action === AllowedActions[AllowedActions.ACTIVATE_ACCOUNT]) {
                    log.info("Activating account");
                    
                    if(currentUser.active){
                        next(new AccountAlreadyActiveException())
                    } if(currentUser.email !== modifyUser.email){
                        log.info("Declyning request as email do not match");
                        next(new InvalidActivationRequestException());
                    } else {
                        if(currentUser.activationCode === modifyUser.activate.activationCode){
                            await this.userService.activateUserAccount(modifyUser.email);
                            response.send({"status": 200, "msg": "Account successfully activated"});
                        } else {
                            next(new InvalidActivationRequestException());
                        }
                    }
                } else if(modifyUser.action === AllowedActions[AllowedActions.UPDATE_PREFERENCE]){
                    log.info("Update preferences for user");
                    const preferenceNames: Array<string> = modifyUser.preferences.flatMap((p) => p.name);
                    if(preferenceNames.length > 0){
                        await this.userService.updatePreferences(currentUser.email, preferenceNames);
                        const updatedUser = await this.userService.findByID(parseInt(id));
                        response.send(omit(updatedUser, 'password', 'activationCode'));
                    } else {
                        next(new InvalidModificationException());
                    }
                }
            }
        } catch(e){
            next(new UserNotFoundException(id))
        }
    }

    resetPassword = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const modifyUser: ModifyUserDTO = request.body;
        try {
            const currentUser = await this.userService.findByEmail(modifyUser.email);
            if(currentUser?.id === undefined){
                next(new UserNotFoundException(modifyUser.email));
            } else {
                if (modifyUser.action === AllowedActions[AllowedActions.RESET_PASSWORD_INIT]) { 
                    log.info("Reset password initiated"); 
                    if(currentUser.active){
                        const resetRequest = await this.userService.addPasswordResetRequest(currentUser.email);
                        const result = {
                            "status": 202, 
                            "msg": "You shall receive an email with further instructions", 
                            "_resetKey": resetRequest.resetKey // a hack for demo only
                        }
                        response.send(result).sendStatus(202);
                    } if(currentUser.email !== modifyUser.email){
                        log.info("Declyning request as email do not match");
                        next(new InvalidActivationRequestException());
                    } else {
                        next(new ActivationPendingException());
                    }  
                } else if (modifyUser.action === AllowedActions[AllowedActions.RESET_PASSWORD]) {
                    log.info("Resetting password now");

                    const resetRequest = await this.userService.getPasswordRequest(modifyUser.email);
                    if(resetRequest?.createdAt !== undefined){
                        log.info(`Reset Request was created at ${resetRequest.createdAt}`);

                        if( isDate24HoursOrOlder(resetRequest.createdAt)){
                            next(new RequestExpiredException());
                        } else {
                            if(resetRequest.resetKey === modifyUser.reset.resetKey){
                                const success = await this.userService.updatePassword(modifyUser.email, 
                                    modifyUser.reset.password, modifyUser.reset.resetKey);
                                if(success){
                                    response.send({"status": 200, "msg": "Password reset successful"});
                                } else {
                                    next(new HttpException(500, "Something went wrong"));
                                }
                            } else {
                                next(new InvalidResetRequestException());
                            }
                        }
                    }
                }
            }
        } catch(e) {
            next(new UserNotFoundException(modifyUser.email))
        }
    }

    deleteUserByEmail = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        var email = request.params.email;
        log.info(`Deleting user ${email}`);
        const existingUser = await this.userService.findByEmail(email);
        log.info(`Deleting ${existingUser}`);
        if(existingUser){
            if(existingUser.id !== undefined){
                await this.userService.deleteUserByEmail(email);
                response.send({"status": 200, "msg": "User deleted successfully"});
            } else {
                next(new UserNotFoundException(email));
            }
        } else {
            next(new UserNotFoundException(email));
        }
        
    }
}

export default UserController;