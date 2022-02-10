import HttpException from "./http.exception";

class AccountAlreadyActiveException extends HttpException {
    constructor(){
        super(400, "Account activation already done" );
    }
}

export default AccountAlreadyActiveException;