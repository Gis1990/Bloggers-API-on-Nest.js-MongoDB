import { Test, TestingModule } from "@nestjs/testing";
import { GamequizController } from "./gamequiz.controller";
import { GamequizService } from "./gamequiz.service";

describe("GamequizController", () => {
    let controller: GamequizController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GamequizController],
            providers: [GamequizService],
        }).compile();

        controller = module.get<GamequizController>(GamequizController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
