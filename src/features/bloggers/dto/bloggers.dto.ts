import { IsString, Length, Matches, IsNotEmpty, IsNumber, IsMongoId } from "class-validator";
import { IsBloggersIdExist } from "../bloggers.custom.decorators";

const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export class ModelForGettingAllBloggers {
    @IsString()
    SearchNameTerm: string;
    @IsNumber()
    PageNumber: number;
    @IsNumber()
    PageSize: number;
}

export class InputModelForCreatingBlogger {
    @IsString()
    @Length(1, 15)
    @IsNotEmpty()
    name: string;
    @IsString()
    @Length(1, 100)
    @Matches(pattern)
    @IsNotEmpty()
    youtubeUrl: string;
}

export class BloggersIdValidationModel {
    @IsString()
    @IsNotEmpty()
    @IsBloggersIdExist()
    id: string;
}

export class InputModelForUpdatingBlogger {
    @IsString()
    @IsNotEmpty()
    @IsBloggersIdExist()
    @IsMongoId()
    id: string;
    @IsString()
    @Length(1, 15)
    name: string;
    @IsString()
    @Length(1, 100)
    @Matches(pattern)
    youtubeUrl: string;
}
