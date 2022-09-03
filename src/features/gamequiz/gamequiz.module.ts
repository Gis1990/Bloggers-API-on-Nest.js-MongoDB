import { Module } from "@nestjs/common";
import { GamequizService } from "./gamequiz.service";
import { GamequizController } from "./gamequiz.controller";

@Module({
    controllers: [GamequizController],
    providers: [GamequizService],
})
export class GamequizModule {}
