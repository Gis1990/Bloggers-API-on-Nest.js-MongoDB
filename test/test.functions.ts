import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { BadRequestException, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { HttpExceptionFilter } from "../src/exception.filter";
import { useContainer } from "class-validator";
import * as cookieParser from "cookie-parser";
import { MongooseModule } from "@nestjs/mongoose";
import {
    EmailRecoveryCodeClass,
    EmailRecoveryCodeSchema,
    LoginAttemptsClass,
    LoginAttemptsSchema,
    UserAccountClass,
    UserAccountEmailClass,
    UserAccountEmailSchema,
    UserDevicesDataClass,
    UserDevicesDataSchema,
    UsersAccountSchema,
} from "../src/schemas/users.schema";
import { BlogClass, BlogsSchema } from "../src/schemas/blogs.schema";
import { CommentClass, CommentsSchema } from "../src/schemas/comments.schema";
import { NewestLikesClass, NewestLikesSchema, PostClass, PostsSchema } from "../src/schemas/posts.schema";
import * as request from "supertest";

export let app: INestApplication;
let mongoServer: MongoMemoryServer;

export const testValidationPipeSettings = {
    transform: true,
    stopAtFirstError: true,
    exceptionFactory: (errors) => {
        const errorsForResponse = [];
        errors.forEach((e) => {
            const constraintsKeys = Object.keys(e.constraints);
            constraintsKeys.forEach((key) => {
                errorsForResponse.push({
                    message: e.constraints[key],
                    field: e.property,
                });
            });
        });
        throw new BadRequestException(errorsForResponse);
    },
};

export async function setupTestApp() {
    mongoose.set("strictQuery", true);
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            AppModule,
            MongooseModule.forRoot(mongoUri, { useNewUrlParser: true }),
            MongooseModule.forFeature([
                {
                    name: BlogClass.name,
                    schema: BlogsSchema,
                },
                {
                    name: CommentClass.name,
                    schema: CommentsSchema,
                },
                {
                    name: PostClass.name,
                    schema: PostsSchema,
                },
                {
                    name: UserAccountClass.name,
                    schema: UsersAccountSchema,
                },
                {
                    name: UserAccountEmailClass.name,
                    schema: UserAccountEmailSchema,
                },
                {
                    name: UserDevicesDataClass.name,
                    schema: UserDevicesDataSchema,
                },
                {
                    name: EmailRecoveryCodeClass.name,
                    schema: EmailRecoveryCodeSchema,
                },
                {
                    name: LoginAttemptsClass.name,
                    schema: LoginAttemptsSchema,
                },
                {
                    name: NewestLikesClass.name,
                    schema: NewestLikesSchema,
                },
            ]),
        ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe(testValidationPipeSettings));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.use(cookieParser());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.init();
}

export async function teardownTestApp() {
    await mongoose.disconnect();
    await mongoServer.stop();
    await app.close();
}

export async function CheckingDbEmptiness() {
    await request(app.getHttpServer()).delete("/testing/all-data").expect(204);
    const response = await request(app.getHttpServer())
        .get("/sa/users")
        .set("authorization", "Basic YWRtaW46cXdlcnR5")
        .expect(200);
    expect(response.body).toStrictEqual(emptyAllUsersDbReturnData);
    const response1 = await request(app.getHttpServer()).get("/blogs").expect(200);
    expect(response1.body).toStrictEqual(emptyAllBlogsDbReturnData);
    const response2 = await request(app.getHttpServer())
        .get("/sa/blogs")
        .set("authorization", "Basic YWRtaW46cXdlcnR5")
        .expect(200);
    expect(response2.body).toStrictEqual(emptyAllBlogsDbReturnData);
    const response3 = await request(app.getHttpServer()).get("/posts").expect(200);
    expect(response3.body).toStrictEqual(emptyAllPostsDbReturnData);
}

export async function CreatingUsersForTesting() {
    const correctUser1 = createUserForTesting(6, 2, 10);
    const response1 = await request(app.getHttpServer())
        .post("/sa/users")
        .set("authorization", "Basic YWRtaW46cXdlcnR5")
        .send(correctUser1)
        .expect(201);
    expect(response1.body).toStrictEqual({
        id: expect.any(String),
        login: correctUser1.login,
        email: correctUser1.email,
        createdAt: expect.any(String),
        banInfo: {
            isBanned: expect.any(Boolean),
            banReason: null,
            banDate: null,
        },
    });
    const userId1 = response1.body.id;
    const userLogin1 = response1.body.login;

    const correctUser2 = createUserForTesting(6, 2, 10);
    const response2 = await request(app.getHttpServer())
        .post("/sa/users")
        .set("authorization", "Basic YWRtaW46cXdlcnR5")
        .send(correctUser2)
        .expect(201);
    const userId2 = response2.body.id;
    const userLogin2 = response2.body.login;

    const correctUser3 = createUserForTesting(6, 2, 10);
    const response3 = await request(app.getHttpServer())
        .post("/sa/users")
        .set("authorization", "Basic YWRtaW46cXdlcnR5")
        .send(correctUser3)
        .expect(201);
    const userId3 = response3.body.id;

    const response4 = await request(app.getHttpServer())
        .post("/auth/login")
        .send({ loginOrEmail: correctUser1.login, password: correctUser1.password })
        .expect(200);
    const accessTokenForUser1 = response4.body.accessToken;
    const userLogin3 = response4.body.login;

    const response5 = await request(app.getHttpServer())
        .post("/auth/login")
        .send({ loginOrEmail: correctUser2.login, password: correctUser2.password })
        .expect(200);
    const accessTokenForUser2 = response5.body.accessToken;

    const response6 = await request(app.getHttpServer())
        .post("/auth/login")
        .send({ loginOrEmail: correctUser3.login, password: correctUser3.password })
        .expect(200);
    const accessTokenForUser3 = response6.body.accessToken;
    return {
        accessTokenForUser1: accessTokenForUser1,
        accessTokenForUser2: accessTokenForUser2,
        accessTokenForUser3: accessTokenForUser3,
        userId1: userId1,
        userId2: userId2,
        userId3: userId3,
        userLogin1: userLogin1,
        userLogin2: userLogin2,
        userLogin3: userLogin3,
    };
}

export const randomString = (length: number) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const createUserForTesting = (loginLen: number, emailLen: number, passwordLen: number) => {
    return {
        login: randomString(loginLen),
        email: randomString(emailLen) + "test@email.test",
        password: randomString(passwordLen),
    };
};

export const createPostForTesting = (
    titleLen: number,
    shortDescriptionLen: number,
    contentLen: number,
    blogId: string,
) => {
    return {
        title: randomString(titleLen),
        shortDescription: randomString(shortDescriptionLen),
        content: randomString(contentLen),
        blogId: blogId,
    };
};

export const createContentCommentForTesting = (contentLen: number) => {
    return {
        content: randomString(contentLen),
    };
};

export const createOutputCommentForTesting = (
    contentLen: number,
    userId: string,
    userLogin: string,
    likesCount: number,
    dislikesCount: number,
    myStatus: string,
) => {
    return {
        id: expect.any(String),
        content: randomString(contentLen),
        userId: userId,
        userLogin: userLogin,
        createdAt: expect.any(String),
        likesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: myStatus,
        },
    };
};

export const createBlogForTests = (nameLen: number, descriptionLen: number, correct: boolean) => {
    let url;
    if (correct) {
        url = "https://www.somesite.com/" + randomString(5);
    } else {
        url = "";
    }
    return {
        name: randomString(nameLen),
        description: randomString(descriptionLen),
        websiteUrl: url,
    };
};

export const createPostForTestingInBlogs = (
    titleLen: number,
    shortDescriptionLen: number,
    contentLen: number,
    blogId: string,
) => {
    return {
        title: randomString(titleLen),
        shortDescription: randomString(shortDescriptionLen),
        content: randomString(contentLen),
        blogId: blogId,
    };
};

export const emptyAllBlogsDbReturnData = {
    pagesCount: 0,
    page: 1,
    pageSize: 10,
    totalCount: 0,
    items: [],
};

export const createDbReturnDataForAllBlogs = (
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    blogs: object,
) => {
    return {
        pagesCount: pagesCount,
        page: page,
        pageSize: pageSize,
        totalCount: totalCount,
        items: [blogs],
    };
};

export const emptyAllPostsDbReturnData = {
    pagesCount: 0,
    page: 1,
    pageSize: 10,
    totalCount: 0,
    items: [],
};
export const createOutputPostForTesting = (
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    likesCount: number,
    dislikesCount: number,
    newestLikes: [],
) => {
    return {
        id: expect.any(String),
        title: title,
        shortDescription: shortDescription,
        content: content,
        blogId: blogId,
        blogName: blogName,
        createdAt: expect.any(String),
        extendedLikesInfo: {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            myStatus: expect.any(String),
            newestLikes: newestLikes,
        },
    };
};

export const emptyAllUsersDbReturnData = {
    pagesCount: 0,
    page: 1,
    pageSize: 10,
    totalCount: 0,
    items: [],
};
