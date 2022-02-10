import { Type } from "class-transformer";
import { IsDefined, IsEmail, IsNotEmptyObject, IsObject, IsString, Matches, ValidateIf, ValidateNested } from "class-validator";
import ActivateUserDTO from "./activateUser.dto";
import PasswordResetDTO from "./passwordReset.dto";
import PreferenceDTO from "./preference.dto";
import UserDTO from "./user.dto";

export enum AllowedActions {
    RESET_PASSWORD_INIT,
    RESET_PASSWORD,
    ACTIVATE_ACCOUNT,
    MODIFY_USER,
    UPDATE_PREFERENCE
}

class ModifyUserDTO {

    @IsString()
    @Matches(`^${Object.values(AllowedActions).filter(v => typeof v !== "number").join('|')}$`)
    action: string;

    @IsEmail()
    email: string;

    @ValidateIf(o => o.action === AllowedActions[AllowedActions.RESET_PASSWORD])
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PasswordResetDTO)
    reset!: PasswordResetDTO;

    @ValidateIf(o => o.action === AllowedActions[AllowedActions.ACTIVATE_ACCOUNT])
    @ValidateNested()
    @Type(() => ActivateUserDTO)
    activate: ActivateUserDTO;

    @ValidateIf(o => o.action === AllowedActions[AllowedActions.MODIFY_USER])
    @ValidateNested()
    @Type(() => UserDTO)
    modify: UserDTO;

    @ValidateIf(o => o.action === AllowedActions[AllowedActions.UPDATE_PREFERENCE])
    @ValidateNested()
    @Type(() => PreferenceDTO)
    preferences: PreferenceDTO[]

}

export default ModifyUserDTO;