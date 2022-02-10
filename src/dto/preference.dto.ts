import { IsDefined, IsString, MaxLength } from "class-validator";

class PreferenceDTO {
    
    @IsDefined()
    @IsString()
    @MaxLength(30)
    name: string;
}

export default PreferenceDTO;