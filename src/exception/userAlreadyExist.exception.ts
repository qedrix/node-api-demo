import HttpException from "./http.exception";

class UserAlreadyExistException extends HttpException {
    constructor(){
        super(400, "User already exists" );
    }
}

export default UserAlreadyExistException;