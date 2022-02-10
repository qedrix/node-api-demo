import HttpException from "./http.exception";

class InvalidActivationRequestException extends HttpException {
    constructor(){
        super(400, "Activation request is invalid" );
    }
}

export default InvalidActivationRequestException;