import "reflect-metadata";
import * as request from "supertest";
import { app, createUserForTesting, emptyAllUsersDbReturnData, setupTestApp, teardownTestApp } from "./test.functions";

describe("users endpoint (e2e)", () => {
    beforeAll(async () => {
        await setupTestApp();
    });
    afterAll(async () => {
        await teardownTestApp();
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
});
