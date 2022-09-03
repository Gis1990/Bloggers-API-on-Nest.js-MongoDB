export class GameQuestionClass {
    constructor(public id: string, public body: string) {}
}

export class QuizGameDBClass {
    constructor(
        public id: string,
        public firstPlayer: PlayerClass,
        public secondPlayer: PlayerClass,
        public questions: [GameQuestionClass],
        public status: string,
        public pairCreatedDate: Date,
        public startGameDate: Date,
        public finishGameDate: Date,
    ) {}
}

export class PlayerClass {
    constructor(
        public answers: [{ questionId: string; answerStatus: string; addedAt: Date }],
        public user: { id: string; login: string },
        public score: number,
    ) {}
}
