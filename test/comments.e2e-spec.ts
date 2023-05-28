import "reflect-metadata";
import request from "supertest";
import {
    app,
    CheckingDbEmptiness,
    createBlogForTests,
    createOutputCommentForTesting,
    createPostForTesting,
    CreatingUsersForTesting,
    setupTestApp,
    teardownTestApp,
} from "./test.functions";

describe("comments endpoint (e2e)", () => {
    let accessTokenForUser1;
    let accessTokenForUser2;
    let userId2;
    let userLogin2;

    beforeAll(async () => {
        await setupTestApp();
        await CheckingDbEmptiness();
        const result = await CreatingUsersForTesting();
        accessTokenForUser1 = result.accessTokenForUser1;
        accessTokenForUser2 = result.accessTokenForUser2;
        userId2 = result.userId2;
        userLogin2 = result.userLogin2;
    });
    afterAll(async () => {
        await teardownTestApp();
    });
    describe("GET -> /comments/:id", () => {
        it("2.Should return status 204  (/post)", async () => {
            // create a blog for testing
            const correctBlog = createBlogForTests(10, 5, true);

            // send a POST request to create the blog and expect a 201 response
            const response2 = await request(app.getHttpServer())
                .post("/blogger/blogs")
                .set("authorization", "Bearer " + accessTokenForUser1)
                .send(correctBlog)
                .expect(201);

            // get the id of the created blog
            const blogId = response2.body.id;

            // create a post for testing
            const correctNewPost = createPostForTesting(15, 30, 200, blogId);

            // send a POST request to create the post and expect a 201 response
            const response3 = await request(app.getHttpServer())
                .post(`/blogger/blogs/${blogId}/posts`)
                .set("authorization", "Bearer " + accessTokenForUser1)
                .send(correctNewPost)
                .expect(201);

            // get the id of the created post
            const postId = response3.body.id;

            // create a comment for testing
            const outputComment1 = createOutputCommentForTesting(50, userId2, userLogin2, 0, 0, "None");

            // send a POST request to create the comment and expect a 201 response
            const response4 = await request(app.getHttpServer())
                .post(`/posts/${postId}/comments`)
                .set("authorization", "Bearer " + accessTokenForUser2)
                .send({content: outputComment1.content})
                .expect(201);

            // check if the response body matches the expected comment
            expect(response4.body).toEqual(outputComment1);

            // get the id of the created comment
            const commentId = response4.body.id;
            // Ban the user
            const response5 = await request(app.getHttpServer())
                .put(`/sa/users/${userId2}/ban`)
                .set("authorization", "Basic YWRtaW46cXdlcnR5")
                .send({
                    isBanned: true,
                    banReason: "stringstringstringst",
                })
                .expect(204);

            await request(app.getHttpServer()).get(`/comments/5`).expect(404);
            await request(app.getHttpServer()).get(`/comments/${commentId}`).expect(404);
            // UnBan the user
            const response6 = await request(app.getHttpServer())
                .put(`/sa/users/${userId2}/ban`)
                .set("authorization", "Basic YWRtaW46cXdlcnR5")
                .send({
                    isBanned: false,
                    banReason: "stringstringstringst",
                })
                .expect(204);
            await request(app.getHttpServer()).get(`/comments/${commentId}`).expect(200);

            await request(app.getHttpServer()).delete(`/blogger/blogs/${blogId}/posts/${postId}`).expect(401);

            await request(app.getHttpServer())
                .delete(`/blogger/blogs/5/posts/${postId}`)
                .set("authorization", "Bearer " + accessTokenForUser1)
                .expect(404);

            await request(app.getHttpServer())
                .delete(`/blogger/blogs/5/posts/1`)
                .set("authorization", "Bearer " + accessTokenForUser1)
                .expect(404);

            await request(app.getHttpServer())
                .delete(`/blogger/blogs/${blogId}/posts/${postId}`)
                .set("authorization", "Bearer " + accessTokenForUser1)
                .expect(204);

            await request(app.getHttpServer())
                .delete(`/blogger/blogs/${blogId}/posts/${postId}`)
                .set("authorization", "Bearer " + accessTokenForUser1)
                .expect(404);
        });

        //     const updatedCorrectContentForComment = createContentCommentForTesting(50);
        //     await request(app.getHttpServer())
        //         .put(`/comments/${commentId}`)
        //         .set("authorization", "Bearer " + accessToken1)
        //         .send({content: updatedCorrectContentForComment.content})
        //         .expect(204);
        //     await request(app.getHttpServer())
        //         .put(`/comments/5`)
        //         .set("authorization", "Bearer " + accessToken1)
        //         .send({content: updatedCorrectContentForComment.content})
        //         .expect(404);
        //     const updatedIncorrectContentForComment = createContentCommentForTesting(0);
        //     await request(app.getHttpServer())
        //         .put(`/comments/${commentId}`)
        //         .send({content: updatedCorrectContentForComment.content})
        //         .expect(401);
        //     await request(app.getHttpServer())
        //         .put(`/comments/${commentId}`)
        //         .set("authorization", "Bearer " + accessToken1)
        //         .send({content: updatedIncorrectContentForComment.content})
        //         .expect(400);
        //     await request(app.getHttpServer()).get(`/comments/5`).expect(404);
        //     const response5 = await request(app.getHttpServer()).get(`/comments/${commentId}`).expect(200);
        //     outputComment1.content = updatedCorrectContentForComment.content;
        //     expect(response5.body).toEqual(outputComment1);
        //     await request(app.getHttpServer()).delete(`/comments/${commentId}`).expect(401);
        //     await request(app.getHttpServer())
        //         .delete(`/comments/5`)
        //         .set("authorization", "Bearer " + accessToken1)
        //         .expect(404);
        //     await new Promise((res) => setTimeout(res, 10000));
        //     const correctUser2 = createUserForTesting(6, 2, 10);
        //     await request(app.getHttpServer())
        //         .post("/users")
        //         .set("authorization", "Basic YWRtaW46cXdlcnR5")
        //         .send({
        //             login: correctUser2.login,
        //             email: correctUser2.email,
        //             password: correctUser2.password,
        //         })
        //         .expect(201);
        //     const response7 = await request(app.getHttpServer())
        //         .post("/auth/login")
        //         .send({loginOrEmail: correctUser2.login, password: correctUser2.password})
        //         .expect(200);
        //     const accessToken2 = response7.body.accessToken;
        //     await request(app.getHttpServer())
        //         .put(`/comments/${commentId}`)
        //         .set("authorization", "Bearer " + accessToken2)
        //         .send({content: updatedCorrectContentForComment.content})
        //         .expect(403);
        //     await request(app.getHttpServer())
        //         .delete(`/comments/${commentId}`)
        //         .set("authorization", "Bearer " + accessToken2)
        //         .expect(403);
        //     await request(app.getHttpServer())
        //         .delete(`/comments/${commentId}`)
        //         .set("authorization", "Bearer " + accessToken1)
        //         .expect(204);
        //     const outputComment2 = createOutputCommentForTesting(50, userId1, correctUser1.login, 0, 0, "None");
        //     const response8 = await request(app.getHttpServer())
        //         .post(`/posts/${postId}/comments`)
        //         .set("authorization", "Bearer " + accessToken1)
        //         .send({content: outputComment2.content})
        //         .expect(201);
        //     expect(response8.body).toEqual(outputComment2);
        //     const commentId2 = response8.body.id;
        //     await request(app.getHttpServer())
        //         .put(`/comments/${commentId2}/like-status`)
        //         .set("authorization", "Bearer " + accessToken1)
        //         .send({likeStatus: "Like"})
        //         .expect(204);
        //     const response9 = await request(app.getHttpServer())
        //         .get(`/comments/${commentId2}`)
        //         .set("authorization", "Bearer " + accessToken1)
        //         .expect(200);
        //     expect(response9.body.likesInfo.likesCount).toBe(1);
        //     expect(response9.body.likesInfo.myStatus).toBe("Like");
        //
        //     const response10 = await request(app.getHttpServer()).get(`/comments/${commentId2}`).expect(200);
        //     expect(response10.body.likesInfo.likesCount).toBe(1);
        //     expect(response10.body.likesInfo.myStatus).toBe("None");
        //
        //     await request(app.getHttpServer())
        //         .put(`/comments/${commentId2}/like-status`)
        //         .set("authorization", "Bearer " + accessToken1)
        //         .send({likeStatus: "Dislike"})
        //         .expect(204);
        //     const response11 = await request(app.getHttpServer())
        //         .get(`/comments/${commentId2}`)
        //         .set("authorization", "Bearer " + accessToken1)
        //         .expect(200);
        //     expect(response11.body.likesInfo.dislikesCount).toBe(1);
        //     expect(response11.body.likesInfo.likesCount).toBe(0);
        //     expect(response11.body.likesInfo.myStatus).toBe("Dislike");
    });
});
