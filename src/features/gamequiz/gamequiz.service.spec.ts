import { Test, TestingModule } from "@nestjs/testing";
import { GamequizService } from "./gamequiz.service";

describe("GamequizService", () => {
    let service: GamequizService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GamequizService],
        }).compile();

        service = module.get<GamequizService>(GamequizService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
