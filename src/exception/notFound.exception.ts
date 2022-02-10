import HttpException from "./http.exception";

class UserNotFoundException extends HttpException {
    constructor(email: string){
        super(404, `User ${email} does not exist` );
    }
}

export default UserNotFoundException;