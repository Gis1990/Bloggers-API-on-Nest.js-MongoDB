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
import { createUserForTesting } from "./users.e2e-spec";

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

describe("auth endpoint (e2e)", () => {
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
    // Test deleting all data from the testing endpoint and expecting a status code of 204
    it("1.Should return status 204 (/delete)", async () => {
        await request(app.getHttpServer()).delete("/testing/all-data").expect(204);
    });
    // Test creating a new user and expecting a status code of 201
    it("2.Should return status 201 (/post) ", async () => {
        const correctUser = createUserForTesting(5, 2, 10);
        const response1 = await request(app.getHttpServer())
            .post("/users")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(correctUser)
            .expect(201);
        expect(response1.body.id).toEqual(expect.any(String));
        expect(response1.body.createdAt).toEqual(expect.any(String));
        expect(response1.body).toEqual({
            id: response1.body.id,
            login: correctUser.login,
            email: correctUser.email,
            createdAt: response1.body.createdAt,
        });
        // Test logging in as the new user and expecting a status code of 200 and a JWT access token and refresh token in the cookie
        const response2 = await request(app.getHttpServer())
            .post("/auth/login")
            .send({ loginOrEmail: correctUser.login, password: correctUser.password })
            .expect(200);
        expect(response2.body).toEqual({ accessToken: expect.any(String) });
        expect(response2.headers["set-cookie"]).toEqual(
            expect.arrayContaining([expect.stringContaining("refreshToken")]),
        );
        // Test sending too many login requests within a short time period and expecting a status code of 429
        await new Promise((res) => setTimeout(res, 10000));
        await request(app.getHttpServer())
            .post("/auth/login")
            .send({ loginOrEmail: correctUser.login, password: correctUser.password })
            .expect(200)
            .then(function (res) {
                return request(app.getHttpServer())
                    .post("/auth/login")
                    .send({ loginOrEmail: correctUser.login, password: correctUser.password })
                    .expect(200);
            })
            .then(function (res) {
                return request(app.getHttpServer())
                    .post("/auth/login")
                    .send({ loginOrEmail: correctUser.login, password: correctUser.password })
                    .expect(200);
            })
            .then(function (res) {
                return request(app.getHttpServer())
                    .post("/auth/login")
                    .send({ loginOrEmail: correctUser.login, password: correctUser.password })
                    .expect(200);
            })
            .then(function (res) {
                return request(app.getHttpServer())
                    .post("/auth/login")
                    .send({ loginOrEmail: correctUser.login, password: correctUser.password })
                    .expect(200);
            })
            .then(function (res) {
                return request(app.getHttpServer())
                    .post("/auth/login")
                    .send({ loginOrEmail: correctUser.login, password: correctUser.password })
                    .expect(429);
            });
        // Test logging in with an incorrect login and expecting a status code of 401
        await new Promise((res) => setTimeout(res, 10000));
        const incorrectLogin = "authUser";
        await request(app.getHttpServer())
            .post("/auth/login")
            .send({ loginOrEmail: incorrectLogin, password: correctUser.password })
            .expect(401);
        // Test logging in with an incorrect password and expecting a status code of 401
        const incorrectPassword = "authUser1Passwor";
        await request(app.getHttpServer())
            .post("/auth/login")
            .send({ loginOrEmail: correctUser.login, password: incorrectPassword })
            .expect(401);
    });
});
