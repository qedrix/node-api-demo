import { IsDefined, IsEmail, Max, MaxLength, MinLength } from "class-validator";

class ActivateUserDTO {

    @IsDefined()
    activationCode: number;
}

export default ActivateUserDTO;