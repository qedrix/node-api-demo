import HttpException from "./http.exception";

class InvalidResetRequestException extends HttpException {
    constructor(){
        super(400, "Reset request is invalid" );
    }
}

export default InvalidResetRequestException;