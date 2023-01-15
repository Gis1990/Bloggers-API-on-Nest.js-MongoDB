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
} from "../src/features/super-admin/users/users.schema";
import { BlogClass, BlogsSchema } from "../src/features/blogs/blogs.schema";
import { CommentClass, CommentsSchema } from "../src/features/comments/comments.schema";
import { NewestLikesClass, NewestLikesSchema, PostClass, PostsSchema } from "../src/features/posts/posts.schema";
import * as request from "supertest";

export const BlogsModelClass = mongoose.connection.collection("blogclasses");

export let app: INestApplication;
export let mongoServer: MongoMemoryServer;

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
    mongoose.set("strictQuery", false);
    const mongoServer = await MongoMemoryServer.create();
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
}

export async function teardownTestApp() {
    await mongoose.disconnect();
    await app.close();
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
