import * as request from "supertest";
import { app, setupTestApp, teardownTestApp } from "./test.functions";

describe("AppController (e2e)", () => {
    beforeAll(async () => {
        await setupTestApp();
    });
    afterAll(async () => {
        await teardownTestApp();
    });

    it("/ (GET)", () => {
        return request(app.getHttpServer()).get("/").expect(200).expect("Hello World!");
    });
});
