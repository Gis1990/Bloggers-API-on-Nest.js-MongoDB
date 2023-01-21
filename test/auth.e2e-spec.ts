import "reflect-metadata";
import * as request from "supertest";
import { app, createUserForTesting, setupTestApp, teardownTestApp } from "./test.functions";

describe("auth endpoint (e2e)", () => {
    beforeAll(async () => {
        await setupTestApp();
    });
    afterAll(async () => {
        await teardownTestApp();
    });
    // Test deleting all data from the testing endpoint and expecting a status code of 204
    it("1.Should return status 204 (/delete)", async () => {
        await request(app.getHttpServer()).delete("/testing/all-data").expect(204);
    });
    // Test creating a new user and expecting a status code of 201
    it("2.Should return status 201 (/post) ", async () => {
        const correctUser = createUserForTesting(5, 2, 10);
        const response1 = await request(app.getHttpServer())
            .post("/sa/users")
            .set("authorization", "Basic YWRtaW46cXdlcnR5")
            .send(correctUser)
            .expect(201);
        expect(response1.body).toEqual({
            id: expect.any(String),
            login: correctUser.login,
            email: correctUser.email,
            createdAt: expect.any(String),
            banInfo: {
                isBanned: expect.any(Boolean),
                banReason: null,
                banDate: null,
            },
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
        // await new Promise((res) => setTimeout(res, 10000));
        // await request(app.getHttpServer())
        //     .post("/sa/auth/login")
        //     .send({ loginOrEmail: correctUser.login, password: correctUser.password })
        //     .expect(200)
        //     .then(function (res) {
        //         return request(app.getHttpServer())
        //             .post("/sa/auth/login")
        //             .send({ loginOrEmail: correctUser.login, password: correctUser.password })
        //             .expect(200);
        //     })
        //     .then(function (res) {
        //         return request(app.getHttpServer())
        //             .post("/sa/auth/login")
        //             .send({ loginOrEmail: correctUser.login, password: correctUser.password })
        //             .expect(200);
        //     })
        //     .then(function (res) {
        //         return request(app.getHttpServer())
        //             .post("/sa/auth/login")
        //             .send({ loginOrEmail: correctUser.login, password: correctUser.password })
        //             .expect(200);
        //     })
        //     .then(function (res) {
        //         return request(app.getHttpServer())
        //             .post("/sa/auth/login")
        //             .send({ loginOrEmail: correctUser.login, password: correctUser.password })
        //             .expect(200);
        //     })
        //     .then(function (res) {
        //         return request(app.getHttpServer())
        //             .post("/sa/auth/login")
        //             .send({ loginOrEmail: correctUser.login, password: correctUser.password })
        //             .expect(429);
        //     });
        // // Test logging in with an incorrect login and expecting a status code of 401
        // await new Promise((res) => setTimeout(res, 10000));
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
