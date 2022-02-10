import HttpException from "./http.exception";

class InvalidModificationException extends HttpException {
    constructor(){
        super(400, "Trying to modify with an invalid document" );
    }
}

export default InvalidModificationException;