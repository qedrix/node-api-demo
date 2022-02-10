import HttpException from "./http.exception";

class WrongAuthTokenException extends HttpException {
    constructor(){
        super(401, "Auth Token does not match" );
    }
}

export default WrongAuthTokenException;