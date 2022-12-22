import "reflect-metadata";
import { BadRequestException, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { AppModule } from "../src/app.module";
import mongoose from "mongoose";
import { HttpExceptionFilter } from "../src/exception.filter";
import * as cookieParser from "cookie-parser";
import { useContainer } from "class-validator";
import { randomString } from "./blogs.e2e-spec";
import { UsersAccountModelClass } from "../src/db";

const testValidationPipeSettings = {
    transform: true,
    stopAtFirstError: true,
    exceptionFactory: (errors) => {
        const errorsForResponse = [];
        errors.forEach((e) => {
            const constraintsKeys = Object.keys(e.constraints);
            constraintsKeys.forEach((ckey) => {
                errorsForResponse.push({
                    message: e.constraints[ckey],
                    field: e.property,
                });
            });
        });
        throw new BadRequestException(errorsForResponse);
    },
};

export const createUserForTesting = (loginLen: number, emailLen: number, passwordLen: number) => {
    return {
        login: randomString(loginLen),
        email: randomString(emailLen) + "test@email.test",
        password: randomString(passwordLen),
    };
};

describe("users endpoint (e2e)", () => {
    const emptyAllUsersDbReturnData = {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
    };
    let app: INestApplication;

    beforeAll(async () => {
        mongoose.set("strictQuery", false);
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.enableCors();
        app.useGlobalPipes(new ValidationPipe(testValidationPipeSettings));
        app.useGlobalFilters(new HttpExceptionFilter());
        app.use(cookieParser());
        useContainer(app.select(AppModule), { fallbackOnErrors: true });
        await app.init();
    });
    afterAll(async () => {
        await mongoose.disconnect();
        await app.close();
    });
    it("1.Should return status 204 (/delete)", async () => {
        await request(app.getHttpServer()).delete("/testing/all-data").expect(204);
    });
    it("2.Should return status 200 and correct body (/get)", async () => {
        const response = await request(app.getHttpServer()).get("/users").expect(200);
        expect(response.body).toEqual(emptyAllUsersDbReturnData);
    });
    it("3.Should return status 401 (/post) ", async () => {
        const correctUser = createUserForTesting(5, 2, 10);
        await request(app.getHttpServer()).post("/users").send(correctUser).expect(401);
    });
    it("4.Should return status 201 (/post) ", async () => {
        const correctUser = createUserForTesting(6, 2, 10);
        const response = await request(app.getHttpServer())
            .post("/users")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(correctUser)
            .expect(201);
        expect(response.body.id).toEqual(expect.any(String));
        expect(response.body.createdAt).toEqual(expect.any(String));
        expect(response.body).toEqual({
            id: response.body.id,
            login: correctUser.login,
            email: correctUser.email,
            createdAt: response.body.createdAt,
        });
        //Should return status 400 (/post)
        const incorrectUser1 = createUserForTesting(5, 2, 10);
        incorrectUser1.login = correctUser.login;
        const response2 = await request(app.getHttpServer())
            .post("/users")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(incorrectUser1)
            .expect(400);
        expect(response2.body).toEqual({ errorsMessages: [{ field: "login", message: expect.any(String) }] });
        //Should return status 400 (/post) '
        const incorrectUser2 = createUserForTesting(5, 2, 10);
        incorrectUser2.email = correctUser.email;
        const response3 = await request(app.getHttpServer())
            .post("/users")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(incorrectUser2)
            .expect(400);
        expect(response3.body).toEqual({ errorsMessages: [{ field: "email", message: expect.any(String) }] });
    });
    it("5.Should return status 400 (/post) ", async () => {
        const incorrectEmail = "test";
        const incorrectUser = createUserForTesting(5, 2, 10);
        incorrectUser.email = incorrectEmail;
        const response = await request(app.getHttpServer())
            .post("/users")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(incorrectUser)
            .expect(400);
        expect(response.body).toEqual({ errorsMessages: [{ field: "email", message: expect.any(String) }] });
    });
    it("6.Should return status 400 (/post) ", async () => {
        const incorrectUser = createUserForTesting(0, 2, 10);
        const response = await request(app.getHttpServer())
            .post("/users")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(incorrectUser)
            .expect(400);
        expect(response.body).toEqual({ errorsMessages: [{ field: "login", message: expect.any(String) }] });
    });
    it("7.Should return status 201 (/post) ", async () => {
        const correctUser2 = createUserForTesting(5, 2, 10);
        const response = await request(app.getHttpServer())
            .post("/users")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(correctUser2)
            .expect(201);
        expect(response.body.id).toEqual(expect.any(String));
        expect(response.body.createdAt).toEqual(expect.any(String));
        expect(response.body).toEqual({
            id: response.body.id,
            login: correctUser2.login,
            email: correctUser2.email,
            createdAt: response.body.createdAt,
        });
    });
    it("8.Should return status 200 and correct body (/get)", async () => {
        const dbData = await UsersAccountModelClass.find(
            {},
            {
                _id: 0,
                id: 1,
                login: 1,
                email: 1,
                createdAt: 1,
            },
        )
            .sort({ createdAt: -1 })
            .lean();
        const response = await request(app.getHttpServer()).get("/users").expect(200);
        expect(response.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: dbData,
        });
    });
    it("9.Should return status 200 and correct body with pagination (/get)", async () => {
        const dbData = await UsersAccountModelClass.find(
            {},
            {
                _id: 0,
                id: 1,
                login: 1,
                email: 1,
                createdAt: 1,
            },
        )
            .sort({ createdAt: -1 })
            .lean();
        const response = await request(app.getHttpServer()).get("/users?pageNumber=1&pageSize=1").expect(200);
        expect(response.body).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 1,
            totalCount: 2,
            items: [dbData[0]],
        });
    });
    it("10.Should return status 200 and correct body with pagination (/get)", async () => {
        const dbData = await UsersAccountModelClass.find(
            {},
            {
                _id: 0,
                id: 1,
                login: 1,
                email: 1,
                createdAt: 1,
            },
        )
            .sort({ createdAt: -1 })
            .lean();
        const response = await request(app.getHttpServer()).get("/users?pageNumber=2&pageSize=1").expect(200);
        expect(response.body).toEqual({
            pagesCount: 2,
            page: 2,
            pageSize: 1,
            totalCount: 2,
            items: [dbData[1]],
        });
    });
    it("11.Should return status 401 for not authorized user (/delete)", async () => {
        const dbData = await UsersAccountModelClass.find(
            {},
            {
                _id: 0,
                id: 1,
                login: 1,
                email: 1,
                createdAt: 1,
            },
        )
            .sort({ createdAt: -1 })
            .lean();
        await request(app.getHttpServer()).delete(`/users/${dbData[0].id}`).expect(401);
    });
    it("12.Should return status 404 for non existing id (/delete)", async () => {
        await request(app.getHttpServer())
            .delete(`/users/000`)
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(404);
    });
    it("13.Should return status 204 and delete user (/delete)", async () => {
        const dbData = await UsersAccountModelClass.find(
            {},
            {
                _id: 0,
                id: 1,
                login: 1,
                email: 1,
                createdAt: 1,
            },
        )
            .sort({ createdAt: -1 })
            .lean();
        await request(app.getHttpServer())
            .delete(`/users/${dbData[0].id}`)
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .expect(204);
        expect(
            await UsersAccountModelClass.find(
                {},
                {
                    _id: 0,
                    id: 1,
                    login: 1,
                    email: 1,
                    createdAt: 1,
                },
            )
                .sort({ createdAt: -1 })
                .lean(),
        ).toEqual([dbData[1]]);
    });
});
