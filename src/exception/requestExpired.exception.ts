import HttpException from "./http.exception";

class RequestExpiredException extends HttpException {
    constructor(){
        super(410, "Request has expired" );
    }
}

export default RequestExpiredException;