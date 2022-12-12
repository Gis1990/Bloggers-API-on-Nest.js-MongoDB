import mongoose from "mongoose";
import { BlogDBClass } from "./features/blogs/entities/blogs.entity";
import { NewestLikesClass, PostDBClass } from "./features/posts/entities/posts.entity";
import {
    LoginAttemptsClass,
    RefreshTokenClass,
    SentEmailsClass,
    UserAccountDBClass,
} from "./features/users/entities/users.entity";
import { GameQuestionClass, PlayerClass, QuizGameDBClass } from "./features/gamequiz/entities/gamequiz.entity";
import { CommentDBClass } from "./features/comments/entities/comments.entity";

const blogsSchema = new mongoose.Schema<BlogDBClass>(
    {
        id: String,
        name: String,
        youtubeUrl: String,
    },
    {
        versionKey: false,
    },
);

const newestLikesSchema = new mongoose.Schema<NewestLikesClass>(
    {
        addedAt: Date,
        userId: String,
        login: String,
    },
    { _id: false },
);

const postsSchema = new mongoose.Schema<PostDBClass>(
    {
        id: String,
        title: String,
        shortDescription: String,
        content: String,
        blogId: String,
        blogName: String,
        addedAt: Date,
        extendedLikesInfo: {
            likesCount: Number,
            dislikesCount: Number,
            myStatus: String,
            newestLikes: [newestLikesSchema],
        },
        usersLikesInfo: {
            usersWhoPutLike: [String],
            usersWhoPutDislike: [String],
        },
    },
    { versionKey: false },
);

const loginAttemptsSchema = new mongoose.Schema<LoginAttemptsClass>(
    {
        attemptDate: String,
        ip: String,
    },
    { _id: false },
);

const sentEmailsSchema = new mongoose.Schema<SentEmailsClass>(
    {
        sentDate: String,
    },
    { _id: false },
);

const blacklistedRefreshTokensSchema = new mongoose.Schema<RefreshTokenClass>(
    {
        token: String,
    },
    { _id: false },
);

const playerSchema = new mongoose.Schema<PlayerClass>(
    {
        answers: [
            {
                questionId: String,
                answerStatus: String,
                addedAt: Date,
            },
        ],
        user: {
            id: String,
            login: String,
        },
        score: Number,
    },
    { _id: false },
);

const gameQuestionSchema = new mongoose.Schema<GameQuestionClass>(
    {
        id: String,
        body: String,
    },
    { _id: false },
);

const usersAccountSchema = new mongoose.Schema<UserAccountDBClass>(
    {
        id: String,
        login: String,
        email: String,
        passwordHash: String,
        createdAt: String,
        loginAttempts: [loginAttemptsSchema],
        emailConfirmation: {
            isConfirmed: Boolean,
            confirmationCode: String,
            expirationDate: Date,
            sentEmails: [sentEmailsSchema],
        },
        blacklistedRefreshTokens: [blacklistedRefreshTokensSchema],
    },
    {
        versionKey: false,
    },
);

const commentsSchema = new mongoose.Schema<CommentDBClass>(
    {
        id: String,
        content: String,
        userId: String,
        userLogin: String,
        postId: String,
        addedAt: String,
        likesInfo: {
            likesCount: Number,
            dislikesCount: Number,
            myStatus: String,
        },
        usersLikesInfo: {
            usersWhoPutLike: [String],
            usersWhoPutDislike: [String],
        },
    },
    {
        versionKey: false,
    },
);

const quizSchema = new mongoose.Schema<QuizGameDBClass>({
    id: String,
    firstPlayer: playerSchema,
    secondPlayer: playerSchema,
    questions: [gameQuestionSchema],
    status: String,
    pairCreatedDate: Date,
    startGameDate: Date,

    finishGameDate: Date,
});

export const BlogsModelClass = mongoose.model("blogs", blogsSchema);
export const PostsModelClass = mongoose.model("posts", postsSchema);
export const UsersAccountModelClass = mongoose.model("users", usersAccountSchema);
export const CommentsModelClass = mongoose.model("comments", commentsSchema);
export const QuizModelClass = mongoose.model("quiz", quizSchema);
