import { IsString, Length, Matches, IsNotEmpty } from "class-validator";
import { IsBloggersIdExist } from "../bloggers.custom.decorators";

const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export class modelForGettingAllBloggers {
    SearchNameTerm: string;
    PageNumber: number;
    PageSize: number;
}

export class inputModelForCreatingBlogger {
    @IsString()
    @Length(1, 15)
    name: string;
    @IsString()
    @Length(1, 100)
    @Matches(pattern)
    youtubeUrl: string;
}

export class modelForUpdatingBlogger {
    @IsString()
    @Length(1, 15)
    name: string;
    @IsString()
    @Length(1, 100)
    @Matches(pattern)
    youtubeUrl: string;
}

export class bloggersIdValidationModel {
    @IsString()
    @IsNotEmpty()
    @IsBloggersIdExist()
    id: string;
}

export class inputModelForUpdatingBlogger {
    @IsString()
    @IsNotEmpty()
    @IsBloggersIdExist()
    id: string;
    @IsString()
    @Length(1, 15)
    name: string;
    @IsString()
    @Length(1, 100)
    @Matches(pattern)
    youtubeUrl: string;
}
