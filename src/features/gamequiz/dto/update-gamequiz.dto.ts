import { PartialType } from "@nestjs/mapped-types";
import { CreateGamequizDto } from "./create-gamequiz.dto";

export class UpdateGameQuizDto extends PartialType(CreateGamequizDto) {}
