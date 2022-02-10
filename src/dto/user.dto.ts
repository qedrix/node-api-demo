import {
    IsEmail,
    IsDate,
    Length,
    Min,
    Max,
    IsString,
    MinLength,
    IsDefined,
    Matches,
    IsDateString,
    IsNotEmpty,
    MaxLength
} from 'class-validator';

class UserDTO {

    id: number;
    
    @IsDefined()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password: string;
    
    @IsNotEmpty()
    @MaxLength(30)
    firstName: string;
    
    @IsNotEmpty()
    @MaxLength(30)
    lastName: string;
    
    @IsDateString()
    dob: Date;
}

export default UserDTO;