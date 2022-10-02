import { Injectable } from "@nestjs/common";
import { CreateGameQuizDto } from "./dto/create-gamequiz.dto";
import { UpdateGameQuizDto } from "./dto/update-gamequiz.dto";

@Injectable()
export class GamequizService {
    create(createGameQuizDto: CreateGameQuizDto) {
        return "This action adds a new gamequiz";
    }

    findAll() {
        return `This action returns all gamequiz`;
    }

    findOne(id: number) {
        return `This action returns a #${id} gamequiz`;
    }

    update(id: number, updateGameQuizDto: UpdateGameQuizDto) {
        return `This action updates a #${id} gamequiz`;
    }

    remove(id: number) {
        return `This action removes a #${id} gamequiz`;
    }
}
