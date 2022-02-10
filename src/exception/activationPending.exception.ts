import HttpException from "./http.exception";

class ActivationPendingException extends HttpException {
    constructor(){
        super(400, "Account activation pending" );
    }
}

export default ActivationPendingException;