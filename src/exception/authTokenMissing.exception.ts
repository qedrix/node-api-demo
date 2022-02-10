import HttpException from "./http.exception";

class AuthTokenMissingException extends HttpException {
    constructor(){
        super(401, "Access denied" );
    }
}

export default AuthTokenMissingException;