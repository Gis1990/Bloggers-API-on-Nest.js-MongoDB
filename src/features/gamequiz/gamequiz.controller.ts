import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { GamequizService } from "./gamequiz.service";
import { CreateGameQuizDto } from "./dto/create-gamequiz.dto";
import { UpdateGameQuizDto } from "./dto/update-gamequiz.dto";

@Controller("gamequiz")
export class GamequizController {
    constructor(private readonly gamequizService: GamequizService) {}

    @Post()
    create(@Body() createGamequizDto: CreateGameQuizDto) {
        return this.gamequizService.create(createGamequizDto);
    }

    @Get()
    findAll() {
        return this.gamequizService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.gamequizService.findOne(+id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateGamequizDto: UpdateGameQuizDto) {
        return this.gamequizService.update(+id, updateGamequizDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.gamequizService.remove(+id);
    }
}
