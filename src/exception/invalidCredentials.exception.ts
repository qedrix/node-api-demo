import HttpException from "./http.exception";

class InvalidCredentialsException extends HttpException {
    constructor(){
        super(400, `Login credentials do not match` );
    }
}

export default InvalidCredentialsException;