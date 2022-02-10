import {
    IsEmail,
    IsDate,
    Length,
    Min,
    Max,
    IsDefined,
    IsString,
    MinLength
} from 'class-validator';

class LoginDTO {
    @IsDefined()
    @IsEmail()
    email: string;

    @IsDefined()
    @IsString()
    @MinLength(8)
    password: string;
}

export default LoginDTO;