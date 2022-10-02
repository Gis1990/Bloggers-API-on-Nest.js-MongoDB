import { PartialType } from "@nestjs/mapped-types";
import { CreateGameQuizDto } from "./create-gamequiz.dto";

export class UpdateGameQuizDto extends PartialType(CreateGameQuizDto) {}
