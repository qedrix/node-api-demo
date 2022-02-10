import { 
    IsString,
    MinLength,
    MaxLength,
    Matches, 
    IsEmail,
    IsNotEmpty} from "class-validator";
import {Match} from '../common/match.decorator';

class PasswordResetDTO {

    @IsString()
    @IsNotEmpty()
    resetKey: string;
    
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Match('password')
    passwordConfirm: string;    
}

export default PasswordResetDTO;